import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CuteToddler } from './CuteGuyAvatar';
import { io } from 'socket.io-client';
import {
  adminGetProfile,
  deleteAdminMessage,
  editAdminMessage,
  kickAdminMember,
  deleteAdminMember,
  adminLoginWithPassword,
  fetchActiveMembers,
  fetchAdminConversation,
  fetchMemberFeed,
  markMessagesAsSeen,
  deleteMemberSelf,
  resolveMemberIdentity,
  sendCallSignal,
  sendTypingStatus,
  sendAdminMessage,
  sendHeartbeat,
  sendMemberMessage,
  requestAdminAiSuggestion,
} from '../services/adminService';

const stripTrailingApi = (url = '') => String(url || '').trim().replace(/\/api\/?$/, '').replace(/\/+$/, '');
const ENV_BACKEND_URL = stripTrailingApi(import.meta.env.VITE_BACKEND_URL || '');
const SOCKET_URL =
  stripTrailingApi(
    import.meta.env.VITE_SOCKET_URL ||
      ENV_BACKEND_URL ||
      (typeof window !== 'undefined' ? window.location.origin : '') ||
      'http://localhost:3000'
  )
;
const SOCKET_ENABLED = (() => {
  const flag = String(import.meta.env.VITE_ENABLE_SOCKET || '').trim().toLowerCase();
  if (flag === 'true') return true;
  if (flag === 'false') return false;
  return /localhost|127\.0\.0\.1/i.test(SOCKET_URL);
})();
const MEMBER_ID_KEY = 'study_plan_member_id_v1';
const MEMBER_NAME_KEY = 'study_plan_member_name_v1';
const USER_MODE_KEY = 'study_plan_user_mode_v1';
const ADMIN_TOKEN_KEY = 'study_plan_admin_token_v1';
const MEMBER_SESSION_ID_KEY = 'study_plan_member_session_id_v1';
const MEMBER_GEO_CACHE_PREFIX = 'study_plan_member_geo_v1';
const LAST_VIEWED_ADMIN_ID_PREFIX = 'study_plan_last_viewed_admin_msg_v1';
const RECENT_EMOJI_KEY = 'study_plan_recent_emoji_v1';
const RECENT_STICKER_KEY = 'study_plan_recent_sticker_v1';
const MEMBER_MESSAGES_CACHE_PREFIX = 'study_plan_member_messages_cache_v1';
const ADMIN_MEMBERS_CACHE_KEY = 'study_plan_admin_members_cache_v1';
const ADMIN_CONVERSATIONS_CACHE_KEY = 'study_plan_admin_conversations_cache_v1';

const HEARTBEAT_MS = 10000;
const MEMBER_FEED_POLL_MS = 900;
const ADMIN_MEMBER_POLL_MS = 3200;
const ADMIN_CONVERSATION_POLL_MS = 1800;
const TYPING_IDLE_MS = 1500;
const MAX_CACHED_MESSAGES = 250;
const MAX_CACHE_ATTACHMENT_DATA_URL_CHARS = 240000;
const ADMIN_MEMBER_MISSING_GRACE_MS = 120000;
const CALL_STUN_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }, { urls: 'stun:stun1.l.google.com:19302' }];

const INITIAL_MEMBER_MESSAGE = {
  id: 0,
  role: 'assistant',
  source: 'system',
  content: 'Welcome. You can send questions here and receive guided replies.',
  createdAt: new Date().toISOString(),
};

const EMOJI_GROUPS = [
  ['😀', '😁', '😂', '🤣', '😊', '😍', '😘', '😉', '😎', '🥳'],
  ['👍', '👏', '🙌', '🙏', '🤝', '💯', '🔥', '✨', '🎯', '🚀'],
  ['🤔', '😴', '😅', '🥹', '😭', '😤', '🤯', '🙈', '💬', '❤️'],
];

const STICKER_LIBRARY = [
  { text: 'You got this', emoji: '🔥', tone: 'violet' },
  { text: 'Proud of you', emoji: '💫', tone: 'rose' },
  { text: 'Code mode', emoji: '💻', tone: 'teal' },
  { text: 'Legend move', emoji: '🚀', tone: 'amber' },
  { text: 'Stay focused', emoji: '🎯', tone: 'violet' },
  { text: 'Keep smiling', emoji: '😊', tone: 'rose' },
  { text: 'Power hour', emoji: '⚡', tone: 'amber' },
  { text: 'Brain boost', emoji: '🧠', tone: 'teal' },
  { text: 'One more win', emoji: '🏆', tone: 'violet' },
  { text: 'Great vibe', emoji: '✨', tone: 'rose' },
  { text: 'Ship it', emoji: '✅', tone: 'teal' },
  { text: 'Unstoppable', emoji: '🌟', tone: 'amber' },
  { text: 'Calm and code', emoji: '🌙', tone: 'violet' },
  { text: 'You are magic', emoji: '🪄', tone: 'rose' },
  { text: 'Crush today', emoji: '💪', tone: 'amber' },
  { text: 'Keep learning', emoji: '📚', tone: 'teal' },
];
const STICKER_AVATAR_POOL = ['🦊', '🐼', '🦁', '🐻', '🐯', '🐨', '🦄', '🐸', '🐵', '🐱', '🐶', '🐰'];

const generateId = () => `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
const getMemberMessagesCacheKey = (memberId) => `${MEMBER_MESSAGES_CACHE_PREFIX}_${memberId}`;
const getMemberGeoCacheKey = (memberId) => `${MEMBER_GEO_CACHE_PREFIX}_${memberId}`;
const getSafeLocalStorage = () => (typeof window !== 'undefined' ? window.localStorage : null);
const getSafeSessionStorage = () => (typeof window !== 'undefined' ? window.sessionStorage : null);
const safeReadJson = (key, fallbackValue) => {
  const storage = getSafeLocalStorage();
  if (!storage) return fallbackValue;
  try {
    const raw = storage.getItem(key);
    if (!raw) return fallbackValue;
    const parsed = JSON.parse(raw);
    return parsed ?? fallbackValue;
  } catch {
    return fallbackValue;
  }
};
const safeWriteJson = (key, value) => {
  const storage = getSafeLocalStorage();
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore storage quota errors.
  }
};
const purgeMemberCaches = (memberId) => {
  const targetId = String(memberId || '').trim();
  if (!targetId) return;

  const storage = getSafeLocalStorage();
  if (!storage) return;

  try {
    storage.removeItem(getMemberMessagesCacheKey(targetId));
    storage.removeItem(getLastViewedKey(targetId));

    const cachedMembers = safeReadJson(ADMIN_MEMBERS_CACHE_KEY, []);
    if (Array.isArray(cachedMembers)) {
      safeWriteJson(
        ADMIN_MEMBERS_CACHE_KEY,
        cachedMembers.filter((member) => String(member?.memberId || '') !== targetId)
      );
    }

    const cachedConversations = safeReadJson(ADMIN_CONVERSATIONS_CACHE_KEY, {});
    if (cachedConversations && typeof cachedConversations === 'object') {
      const next = { ...cachedConversations };
      delete next[targetId];
      safeWriteJson(ADMIN_CONVERSATIONS_CACHE_KEY, next);
    }
  } catch {
    // Ignore storage errors.
  }
};
const compactAttachmentForCache = (attachment) => {
  if (!attachment || typeof attachment !== 'object') return null;
  const dataUrl = String(attachment.dataUrl || '');
  return {
    name: String(attachment.name || 'file').slice(0, 120),
    type: String(attachment.type || 'application/octet-stream').slice(0, 120),
    size: Number(attachment.size || 0),
    dataUrl: dataUrl.length <= MAX_CACHE_ATTACHMENT_DATA_URL_CHARS ? dataUrl : '',
  };
};
const compactMessageForCache = (message) => {
  if (!message || typeof message !== 'object') return null;
  return {
    id: message.id,
    memberId: message.memberId,
    from: message.from,
    role: message.role,
    source: message.source,
    content: String(message.content || ''),
    createdAt: message.createdAt,
    editedAt: message.editedAt || null,
    deliveredAt: message.deliveredAt || null,
    seenAt: message.seenAt || null,
    readByMember: Boolean(message.readByMember),
    readByAdmin: Boolean(message.readByAdmin),
    pending: Boolean(message.pending),
    status: message.status || '',
    attachments: Array.isArray(message.attachments)
      ? message.attachments.map(compactAttachmentForCache).filter(Boolean)
      : [],
  };
};
const compactMessagesForCache = (messages, limit = MAX_CACHED_MESSAGES) =>
  (Array.isArray(messages) ? messages : [])
    .map(compactMessageForCache)
    .filter(Boolean)
    .slice(-limit);
const pickStickerAvatar = (seedInput = '') => {
  const seed = String(seedInput || '');
  if (!seed) return STICKER_AVATAR_POOL[Math.floor(Math.random() * STICKER_AVATAR_POOL.length)];
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return STICKER_AVATAR_POOL[hash % STICKER_AVATAR_POOL.length];
};

const getLastViewedKey = (memberId) => `${LAST_VIEWED_ADMIN_ID_PREFIX}_${memberId}`;
const getOrCreateMemberSessionId = () => {
  const storage = getSafeSessionStorage();
  if (!storage) return generateId();
  try {
    let sessionId = storage.getItem(MEMBER_SESSION_ID_KEY) || '';
    if (!sessionId) {
      sessionId = generateId();
      storage.setItem(MEMBER_SESSION_ID_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return generateId();
  }
};

const readLastViewedAdminId = (memberId) => {
  if (!memberId || typeof window === 'undefined') return 0;
  const raw = Number(localStorage.getItem(getLastViewedKey(memberId)) || 0);
  return Number.isFinite(raw) && raw > 0 ? raw : 0;
};

const getOrCreateMemberIdentity = () => {
  let memberId = localStorage.getItem(MEMBER_ID_KEY) || '';

  if (!memberId) {
    memberId = generateId();
    localStorage.setItem(MEMBER_ID_KEY, memberId);
  }

  const memberName = localStorage.getItem(MEMBER_NAME_KEY) || '';
  return { memberId, memberName };
};

const getSortableId = (id) => {
  const numeric = Number(id);
  if (Number.isFinite(numeric)) return numeric;
  return Number.MAX_SAFE_INTEGER;
};

const getSortableTime = (createdAt) => {
  const timestamp = new Date(createdAt || '').getTime();
  if (Number.isFinite(timestamp)) return timestamp;
  return 0;
};

const dedupeMessages = (items) => {
  const map = new Map();
  items.forEach((item) => map.set(String(item.id), item));
  return Array.from(map.values()).sort((a, b) => {
    const aTime = getSortableTime(a.createdAt);
    const bTime = getSortableTime(b.createdAt);
    if (aTime !== bTime) return aTime - bTime;
    const aId = getSortableId(a.id);
    const bId = getSortableId(b.id);
    if (aId !== bId) return aId - bId;
    return String(a.id).localeCompare(String(b.id));
  });
};

const formatDateTime = (iso) => {
  if (!iso) return '';
  const date = new Date(iso);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
};

const formatRelative = (timestamp) => {
  if (!timestamp) return 'never';
  const deltaSec = Math.max(0, Math.floor((Date.now() - Number(timestamp)) / 1000));
  if (deltaSec < 60) return `${deltaSec}s ago`;
  const min = Math.floor(deltaSec / 60);
  if (min < 60) return `${min}m ago`;
  const hrs = Math.floor(min / 60);
  return `${hrs}h ago`;
};

const formatDuration = (seconds = 0) => {
  const safe = Math.max(0, Number(seconds) || 0);
  const min = Math.floor(safe / 60);
  const sec = safe % 60;
  return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
};

const normalizeSearchQuery = (value = '') => String(value || '').trim().toLowerCase();

const messageSignature = (message = {}) => {
  const attachments = Array.isArray(message.attachments) ? message.attachments : [];
  const attachmentSig = attachments
    .map((item) => `${item?.name || ''}:${item?.type || ''}:${Number(item?.size || 0)}`)
    .join('|');
  return [
    String(message.id ?? ''),
    String(message.content || ''),
    String(message.createdAt || ''),
    String(message.editedAt || ''),
    String(message.deliveredAt || ''),
    String(message.seenAt || ''),
    message.readByMember ? '1' : '0',
    message.readByAdmin ? '1' : '0',
    message.pending ? '1' : '0',
    String(message.status || ''),
    attachmentSig,
  ].join('~');
};

const areMessageListsEqual = (left = [], right = []) => {
  if (left === right) return true;
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    if (messageSignature(left[i]) !== messageSignature(right[i])) return false;
  }
  return true;
};

const memberSignature = (member = {}) =>
  [
    String(member.memberId || ''),
    String(member.memberName || ''),
    String(member.clientState || ''),
    member.isOnline ? '1' : '0',
    String(member.path || ''),
    String(member.pageVisibility || ''),
    member.windowFocused ? '1' : '0',
    String(member.lastSeenAt || ''),
    String(member.lastActivityAt || ''),
    String(member.unreadCount || 0),
    String(member.activeSessionCount || 0),
    String(member.visibleSessionCount || 0),
    String(member.focusedSessionCount || 0),
    member.isTyping ? '1' : '0',
    String(member.typingText || ''),
  ].join('~');

const areMemberListsEqual = (left = [], right = []) => {
  if (left === right) return true;
  if (!Array.isArray(left) || !Array.isArray(right)) return false;
  if (left.length !== right.length) return false;
  for (let i = 0; i < left.length; i += 1) {
    if (memberSignature(left[i]) !== memberSignature(right[i])) return false;
  }
  return true;
};

const messageMatchesQuery = (message = {}, query = '') => {
  const q = normalizeSearchQuery(query);
  if (!q) return true;
  const content = String(message.content || '').toLowerCase();
  if (content.includes(q)) return true;
  const when = String(formatDateTime(message.createdAt || '')).toLowerCase();
  if (when.includes(q)) return true;
  const attachments = Array.isArray(message.attachments) ? message.attachments : [];
  return attachments.some((attachment) => {
    const name = String(attachment?.name || '').toLowerCase();
    const type = String(attachment?.type || '').toLowerCase();
    return name.includes(q) || type.includes(q);
  });
};

const filterMessagesByQuery = (items = [], query = '') => {
  if (!query) return Array.isArray(items) ? items : [];
  return (Array.isArray(items) ? items : []).filter((message) => messageMatchesQuery(message, query));
};

const isUnauthorizedError = (errorText = '') => /unauthorized/i.test(String(errorText));

const getMemberPresenceSnapshot = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return {
      pageVisibility: 'visible',
      windowFocused: true,
      clientState: 'active',
      browserOnline: true,
    };
  }

  const pageVisibility = document.visibilityState || 'visible';
  const windowFocused = typeof document.hasFocus === 'function' ? document.hasFocus() : true;
  const browserOnline = navigator?.onLine !== false;

  let clientState = 'active';
  if (!browserOnline) clientState = 'offline';
  else if (pageVisibility !== 'visible') clientState = 'hidden';
  else if (!windowFocused) clientState = 'background';

  return {
    pageVisibility,
    windowFocused,
    clientState,
    browserOnline,
  };
};

const buildStickerAttachment = (text, tone = 'violet', seed = '') => {
  const cleanText = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 80);
  if (!cleanText) return null;
  const avatar = pickStickerAvatar(seed || `${cleanText}-${tone}-${Date.now()}`);
  const palettes = {
    violet: { start: '#8b5cf6', end: '#6366f1', accent: '#f5f3ff' },
    rose: { start: '#f43f5e', end: '#ec4899', accent: '#fff1f2' },
    teal: { start: '#0ea5e9', end: '#14b8a6', accent: '#ecfeff' },
    amber: { start: '#f59e0b', end: '#f97316', accent: '#fffbeb' },
  };
  const colors = palettes[tone] || palettes.violet;
  const escaped = cleanText
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="512" height="512">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${colors.start}" />
          <stop offset="100%" stop-color="${colors.end}" />
        </linearGradient>
      </defs>
      <rect x="8" y="8" width="496" height="496" rx="72" fill="url(#g)" />
      <rect x="24" y="24" width="464" height="464" rx="58" fill="none" stroke="${colors.accent}" stroke-opacity="0.5" stroke-width="3" />
      <circle cx="432" cy="80" r="42" fill="rgba(255,255,255,0.22)" />
      <text x="432" y="88" fill="#ffffff" font-family="Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, sans-serif" font-size="44" text-anchor="middle">${avatar}</text>
      <text x="256" y="256" fill="#ffffff" font-family="ui-sans-serif, system-ui, -apple-system" font-weight="700" font-size="42" text-anchor="middle" dominant-baseline="middle">${escaped}</text>
    </svg>
  `.trim();
  const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  return {
    name: `sticker-${Date.now()}.svg`,
    type: 'image/svg+xml',
    size: dataUrl.length,
    dataUrl,
    stickerText: cleanText,
    stickerAvatar: avatar,
  };
};

const buildLocalFlirtySuggestions = ({ toneRequest = '', targetName = 'there', contextText = '' }) => {
  const mood = String(toneRequest || '').toLowerCase();
  const context = String(contextText || '').trim();
  const contextHint = context ? ` (${context.slice(0, 24)}...)` : '';
  const base = [
    `You are doing great, ${targetName}. Keep that momentum.`,
    `I like your focus${contextHint}. Ready for the next challenge?`,
    `You are close. One more push and you win this.`,
    `Strong effort from you today. Proud of that consistency.`,
    `Let us lock this in and finish cleanly.`,
  ];
  if (mood.includes('playful') || mood.includes('flirty')) {
    return [
      `You are dangerously smart, ${targetName}.`,
      `Your focus is attractive. Keep going.`,
      `You and clean logic are a perfect match.`,
      `That was smooth. Show me one more win.`,
      `Your progress today is genuinely impressive.`,
    ];
  }
  return base;
};

const toPreviewText = (message) => {
  if (!message) return '';
  const content = String(message.content || '').trim();
  const attachments = Array.isArray(message.attachments) ? message.attachments.length : 0;
  if (content && attachments > 0) return `${content.slice(0, 80)} ${attachments > 1 ? `(+${attachments} files)` : '(+1 file)'}`;
  if (content) return content.slice(0, 100);
  if (attachments > 0) return attachments > 1 ? `${attachments} files received` : '1 file received';
  return 'New message';
};

const countUnreadAdminMessages = (items, lastViewedId = 0) => {
  const threshold = Number(lastViewedId) || 0;
  return (Array.isArray(items) ? items : []).reduce((count, msg) => {
    if (!msg || msg.from !== 'admin') return count;
    if (msg.readByMember) return count;
    const numericId = Number(msg.id);
    if (!Number.isFinite(numericId) || numericId <= threshold) return count;
    return count + 1;
  }, 0);
};

const readFilesAsAttachments = async (fileList) => {
  const files = Array.from(fileList || []).slice(0, 5);
  const tasks = files.map(
    (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve({
            name: file.name,
            type: file.type || 'application/octet-stream',
            size: file.size,
            dataUrl: String(reader.result || ''),
          });
        };
        reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
        reader.readAsDataURL(file);
      })
  );
  return Promise.all(tasks);
};

const blobToAttachment = (blob, preferredName = 'voice-message') =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const mime = String(blob.type || 'audio/webm');
      const ext = mime.includes('mp4') ? 'm4a' : mime.includes('ogg') ? 'ogg' : mime.includes('wav') ? 'wav' : 'webm';
      resolve({
        name: `${preferredName}-${Date.now()}.${ext}`,
        type: mime,
        size: blob.size,
        dataUrl: String(reader.result || ''),
      });
    };
    reader.onerror = () => reject(new Error('Failed to process voice message'));
    reader.readAsDataURL(blob);
  });

const RichAudioPlayer = ({ src, compact = false, theme = 'slate' }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [bufferedEnd, setBufferedEnd] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const progress = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const bufferedProgress = duration > 0 ? Math.min(100, (bufferedEnd / duration) * 100) : 0;

  const setAudioRate = useCallback((nextRate) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch {
      setIsPlaying(false);
    }
  }, []);

  const seekTo = useCallback((event) => {
    const audio = audioRef.current;
    if (!audio) return;
    const next = Number(event.target.value || 0);
    audio.currentTime = Math.max(0, Math.min(next, Number.isFinite(audio.duration) ? audio.duration : next));
    setCurrentTime(next);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    const handleLoaded = () => {
      setDuration(Number.isFinite(audio.duration) ? Math.floor(audio.duration) : 0);
      setCurrentTime(Number.isFinite(audio.currentTime) ? Math.floor(audio.currentTime) : 0);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(Number.isFinite(audio.currentTime) ? Math.floor(audio.currentTime) : 0);
      if (audio.buffered && audio.buffered.length > 0) {
        const end = audio.buffered.end(audio.buffered.length - 1);
        setBufferedEnd(Number.isFinite(end) ? Math.floor(end) : 0);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleEnded = () => {
      setIsPlaying(false);
      setIsBuffering(false);
    };

    audio.addEventListener('loadedmetadata', handleLoaded);
    audio.addEventListener('durationchange', handleLoaded);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('progress', handleTimeUpdate);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('ended', handleEnded);

    handleLoaded();
    handleTimeUpdate();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoaded);
      audio.removeEventListener('durationchange', handleLoaded);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('progress', handleTimeUpdate);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [src]);

  const tone =
    theme === 'admin'
      ? {
          shell: 'border-indigo-200/40 bg-indigo-950/30',
          button: 'border-indigo-200/60 bg-indigo-400/20 text-indigo-50 hover:bg-indigo-400/35',
          rail: 'bg-indigo-900/35',
          buffer: 'bg-indigo-200/40',
          progress: 'bg-indigo-100',
          text: 'text-indigo-50',
          chip: 'bg-indigo-900/50 text-indigo-100 border-indigo-200/40',
        }
      : {
          shell: 'border-slate-600/80 bg-slate-900/80',
          button: 'border-indigo-400/60 bg-indigo-500/20 text-indigo-100 hover:bg-indigo-500/35',
          rail: 'bg-slate-700',
          buffer: 'bg-slate-500/70',
          progress: 'bg-indigo-400',
          text: 'text-slate-300',
          chip: 'bg-slate-800 text-slate-300 border-slate-600',
        };

  return (
    <div className={`rounded-xl border p-2.5 ${compact ? '' : 'shadow-inner'} ${tone.shell}`}>
      <audio ref={audioRef} preload="metadata" src={src} />
      <div className="mb-2 flex items-center gap-2">
        <button
          type="button"
          onClick={togglePlay}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full border ${tone.button}`}
        >
          {isPlaying ? (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5h3v14H8zM13 5h3v14h-3z" />
            </svg>
          ) : (
            <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
        <div className={`min-w-0 flex-1 text-[11px] ${tone.text}`}>
          <div className="mb-1 flex items-center justify-between gap-2">
            <span>{formatDuration(currentTime)}</span>
            <span>{formatDuration(duration)}</span>
          </div>
          <div className={`relative h-2 overflow-hidden rounded-full ${tone.rail}`}>
            <div className={`absolute inset-y-0 left-0 ${tone.buffer}`} style={{ width: `${bufferedProgress}%` }} />
            <div className={`absolute inset-y-0 left-0 ${tone.progress}`} style={{ width: `${progress}%` }} />
            <input
              type="range"
              min={0}
              max={Math.max(duration, 0)}
              value={Math.min(currentTime, Math.max(duration, 0))}
              onChange={seekTo}
              className="absolute inset-0 h-full w-full cursor-pointer appearance-none bg-transparent"
              aria-label="Seek audio"
            />
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
        <span className={`rounded-md px-1.5 py-0.5 font-semibold ${tone.chip}`}>Speed</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
          <button
            key={`rate_${rate}`}
            type="button"
            onClick={() => setAudioRate(rate)}
            className={`rounded-md px-1.5 py-0.5 ${
              playbackRate === rate
                ? 'bg-indigo-500/70 text-white'
                : `border ${tone.chip} hover:border-indigo-400`
            }`}
          >
            {rate}x
          </button>
        ))}
        {isBuffering && <span className="ml-auto text-[10px] text-amber-300">Buffering...</span>}
      </div>
    </div>
  );
};

const AttachmentList = ({ attachments = [], theme = 'slate' }) => {
  if (!Array.isArray(attachments) || attachments.length === 0) return null;
  return (
    <div className="mt-2 space-y-2">
      {attachments.map((attachment, index) => {
        const key = `${attachment.name || 'file'}_${index}`;
        const type = String(attachment.type || '');
        const isImage = type.startsWith('image/');
        const isVideo = type.startsWith('video/');
        const isAudio = type.startsWith('audio/');

        if (isImage) {
          return (
            <a key={key} href={attachment.dataUrl} download={attachment.name || 'image'} className="block">
              <img
                src={attachment.dataUrl}
                alt={attachment.name || 'attachment'}
                className="max-h-52 w-full rounded-lg border border-white/20 object-cover"
              />
            </a>
          );
        }

        if (isVideo) {
          return (
            <video
              key={key}
              controls
              preload="metadata"
              src={attachment.dataUrl}
              className="max-h-64 w-full rounded-lg border border-white/20 bg-black"
            />
          );
        }

        if (isAudio) {
          return <RichAudioPlayer key={key} src={attachment.dataUrl} theme={theme} />;
        }

        return (
          <a
            key={key}
            href={attachment.dataUrl}
            download={attachment.name || 'file'}
            className="block rounded-lg border border-white/20 bg-black/20 px-2 py-1.5 text-xs underline"
          >
            {attachment.name || 'file'}
          </a>
        );
      })}
    </div>
  );
};

const ComposerAttachmentPreview = ({ attachments = [], onRemove }) => {
  if (!Array.isArray(attachments) || attachments.length === 0) return null;

  return (
    <div className="mb-2 space-y-2 rounded-xl border border-slate-600 bg-slate-900/60 p-2.5">
      {attachments.map((attachment, index) => {
        const type = String(attachment.type || '');
        const isAudio = type.startsWith('audio/');
        const isImage = type.startsWith('image/');
        const isVideo = type.startsWith('video/');
        const sizeInKb = Number(attachment.size || 0) / 1024;

        return (
          <div key={`${attachment.name || 'file'}_${index}`} className="rounded-lg border border-slate-700 bg-slate-800 p-2">
            <div className="mb-1 flex items-center justify-between gap-2">
              <div className="truncate text-[11px] font-medium text-slate-200">{attachment.name || 'attachment'}</div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="rounded-md border border-slate-600 px-1.5 py-0.5 text-[10px] text-slate-300 hover:border-rose-400 hover:text-rose-200"
              >
                Remove
              </button>
            </div>
            <div className="mb-1 text-[10px] text-slate-400">
              {type || 'file'} • {sizeInKb > 0 ? `${sizeInKb.toFixed(1)} KB` : '--'}
            </div>
            {isImage && (
              <img
                src={attachment.dataUrl}
                alt={attachment.name || 'preview'}
                className="mb-1 max-h-36 w-full rounded-md border border-slate-700 object-cover"
              />
            )}
            {isVideo && (
              <video
                controls
                preload="metadata"
                src={attachment.dataUrl}
                className="mb-1 max-h-36 w-full rounded-md border border-slate-700 bg-black"
              />
            )}
            {isAudio && (
              <RichAudioPlayer src={attachment.dataUrl} compact />
            )}
            {!isAudio && !isImage && !isVideo && attachment.dataUrl && (
              <a
                href={attachment.dataUrl}
                download={attachment.name || 'file'}
                className="inline-block text-[10px] text-indigo-300 underline"
              >
                Download
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

let notificationAudioContext = null;

const ensureNotificationAudioContext = () => {
  const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextCtor) return null;
  if (!notificationAudioContext) {
    notificationAudioContext = new AudioContextCtor();
  }
  return notificationAudioContext;
};

const playNotificationSound = () => {
  try {
    const ctx = ensureNotificationAudioContext();
    if (!ctx) return;
    const trigger = () => {
      const baseTime = ctx.currentTime + 0.01;
      const notes = [659, 880, 1175, 1568];
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = index === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, baseTime + index * 0.07);
        gain.gain.setValueAtTime(0.0001, baseTime + index * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.08, baseTime + index * 0.07 + 0.018);
        gain.gain.exponentialRampToValueAtTime(0.0001, baseTime + index * 0.07 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(baseTime + index * 0.07);
        osc.stop(baseTime + index * 0.07 + 0.17);
      });
    };

    if (ctx.state === 'suspended') {
      ctx.resume().then(trigger).catch(() => {});
    } else {
      trigger();
    }
  } catch {
    // Browser restrictions can block playback.
  }
};

function AIChatAssistant() {
  const [memberIdentity, setMemberIdentity] = useState(() => getOrCreateMemberIdentity());
  const memberSessionIdRef = useRef(getOrCreateMemberSessionId());
  const [memberName, setMemberName] = useState(memberIdentity.memberName || '');
  const [memberPresence, setMemberPresence] = useState(() => getMemberPresenceSnapshot());
  const [memberGeo, setMemberGeo] = useState(() =>
    safeReadJson(getMemberGeoCacheKey(memberIdentity.memberId), null)
  );
  const [userMode, setUserMode] = useState(() => {
    const savedMode = localStorage.getItem(USER_MODE_KEY);
    if (savedMode === 'admin') return 'admin';
    if (savedMode === 'member' && localStorage.getItem(MEMBER_NAME_KEY)) return 'member';
    return '';
  });
  const [identityInput, setIdentityInput] = useState('');
  const [identityError, setIdentityError] = useState('');
  const [isResolvingIdentity, setIsResolvingIdentity] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(isOpen);
  isOpenRef.current = isOpen;
  const [messages, setMessages] = useState(() => {
    const cached = safeReadJson(getMemberMessagesCacheKey(memberIdentity.memberId), []);
    const normalized = Array.isArray(cached) ? cached : [];
    if (normalized.length === 0) return [INITIAL_MEMBER_MESSAGE];
    return dedupeMessages([
      INITIAL_MEMBER_MESSAGE,
      ...normalized.map((message) => ({
        ...message,
        role: message.role || (message.from === 'member' ? 'user' : 'assistant'),
        source: message.source || (message.from === 'member' ? 'member' : 'admin'),
      })),
    ]);
  });
  const [inputValue, setInputValue] = useState('');
  const [memberAttachments, setMemberAttachments] = useState([]);
  const [showMemberEmojiPicker, setShowMemberEmojiPicker] = useState(false);
  const [showMemberStickerPicker, setShowMemberStickerPicker] = useState(false);
  const [memberStickerPrompt, setMemberStickerPrompt] = useState('');
  const [memberStickerSearch, setMemberStickerSearch] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isDeletingMemberAccount, setIsDeletingMemberAccount] = useState(false);
  const [isMemberMenuOpen, setIsMemberMenuOpen] = useState(false);
  const [systemNotice, setSystemNotice] = useState('');
  const [avatarMood, setAvatarMood] = useState('happy');
  const [avatarAction, setAvatarAction] = useState('idle');
  const [unreadCount, setUnreadCount] = useState(0);
  const [floatingNotice, setFloatingNotice] = useState('');
  const [recentEmojis, setRecentEmojis] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_EMOJI_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.slice(0, 24) : [];
    } catch {
      return [];
    }
  });
  const [recentStickers, setRecentStickers] = useState(() => {
    if (typeof window === 'undefined') return [];
    try {
      const parsed = JSON.parse(localStorage.getItem(RECENT_STICKER_KEY) || '[]');
      return Array.isArray(parsed) ? parsed.slice(0, 12) : [];
    } catch {
      return [];
    }
  });

  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [adminToken, setAdminToken] = useState(localStorage.getItem(ADMIN_TOKEN_KEY) || '');
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminProfile, setAdminProfile] = useState(null);
  const [adminError, setAdminError] = useState('');
  const [adminLoginForm, setAdminLoginForm] = useState({ username: '', password: '' });
  const [adminLoading, setAdminLoading] = useState(false);

  const [activeMembers, setActiveMembers] = useState(() => {
    const cached = safeReadJson(ADMIN_MEMBERS_CACHE_KEY, []);
    return Array.isArray(cached) ? cached : [];
  });
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedMemberMeta, setSelectedMemberMeta] = useState(null);
  const [adminConversationsByMember, setAdminConversationsByMember] = useState(() => {
    const cached = safeReadJson(ADMIN_CONVERSATIONS_CACHE_KEY, {});
    return cached && typeof cached === 'object' ? cached : {};
  });
  const [adminInput, setAdminInput] = useState('');
  const [adminAttachments, setAdminAttachments] = useState([]);
  const [showAdminEmojiPicker, setShowAdminEmojiPicker] = useState(false);
  const [showAdminStickerPicker, setShowAdminStickerPicker] = useState(false);
  const [adminStickerPrompt, setAdminStickerPrompt] = useState('');
  const [adminStickerSearch, setAdminStickerSearch] = useState('');
  const [showAdminAiAssist, setShowAdminAiAssist] = useState(false);
  const [adminAiPrompt, setAdminAiPrompt] = useState('short flirty and warm');
  const [adminAiProvider, setAdminAiProvider] = useState('groq');
  const [adminAiSuggestions, setAdminAiSuggestions] = useState([]);
  const [adminAiLoading, setAdminAiLoading] = useState(false);
  const [isAdminSending, setIsAdminSending] = useState(false);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  const [memberSearchQuery, setMemberSearchQuery] = useState('');
  const [adminSearchQuery, setAdminSearchQuery] = useState('');
  const [activeCall, setActiveCall] = useState(null);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callSeconds, setCallSeconds] = useState(0);
  const [isCallMuted, setIsCallMuted] = useState(false);
  const [isCallOnHold, setIsCallOnHold] = useState(false);
  const [isRemoteOnHold, setIsRemoteOnHold] = useState(false);
  const [isCallPanelMinimized, setIsCallPanelMinimized] = useState(false);
  const [callNotice, setCallNotice] = useState('');
  const [isMemberRecordingVoice, setIsMemberRecordingVoice] = useState(false);
  const [memberRecordingSeconds, setMemberRecordingSeconds] = useState(0);
  const [isMemberPushToTalkActive, setIsMemberPushToTalkActive] = useState(false);
  const [isAdminRecordingVoice, setIsAdminRecordingVoice] = useState(false);
  const [adminRecordingSeconds, setAdminRecordingSeconds] = useState(0);
  const [isAdminPushToTalkActive, setIsAdminPushToTalkActive] = useState(false);
  const socketRef = useRef(null);
  const messageCursorRef = useRef(0);
  const memberMessagesScrollRef = useRef(null);
  const adminMessagesScrollRef = useRef(null);
  const memberAutoScrollRef = useRef(true);
  const adminAutoScrollRef = useRef(true);
  const localCallStreamRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const callTimerRef = useRef(null);
  const activeCallRef = useRef(null);
  const incomingCallRef = useRef(null);
  const emitCallSignalRef = useRef(() => false);
  const endActiveCallRef = useRef(() => {});
  const processCallEventRef = useRef(async () => {});
  const callTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const noticeTimeoutRef = useRef(null);
  const moodTimeoutRef = useRef(null);
  const actionTimeoutRef = useRef(null);
  const adminMessageEndRef = useRef(null);
  const memberFileInputRef = useRef(null);
  const adminFileInputRef = useRef(null);
  const memberMenuRef = useRef(null);
  const memberEmojiRef = useRef(null);
  const memberStickerRef = useRef(null);
  const adminEmojiRef = useRef(null);
  const adminStickerRef = useRef(null);
  const adminAiRef = useRef(null);
  const typingStopTimerRef = useRef(null);
  const memberTypingStateRef = useRef({ isTyping: false, typingText: '' });
  const handleMemberAccessRevokedRef = useRef(() => {});
  const lastViewedAdminIdRef = useRef(readLastViewedAdminId(memberIdentity.memberId));
  const lastNotifiedAdminIdRef = useRef(lastViewedAdminIdRef.current);
  const memberCallCursorRef = useRef(0);
  const adminCallCursorRef = useRef(0);
  const memberPushToTalkActiveRef = useRef(false);
  const adminPushToTalkActiveRef = useRef(false);
  const feedBootstrappedRef = useRef(false);
  const geoRequestedRef = useRef(false);
  const memberRecorderRef = useRef(null);
  const memberRecorderStreamRef = useRef(null);

  // Auto-resize member input textarea up to ~4 lines (approx 96px)
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    try {
      el.style.height = 'auto';
      const max = 96; // px (~4 lines)
      const next = Math.min(el.scrollHeight, max);
      el.style.height = `${next}px`;
    } catch (e) {
      // ignore
    }
  }, [inputValue]);
  const memberRecorderChunksRef = useRef([]);
  const memberRecordingIntervalRef = useRef(null);
  const adminRecorderRef = useRef(null);
  const adminRecorderStreamRef = useRef(null);
  const adminRecorderChunksRef = useRef([]);
  const adminRecordingIntervalRef = useRef(null);
  const userModeRef = useRef(userMode);
  const selectedMemberIdRef = useRef(selectedMemberId);
  const identityReconcileRef = useRef('');

  useEffect(() => {
    userModeRef.current = userMode;
  }, [userMode]);

  useEffect(() => {
    selectedMemberIdRef.current = selectedMemberId;
  }, [selectedMemberId]);

  useEffect(() => {
    activeCallRef.current = activeCall;
  }, [activeCall]);

  useEffect(() => {
    incomingCallRef.current = incomingCall;
  }, [incomingCall]);

  useEffect(() => {
    memberPushToTalkActiveRef.current = isMemberPushToTalkActive;
  }, [isMemberPushToTalkActive]);

  useEffect(() => {
    adminPushToTalkActiveRef.current = isAdminPushToTalkActive;
  }, [isAdminPushToTalkActive]);

  const adoptResolvedMemberId = useCallback(
    (resolvedMemberId, options = {}) => {
      const nextMemberId = String(resolvedMemberId || '').trim();
      if (!nextMemberId) return false;
      if (nextMemberId === memberIdentity.memberId) return false;
      const shouldResetCursor = options.resetCursor !== false;
      const fallbackName = String(memberName || memberIdentity.memberName || localStorage.getItem(MEMBER_NAME_KEY) || '').trim();
      localStorage.setItem(MEMBER_ID_KEY, nextMemberId);
      if (fallbackName) {
        localStorage.setItem(MEMBER_NAME_KEY, fallbackName);
      }
      setMemberIdentity((prev) => ({
        ...prev,
        memberId: nextMemberId,
        memberName: fallbackName || prev.memberName || '',
      }));
      if (shouldResetCursor) {
        messageCursorRef.current = 0;
        memberCallCursorRef.current = 0;
        feedBootstrappedRef.current = false;
        lastViewedAdminIdRef.current = readLastViewedAdminId(nextMemberId);
        lastNotifiedAdminIdRef.current = Math.max(lastNotifiedAdminIdRef.current, lastViewedAdminIdRef.current);
      }
      return true;
    },
    [memberIdentity.memberId, memberIdentity.memberName, memberName]
  );

  useEffect(() => {
    if (userMode !== 'member' || !memberIdentity.memberId) return;
    const cached = safeReadJson(getMemberMessagesCacheKey(memberIdentity.memberId), []);
    if (!Array.isArray(cached) || cached.length === 0) return;
    const normalized = cached.map((message) => ({
      ...message,
      role: message.role || (message.from === 'member' ? 'user' : 'assistant'),
      source: message.source || (message.from === 'member' ? 'member' : 'admin'),
    }));
    setMessages((prev) => {
      const hasLoadedConversation = prev.some((message) => {
        const numericId = Number(message.id);
        return Number.isFinite(numericId) && numericId > 0;
      });
      if (hasLoadedConversation) return prev;
      return dedupeMessages([INITIAL_MEMBER_MESSAGE, ...normalized, ...prev]);
    });
    const maxCachedId = normalized.reduce((max, message) => {
      const numericId = Number(message.id);
      return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
    }, 0);
    messageCursorRef.current = Math.max(messageCursorRef.current, maxCachedId);
  }, [memberIdentity.memberId, userMode]);

  useEffect(() => {
    const cachedGeo = safeReadJson(getMemberGeoCacheKey(memberIdentity.memberId), null);
    setMemberGeo(cachedGeo && typeof cachedGeo === 'object' ? cachedGeo : null);
    geoRequestedRef.current = false;
  }, [memberIdentity.memberId]);

  useEffect(() => {
    if (!memberIdentity.memberId) return;
    if (!memberGeo || typeof memberGeo !== 'object') return;
    safeWriteJson(getMemberGeoCacheKey(memberIdentity.memberId), memberGeo);
  }, [memberGeo, memberIdentity.memberId]);

  useEffect(() => {
    if (userMode !== 'member' || !memberIdentity.memberId) return;
    safeWriteJson(
      getMemberMessagesCacheKey(memberIdentity.memberId),
      compactMessagesForCache(messages)
    );
  }, [memberIdentity.memberId, messages, userMode]);

  useEffect(() => {
    safeWriteJson(ADMIN_MEMBERS_CACHE_KEY, Array.isArray(activeMembers) ? activeMembers : []);
  }, [activeMembers]);

  useEffect(() => {
    const compactByMember = {};
    Object.entries(adminConversationsByMember || {}).forEach(([memberId, memberMessages]) => {
      compactByMember[memberId] = compactMessagesForCache(memberMessages);
    });
    safeWriteJson(ADMIN_CONVERSATIONS_CACHE_KEY, compactByMember);
  }, [adminConversationsByMember]);

  useEffect(() => {
    const syncRecent = () => {
      try {
        localStorage.setItem(RECENT_EMOJI_KEY, JSON.stringify(recentEmojis.slice(0, 24)));
        localStorage.setItem(RECENT_STICKER_KEY, JSON.stringify(recentStickers.slice(0, 12)));
      } catch {
        // Ignore storage issues.
      }
    };
    syncRecent();
  }, [recentEmojis, recentStickers]);

  useEffect(() => {
    if (!callNotice) return undefined;
    const timer = setTimeout(() => setCallNotice(''), 3000);
    return () => clearTimeout(timer);
  }, [callNotice]);

  useEffect(() => {
    const startedAt = activeCall?.startedAt;
    if (!startedAt) {
      setCallSeconds(0);
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      return undefined;
    }

    const startedMs = new Date(startedAt).getTime();
    const update = () => {
      if (!Number.isFinite(startedMs)) {
        setCallSeconds(0);
        return;
      }
      setCallSeconds(Math.max(0, Math.floor((Date.now() - startedMs) / 1000)));
    };
    update();
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    callTimerRef.current = setInterval(update, 1000);
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
    };
  }, [activeCall?.startedAt]);

  useEffect(() => {
    const unlockAudio = () => {
      try {
        const ctx = ensureNotificationAudioContext();
        if (ctx && ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      } catch {
        // Ignore.
      }
    };

    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio);
    return () => {
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, []);

  useEffect(() => {
    const syncPresence = () => {
      setMemberPresence(getMemberPresenceSnapshot());
    };

    syncPresence();
    window.addEventListener('focus', syncPresence);
    window.addEventListener('blur', syncPresence);
    window.addEventListener('online', syncPresence);
    window.addEventListener('offline', syncPresence);
    document.addEventListener('visibilitychange', syncPresence);

    return () => {
      window.removeEventListener('focus', syncPresence);
      window.removeEventListener('blur', syncPresence);
      window.removeEventListener('online', syncPresence);
      window.removeEventListener('offline', syncPresence);
      document.removeEventListener('visibilitychange', syncPresence);
    };
  }, []);

  useEffect(() => {
    const hasAnyPopupOpen =
      isMemberMenuOpen ||
      showMemberEmojiPicker ||
      showMemberStickerPicker ||
      showAdminEmojiPicker ||
      showAdminStickerPicker ||
      showAdminAiAssist;
    if (!hasAnyPopupOpen) return;

    const handleOutside = (event) => {
      const target = event.target;
      if (memberMenuRef.current?.contains(target)) return;
      if (memberEmojiRef.current?.contains(target)) return;
      if (memberStickerRef.current?.contains(target)) return;
      if (adminEmojiRef.current?.contains(target)) return;
      if (adminStickerRef.current?.contains(target)) return;
      if (adminAiRef.current?.contains(target)) return;
      setIsMemberMenuOpen(false);
      setShowMemberEmojiPicker(false);
      setShowMemberStickerPicker(false);
      setShowAdminEmojiPicker(false);
      setShowAdminStickerPicker(false);
      setShowAdminAiAssist(false);
    };

    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [
    isMemberMenuOpen,
    showAdminAiAssist,
    showAdminEmojiPicker,
    showAdminStickerPicker,
    showMemberEmojiPicker,
    showMemberStickerPicker,
  ]);

  useEffect(() => {
    if (userMode !== 'member' || !memberName) return;
    if (geoRequestedRef.current) return;
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;

    geoRequestedRef.current = true;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = Number(position.coords?.latitude);
        const lng = Number(position.coords?.longitude);
        const accuracy = Number(position.coords?.accuracy || 0);
        if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

        let geoLabel = '';
        try {
          const reverse = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${encodeURIComponent(lat)}&lon=${encodeURIComponent(lng)}`
          );
          if (reverse.ok) {
            const data = await reverse.json();
            const address = data?.address || {};
            geoLabel =
              [
                address.road || address.neighbourhood || address.suburb || '',
                address.city || address.town || address.village || address.county || '',
                address.state || '',
                address.country || '',
              ]
                .map((part) => String(part || '').trim())
                .filter(Boolean)
                .join(', ') || String(data?.display_name || '').trim();
          }
        } catch {
          // Ignore reverse-geocode failures.
        }

        setMemberGeo({
          lat,
          lng,
          accuracy: Number.isFinite(accuracy) ? accuracy : 0,
          label: geoLabel || '',
          updatedAt: new Date().toISOString(),
        });
      },
      () => {
        // User denied location or unavailable; keep IP fallback.
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 10 * 60 * 1000,
      }
    );
  }, [memberName, userMode]);

  const showFloatingNotice = useCallback((text) => {
    setFloatingNotice(text);
    playNotificationSound();
    if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
    noticeTimeoutRef.current = setTimeout(() => setFloatingNotice(''), 5000);
  }, []);

  const animateAvatarReaction = useCallback((mood = 'happy', action = 'bounce') => {
    setAvatarMood(mood);
    setAvatarAction(action);
    if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
    actionTimeoutRef.current = setTimeout(() => setAvatarAction('idle'), 600);
    if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
    moodTimeoutRef.current = setTimeout(() => setAvatarMood('happy'), 1500);
  }, []);

  const pushRecentEmoji = useCallback((emoji) => {
    if (!emoji) return;
    setRecentEmojis((prev) => [emoji, ...prev.filter((item) => item !== emoji)].slice(0, 24));
  }, []);

  const pushRecentSticker = useCallback((text) => {
    const clean = String(text || '').trim();
    if (!clean) return;
    setRecentStickers((prev) => [clean, ...prev.filter((item) => item !== clean)].slice(0, 12));
  }, []);

  const updateConversationForMember = useCallback((memberId, updater) => {
    if (!memberId) return;
    setAdminConversationsByMember((prev) => {
      const currentList = Array.isArray(prev[memberId]) ? prev[memberId] : [];
      const nextList = typeof updater === 'function' ? updater(currentList) : updater;
      const safeNext = Array.isArray(nextList) ? nextList : currentList;
      if (areMessageListsEqual(currentList, safeNext)) return prev;
      return { ...prev, [memberId]: safeNext };
    });
  }, []);

  const mergeConversationForMember = useCallback(
    (memberId, incomingMessages = [], options = {}) => {
      if (!memberId) return;
      const {
        tempIdToRemove = '',
        preservePendingMs = 12000,
        replaceWithServerSnapshot = false,
      } = options;
      setAdminConversationsByMember((prev) => {
        const previousList = Array.isArray(prev[memberId]) ? prev[memberId] : [];
        const now = Date.now();
        const pending = previousList.filter((message) => {
          if (!message.pending) return false;
          const createdAt = new Date(message.createdAt || '').getTime();
          return Number.isFinite(createdAt) ? now - createdAt <= preservePendingMs : true;
        });

        const normalizedIncoming = Array.isArray(incomingMessages) ? incomingMessages : [];
        let merged = dedupeMessages(
          replaceWithServerSnapshot && normalizedIncoming.length > 0
            ? [...normalizedIncoming, ...pending]
            : [...previousList, ...normalizedIncoming, ...pending]
        );

        if (tempIdToRemove) {
          merged = merged.filter((message) => String(message.id) !== String(tempIdToRemove));
        }
        if (areMessageListsEqual(previousList, merged)) return prev;
        return { ...prev, [memberId]: merged };
      });
    },
    []
  );

  const applyActiveMembersUpdate = useCallback((incomingMembers = []) => {
    const incoming = Array.isArray(incomingMembers) ? incomingMembers : [];
    setActiveMembers((prev) => {
      const now = Date.now();
      const prevMap = new Map(prev.map((member) => [String(member.memberId || ''), member]));
      const nextMap = new Map();
      if (incoming.length === 0) {
        if (!Array.isArray(prev) || prev.length === 0) return [];
        const forcedOffline = prev.map((member) => ({ ...member, isOnline: false, clientState: 'offline' }));
        return areMemberListsEqual(prev, forcedOffline) ? prev : forcedOffline;
      }

      incoming.forEach((member) => {
        const memberId = String(member?.memberId || '').trim();
        if (!memberId) return;
        const previous = prevMap.get(memberId) || null;
        const merged = { ...(previous || {}), ...member, _snapshotAt: now };
        if (!merged.isOnline) {
          merged.clientState = 'offline';
        }
        nextMap.set(memberId, merged);
      });

      // Keep recently known members during short backend snapshot jitter.
      prevMap.forEach((previous, memberId) => {
        if (nextMap.has(memberId)) return;
        const lastSnapshotAt = Number(previous?._snapshotAt || previous?.lastSeenAt || 0);
        if (!Number.isFinite(lastSnapshotAt) || now - lastSnapshotAt > ADMIN_MEMBER_MISSING_GRACE_MS) return;
        nextMap.set(memberId, {
          ...previous,
          isOnline: false,
          clientState: 'offline',
          _snapshotAt: lastSnapshotAt,
        });
      });

      const nextList = Array.from(nextMap.values());
      nextList.sort((a, b) => {
        if (Number(a.unreadCount || 0) !== Number(b.unreadCount || 0)) {
          return Number(b.unreadCount || 0) - Number(a.unreadCount || 0);
        }
        return Number(b.lastActivityAt || 0) - Number(a.lastActivityAt || 0);
      });
      return areMemberListsEqual(prev, nextList) ? prev : nextList;
    });
  }, []);

  const handleMemberEmojiPick = useCallback(
    (emoji) => {
      pushRecentEmoji(emoji);
      setInputValue((prev) => `${prev}${emoji}`);
      setShowMemberEmojiPicker(false);
      inputRef.current?.focus();
    },
    [pushRecentEmoji]
  );

  const handleAdminEmojiPick = useCallback(
    (emoji) => {
      pushRecentEmoji(emoji);
      setAdminInput((prev) => `${prev}${emoji}`);
      setShowAdminEmojiPicker(false);
    },
    [pushRecentEmoji]
  );

  const sendMemberStickerNow = useCallback(
    async (text, tone = 'violet') => {
      if (userMode !== 'member' || !memberName || isSending) return;
      const attachment = buildStickerAttachment(text, tone, generateId());
      if (!attachment) return;
      pushRecentSticker(attachment.stickerText || text);
      setShowMemberStickerPicker(false);
      setMemberStickerPrompt('');

      const tempId = `local_${generateId()}`;
      const pendingMessage = {
        id: tempId,
        role: 'user',
        source: 'member',
        content: '',
        createdAt: new Date().toISOString(),
        attachments: [attachment],
        status: 'sending',
      };

      setMessages((prev) => [...prev, pendingMessage]);
      animateAvatarReaction('thinking', 'bounce');
      setIsSending(true);

      const payload = {
        tempId,
        memberId: memberIdentity.memberId,
        memberName,
        sessionId: memberSessionIdRef.current,
        content: '',
        path: window.location.hash || window.location.pathname || '/',
        userAgent: navigator.userAgent || '',
        attachments: [attachment],
        pageVisibility: memberPresence.pageVisibility,
        windowFocused: memberPresence.windowFocused,
        browserOnline: memberPresence.browserOnline,
        clientState: memberPresence.clientState,
        geoLat: memberGeo?.lat,
        geoLng: memberGeo?.lng,
        geoAccuracy: memberGeo?.accuracy,
        geoLabel: memberGeo?.label,
        geoUpdatedAt: memberGeo?.updatedAt,
      };

      try {
        if (socketRef.current && isSocketConnected) {
          socketRef.current.emit('member:message', payload);
          return;
        }

        const result = await sendMemberMessage(payload);
        if (result?.success && result?.resolvedMemberId) {
          adoptResolvedMemberId(result.resolvedMemberId, { resetCursor: false });
        }
        if (result?.success && result.message) {
          setMessages((prev) =>
            prev.map((message) =>
              String(message.id) === String(tempId)
                ? { ...result.message, role: 'user', source: 'member' }
                : message
            )
          );
          return;
        }
        setMessages((prev) =>
          prev.map((message) => (String(message.id) === String(tempId) ? { ...message, status: 'failed' } : message))
        );
        setSystemNotice(result?.error || 'Message send failed. Please retry.');
      } catch (error) {
        setMessages((prev) =>
          prev.map((message) => (String(message.id) === String(tempId) ? { ...message, status: 'failed' } : message))
        );
        setSystemNotice(error?.message || 'Message send failed. Please retry.');
      } finally {
        setIsSending(false);
      }
    },
    [
      adoptResolvedMemberId,
      animateAvatarReaction,
      isSending,
      isSocketConnected,
      memberIdentity.memberId,
      memberName,
      memberPresence,
      memberGeo,
      pushRecentSticker,
      userMode,
    ]
  );

  const sendAdminStickerNow = useCallback(
    async (text, tone = 'rose') => {
      if (!selectedMemberId || !adminToken || isAdminSending) return;
      const attachment = buildStickerAttachment(text, tone, generateId());
      if (!attachment) return;
      pushRecentSticker(attachment.stickerText || text);
      setShowAdminStickerPicker(false);
      setAdminStickerPrompt('');
      setAdminError('');

      const tempId = `admin_local_${generateId()}`;
      const pendingMessage = {
        id: tempId,
        memberId: selectedMemberId,
        from: 'admin',
        role: 'assistant',
        source: 'admin',
        content: '',
        createdAt: new Date().toISOString(),
        attachments: [attachment],
        pending: true,
        readByMember: false,
        deliveredAt: null,
        seenAt: null,
      };

      mergeConversationForMember(selectedMemberId, [pendingMessage]);
      setIsAdminSending(true);

      try {
        if (socketRef.current && isSocketConnected) {
          socketRef.current.emit('admin:message', {
            tempId,
            token: adminToken,
            memberId: selectedMemberId,
            content: '',
            attachments: [attachment],
            broadcast: false,
          });
          return;
        }

        const result = await sendAdminMessage(adminToken, {
          memberId: selectedMemberId,
          content: '',
          attachments: [attachment],
          broadcast: false,
        });

        if (result?.success && Array.isArray(result.messages) && result.messages.length > 0) {
          const resolvedMemberId = String(result.messages[0]?.memberId || selectedMemberId).trim() || selectedMemberId;
          if (resolvedMemberId !== selectedMemberIdRef.current) {
            selectedMemberIdRef.current = resolvedMemberId;
            setSelectedMemberId(resolvedMemberId);
          }
          mergeConversationForMember(resolvedMemberId, result.messages, { tempIdToRemove: tempId });
          return;
        }
        updateConversationForMember(selectedMemberId, (prev) =>
          prev.filter((message) => String(message.id) !== String(tempId))
        );
        setAdminError(result?.error || 'Failed to send message.');
      } catch (error) {
        updateConversationForMember(selectedMemberId, (prev) =>
          prev.filter((message) => String(message.id) !== String(tempId))
        );
        setAdminError(error?.message || 'Failed to send message.');
      } finally {
        setIsAdminSending(false);
      }
    },
    [
      adminToken,
      isAdminSending,
      isSocketConnected,
      mergeConversationForMember,
      pushRecentSticker,
      selectedMemberId,
      updateConversationForMember,
    ]
  );

  const sendMemberStickerFromChat = useCallback(() => {
    const lastAdmin = [...messages].reverse().find((msg) => msg.from === 'admin' && msg.content);
    const base = String(lastAdmin?.content || 'Keep going').slice(0, 48);
    sendMemberStickerNow(base, 'violet');
  }, [messages, sendMemberStickerNow]);

  const sendAdminStickerFromChat = useCallback(() => {
    const currentConversation = selectedMemberId ? adminConversationsByMember[selectedMemberId] || [] : [];
    const lastMember = [...currentConversation].reverse().find((msg) => msg.from !== 'admin' && msg.content);
    const base = String(lastMember?.content || 'Nice effort').slice(0, 48);
    sendAdminStickerNow(base, 'rose');
  }, [adminConversationsByMember, selectedMemberId, sendAdminStickerNow]);

  const handleAdminAiGenerate = useCallback(async () => {
    if (!adminToken || !selectedMemberId) return;
    const currentConversation = (adminConversationsByMember[selectedMemberId] || []).slice(-20);
    const transcript = currentConversation
      .map((message) => `${message.from === 'admin' ? 'Admin' : 'Member'}: ${String(message.content || '').slice(0, 220)}`)
      .join('\n');

    const instruction = String(adminAiPrompt || '').trim() || 'short flirty and warm';
    const targetName =
      activeMembers.find((member) => member.memberId === selectedMemberId)?.memberName || 'the member';
    const prompt = [
      `You are helping an admin craft human chat replies.`,
      `Generate 5 concise message options to send next.`,
      `Tone request: ${instruction}.`,
      `Target person: ${targetName}.`,
      'Keep each suggestion <= 18 words and avoid repeating lines.',
      '',
      'Conversation context:',
      transcript || 'No prior messages.',
      '',
      'Return plain lines only, one suggestion per line.',
    ].join('\n');

    setAdminAiLoading(true);
    setAdminError('');
    try {
      const result = await requestAdminAiSuggestion({
        prompt,
        provider: adminAiProvider,
      });
      if (!result?.success || !result.message) {
        const fallback = buildLocalFlirtySuggestions({
          toneRequest: instruction,
          targetName,
          contextText: transcript,
        });
        setAdminAiSuggestions(fallback);
        setAdminError(result?.error || 'AI provider unavailable. Showing local suggestions.');
        return;
      }
      const parsed = String(result.message)
        .split(/\n+/)
        .map((line) => line.replace(/^\s*(\d+[\).\-\s]+|[-*•]\s*)/, '').trim())
        .filter(Boolean)
        .slice(0, 8);
      setAdminAiSuggestions(parsed);
    } catch (error) {
      const fallback = buildLocalFlirtySuggestions({
        toneRequest: instruction,
        targetName,
        contextText: transcript,
      });
      setAdminAiSuggestions(fallback);
      setAdminError(error?.message || 'Could not generate AI suggestions. Showing local suggestions.');
    } finally {
      setAdminAiLoading(false);
    }
  }, [
    adminAiPrompt,
    adminAiProvider,
    adminConversationsByMember,
    adminToken,
    activeMembers,
    selectedMemberId,
  ]);

  useEffect(() => {
    if (!SOCKET_ENABLED) {
      setIsSocketConnected(false);
      socketRef.current = null;
      return undefined;
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setIsSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setIsSocketConnected(false);
    });

    socket.on('admin:active-members', (members) => {
      applyActiveMembersUpdate(members);
    });

    socket.on('message:new', (message) => {
      if (userModeRef.current === 'admin') {
        if (message?.memberId) {
          mergeConversationForMember(String(message.memberId), [message]);
        }
      } else if (userModeRef.current === 'member') {
        if (!message?.memberId) return;
        adoptResolvedMemberId(message.memberId, { resetCursor: false });
        setMessages((prev) => dedupeMessages([...prev, message]));
        const messageId = Number(message.id);
        if (Number.isFinite(messageId)) {
          messageCursorRef.current = Math.max(messageCursorRef.current, messageId);
        }
        if (
          message.from === 'admin' &&
          Number.isFinite(messageId) &&
          messageId > lastNotifiedAdminIdRef.current
        ) {
          if (!isOpenRef.current) {
            setUnreadCount((prev) => prev + 1);
          }
          showFloatingNotice(toPreviewText(message));
          lastNotifiedAdminIdRef.current = messageId;
        }
      }
    });

    socket.on('message:sent', (data) => {
      const { tempId, message } = data || {};
      if (!tempId || !message) return;
      if (message?.memberId) {
        adoptResolvedMemberId(message.memberId, { resetCursor: false });
      }
      setMessages((prev) =>
        prev.map((item) =>
          String(item.id) === String(tempId) ? { ...message, role: 'user', source: 'member' } : item
        )
      );
      setIsSending(false);
    });

    socket.on('member:identity', (payload) => {
      const resolvedMemberId = String(payload?.memberId || '').trim();
      if (resolvedMemberId) {
        adoptResolvedMemberId(resolvedMemberId);
      }
    });

    socket.on('admin:message_sent', (data) => {
      const tempId = data?.tempId;
      const sentMessages = Array.isArray(data?.messages) ? data.messages : [];
      const byMember = sentMessages.reduce((acc, message) => {
        const memberId = String(message?.memberId || '');
        if (!memberId) return acc;
        if (!acc[memberId]) acc[memberId] = [];
        acc[memberId].push(message);
        return acc;
      }, {});
      const sentMemberIds = Object.keys(byMember);

      if (tempId && selectedMemberIdRef.current) {
        const currentSelectedMemberId = selectedMemberIdRef.current;
        setAdminConversationsByMember((prev) => {
          const existing = Array.isArray(prev[currentSelectedMemberId]) ? prev[currentSelectedMemberId] : [];
          if (existing.length === 0) return prev;
          const nextExisting = existing.filter((message) => String(message.id) !== String(tempId));
          if (nextExisting.length === existing.length) return prev;
          return { ...prev, [currentSelectedMemberId]: nextExisting };
        });
      }

      if (tempId && sentMemberIds.length === 1) {
        const resolvedMemberId = String(sentMemberIds[0] || '').trim();
        if (resolvedMemberId && resolvedMemberId !== selectedMemberIdRef.current) {
          selectedMemberIdRef.current = resolvedMemberId;
          setSelectedMemberId(resolvedMemberId);
          setSelectedMemberMeta((prev) =>
            prev
              ? { ...prev, memberId: resolvedMemberId }
              : { memberId: resolvedMemberId, memberName: 'Member' }
          );
        }
      }

      Object.entries(byMember).forEach(([memberId, list]) => {
        const shouldRemoveTemp = tempId && memberId === selectedMemberIdRef.current;
        setAdminConversationsByMember((prev) => {
          const previousList = Array.isArray(prev[memberId]) ? prev[memberId] : [];
          let merged = dedupeMessages([...previousList, ...list]);
          if (shouldRemoveTemp) {
            merged = merged.filter((message) => String(message.id) !== String(tempId));
          }
          return { ...prev, [memberId]: merged };
        });
      });
      setIsAdminSending(false);
    });

    socket.on('member:kicked', () => {
      setSystemNotice('Session reset by admin. Rejoining chat...');
    });

    socket.on('member:deleted', () => {
      handleMemberAccessRevokedRef.current?.('Your account was removed. Please enter your identity again.');
    });

    socket.on('admin:member_deleted', (payload) => {
      const targetId = String(payload?.memberId || '').trim();
      if (!targetId) return;
      purgeMemberCaches(targetId);
      setActiveMembers((prev) => prev.filter((member) => String(member?.memberId || '') !== targetId));
      setAdminConversationsByMember((prev) => {
        if (!prev || typeof prev !== 'object' || !Object.prototype.hasOwnProperty.call(prev, targetId)) {
          return prev;
        }
        const next = { ...prev };
        delete next[targetId];
        return next;
      });
      if (selectedMemberIdRef.current === targetId) {
        selectedMemberIdRef.current = '';
        setSelectedMemberId('');
        setSelectedMemberMeta(null);
      }
    });

    socket.on('admin:message_read', (data) => {
      const { memberId, messageId, readAt } = data || {};
      if (userModeRef.current === 'admin' && memberId) {
        setAdminConversationsByMember((prev) => {
          const current = Array.isArray(prev[memberId]) ? prev[memberId] : [];
          return {
            ...prev,
            [memberId]: current.map((msg) =>
              String(msg.id) === String(messageId)
                ? { ...msg, readByMember: true, seenAt: readAt || msg.seenAt || new Date().toISOString() }
                : msg
            ),
          };
        });
      }
    });

    socket.on('call:incoming', (payload) => {
      processCallEventRef.current({
        signalType: 'invite',
        callId: payload?.callId,
        memberId: payload?.memberId,
        fromRole: payload?.fromRole,
        fromName: payload?.fromName,
        payload: { offer: payload?.offer },
      });
    });

    socket.on('call:answer', (payload) => {
      processCallEventRef.current({
        signalType: 'answer',
        callId: payload?.callId,
        memberId: payload?.memberId,
        fromRole: payload?.fromRole,
        payload: {
          accepted: payload?.accepted,
          answer: payload?.answer,
          reason: payload?.reason,
        },
      });
    });

    socket.on('call:ice', (payload) => {
      processCallEventRef.current({
        signalType: 'ice',
        callId: payload?.callId,
        memberId: payload?.memberId,
        fromRole: payload?.fromRole,
        payload: { candidate: payload?.candidate },
      });
    });

    socket.on('call:hold', (payload) => {
      processCallEventRef.current({
        signalType: 'hold',
        callId: payload?.callId,
        memberId: payload?.memberId,
        fromRole: payload?.fromRole,
        payload: { onHold: payload?.onHold },
      });
    });

    socket.on('call:end', (payload) => {
      processCallEventRef.current({
        signalType: 'end',
        callId: payload?.callId,
        memberId: payload?.memberId,
        fromRole: payload?.fromRole,
        payload: { reason: payload?.reason },
      });
    });

    socket.on('call:unavailable', (payload) => {
      processCallEventRef.current({
        signalType: 'unavailable',
        callId: payload?.callId,
        memberId: payload?.memberId || activeCallRef.current?.memberId,
        fromRole: payload?.fromRole,
        payload: { reason: payload?.reason },
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [adoptResolvedMemberId, applyActiveMembersUpdate, memberIdentity.memberId, mergeConversationForMember, showFloatingNotice]);

  useEffect(() => {
    if (!socketRef.current || !isSocketConnected) return;
    if (userMode === 'member' && memberName) {
      socketRef.current.emit('member:online', {
        memberId: memberIdentity.memberId,
        memberName,
        sessionId: memberSessionIdRef.current,
        path: window.location.hash || window.location.pathname || '/',
        userAgent: navigator.userAgent || '',
        pageVisibility: memberPresence.pageVisibility,
        windowFocused: memberPresence.windowFocused,
        clientState: memberPresence.clientState,
        browserOnline: memberPresence.browserOnline,
        geoLat: memberGeo?.lat,
        geoLng: memberGeo?.lng,
        geoAccuracy: memberGeo?.accuracy,
        geoLabel: memberGeo?.label,
        geoUpdatedAt: memberGeo?.updatedAt,
      });
      return;
    }
    if (userMode === 'admin' && adminToken) {
      socketRef.current.emit('admin:online', { token: adminToken });
    }
  }, [adminToken, isSocketConnected, memberIdentity.memberId, memberName, memberPresence, memberGeo, userMode]);

  useEffect(() => {
    if (isSocketConnected) return;
    if (!activeCallRef.current) return;
    endActiveCallRef.current({ notifyPeer: false, reason: 'Call ended: connection lost' });
  }, [isSocketConnected]);

  const markAdminMessagesAsViewed = useCallback(
    (messageId) => {
      const numericId = Number(messageId);
      if (!Number.isFinite(numericId) || numericId <= 0) return;
      if (numericId <= lastViewedAdminIdRef.current) return;
      lastViewedAdminIdRef.current = numericId;
      lastNotifiedAdminIdRef.current = Math.max(lastNotifiedAdminIdRef.current, numericId);
      localStorage.setItem(getLastViewedKey(memberIdentity.memberId), String(numericId));
    },
    [memberIdentity.memberId]
  );

  const handleMemberAccessRevoked = useCallback(
    (noticeText = 'Your access was removed by admin. Please enter your identity again.') => {
      endActiveCallRef.current({ notifyPeer: true, reason: 'Call ended' });
      if (memberRecorderRef.current && memberRecorderRef.current.state !== 'inactive') {
        memberRecorderRef.current.stop();
      }
      memberRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
      memberRecorderStreamRef.current = null;
      memberRecorderRef.current = null;
      memberRecorderChunksRef.current = [];
      if (memberRecordingIntervalRef.current) {
        clearInterval(memberRecordingIntervalRef.current);
        memberRecordingIntervalRef.current = null;
      }

      purgeMemberCaches(memberIdentity.memberId);
      localStorage.removeItem(MEMBER_ID_KEY);
      localStorage.removeItem(MEMBER_NAME_KEY);
      localStorage.removeItem(USER_MODE_KEY);
      localStorage.removeItem(getLastViewedKey(memberIdentity.memberId));
      const nextMemberId = generateId();
      localStorage.setItem(MEMBER_ID_KEY, nextMemberId);
      setMemberIdentity({ memberId: nextMemberId, memberName: '' });
      setMemberName('');
      setUserMode('');
      setMessages([INITIAL_MEMBER_MESSAGE]);
      setInputValue('');
      setMemberAttachments([]);
      setIsMemberRecordingVoice(false);
      setMemberRecordingSeconds(0);
      setUnreadCount(0);
      setFloatingNotice('');
      setIsOpen(false);
      setIsMemberMenuOpen(false);
      setSystemNotice(noticeText);
      setIdentityError(noticeText);
      messageCursorRef.current = 0;
      memberCallCursorRef.current = 0;
      lastViewedAdminIdRef.current = 0;
      lastNotifiedAdminIdRef.current = 0;
      feedBootstrappedRef.current = false;
      identityReconcileRef.current = '';
    },
    [memberIdentity.memberId]
  );

  useEffect(() => {
    handleMemberAccessRevokedRef.current = handleMemberAccessRevoked;
  }, [handleMemberAccessRevoked]);

  const selectedMember = useMemo(
    () => activeMembers.find((member) => member.memberId === selectedMemberId) || null,
    [activeMembers, selectedMemberId]
  );
  const selectedMemberDisplay = selectedMember || selectedMemberMeta;
  const adminConversation = useMemo(
    () => (selectedMemberId ? adminConversationsByMember[selectedMemberId] || [] : []),
    [adminConversationsByMember, selectedMemberId]
  );
  const filteredAdminConversation = useMemo(
    () => filterMessagesByQuery(adminConversation, adminSearchQuery),
    [adminConversation, adminSearchQuery]
  );
  const filteredMemberMessages = useMemo(
    () => filterMessagesByQuery(messages, memberSearchQuery),
    [memberSearchQuery, messages]
  );
  const memberStickerOptions = useMemo(() => {
    const query = memberStickerSearch.trim().toLowerCase();
    const base = STICKER_LIBRARY.filter((item) =>
      !query ? true : `${item.emoji} ${item.text}`.toLowerCase().includes(query)
    );
    return base.map((item) => {
      const preview = buildStickerAttachment(`${item.emoji} ${item.text}`, item.tone, `preview-${item.text}-${item.tone}`);
      return {
        ...item,
        previewUrl: preview?.dataUrl || '',
      };
    });
  }, [memberStickerSearch]);
  const adminStickerOptions = useMemo(() => {
    const query = adminStickerSearch.trim().toLowerCase();
    const base = STICKER_LIBRARY.filter((item) =>
      !query ? true : `${item.emoji} ${item.text}`.toLowerCase().includes(query)
    );
    return base.map((item) => {
      const preview = buildStickerAttachment(`${item.emoji} ${item.text}`, item.tone, `preview-${item.text}-${item.tone}`);
      return {
        ...item,
        previewUrl: preview?.dataUrl || '',
      };
    });
  }, [adminStickerSearch]);
  const identityRequired = userMode !== 'admin' && (!userMode || !memberName);

  const purgeMemberEverywhere = useCallback((memberId) => {
    const targetId = String(memberId || '').trim();
    if (!targetId) return;

    purgeMemberCaches(targetId);
    setActiveMembers((prev) => prev.filter((member) => String(member?.memberId || '') !== targetId));
    setAdminConversationsByMember((prev) => {
      if (!prev || typeof prev !== 'object' || !Object.prototype.hasOwnProperty.call(prev, targetId)) {
        return prev;
      }
      const next = { ...prev };
      delete next[targetId];
      return next;
    });
    setSelectedMemberId((prev) => (String(prev || '') === targetId ? '' : prev));
    setSelectedMemberMeta((prev) => (String(prev?.memberId || '') === targetId ? null : prev));
    if (selectedMemberIdRef.current === targetId) {
      selectedMemberIdRef.current = '';
    }
  }, []);

  useEffect(() => {
    if (selectedMember) {
      setSelectedMemberMeta(selectedMember);
      return;
    }
    if (!selectedMemberId) {
      setSelectedMemberMeta(null);
    }
  }, [selectedMember, selectedMemberId]);

  useEffect(() => {
    if (!selectedMemberId) return;
    const listedMember = (Array.isArray(activeMembers) ? activeMembers : []).find(
      (member) => String(member?.memberId || '') === String(selectedMemberId)
    );
    if (listedMember) {
      setSelectedMemberMeta(listedMember);
    }
  }, [activeMembers, selectedMemberId]);

  const clearAdminSession = useCallback((errorText = '') => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    safeWriteJson(ADMIN_MEMBERS_CACHE_KEY, []);
    safeWriteJson(ADMIN_CONVERSATIONS_CACHE_KEY, {});
    setAdminToken('');
    setIsAdminAuthenticated(false);
    setAdminProfile(null);
    setAdminConversationsByMember({});
    setActiveMembers([]);
    adminCallCursorRef.current = 0;
    setSelectedMemberId('');
    setSelectedMemberMeta(null);
    selectedMemberIdRef.current = '';
    if (errorText) setAdminError(errorText);
  }, []);

  useEffect(() => {
    if (normalizeSearchQuery(memberSearchQuery)) return;
    const container = memberMessagesScrollRef.current;
    if (!container) return;
    if (!memberAutoScrollRef.current) return;
    container.scrollTop = container.scrollHeight;
  }, [memberSearchQuery, messages]);

  useEffect(() => {
    if (normalizeSearchQuery(adminSearchQuery)) return;
    const container = adminMessagesScrollRef.current;
    if (!container) return;
    if (!adminAutoScrollRef.current) return;
    container.scrollTop = container.scrollHeight;
  }, [adminConversation, adminSearchQuery]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setUnreadCount(0);
      const latestVisibleAdminId = messages.reduce((max, msg) => {
        if (msg.source !== 'admin') return max;
        const numericId = Number(msg.id);
        return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
      }, 0);
      if (latestVisibleAdminId > 0) markAdminMessagesAsViewed(latestVisibleAdminId);
    }
  }, [isOpen, markAdminMessagesAsViewed, messages]);

  useEffect(() => {
    if (!isOpen || userMode !== 'member') return;
    const unreadAdminIds = messages
      .filter((msg) => msg.from === 'admin' && !msg.readByMember)
      .map((msg) => Number(msg.id))
      .filter((id) => Number.isFinite(id) && id > 0);
    if (unreadAdminIds.length === 0) return;

    if (socketRef.current && isSocketConnected) {
      unreadAdminIds.forEach((messageId) => {
        socketRef.current.emit('message:read', {
          memberId: memberIdentity.memberId,
          messageId,
        });
      });
    } else {
      markMessagesAsSeen(memberIdentity.memberId, unreadAdminIds).catch(() => {});
    }

    setMessages((prev) =>
      prev.map((msg) =>
        msg.from === 'admin'
          ? { ...msg, readByMember: true, seenAt: msg.seenAt || new Date().toISOString() }
          : msg
      )
    );
  }, [isOpen, isSocketConnected, memberIdentity.memberId, messages, userMode]);

  useEffect(() => {
    if (userMode !== 'member') return;
    if (isOpen) {
      setUnreadCount((prev) => (prev === 0 ? prev : 0));
      return;
    }
    const computed = countUnreadAdminMessages(messages, lastViewedAdminIdRef.current);
    setUnreadCount((prev) => (prev === computed ? prev : computed));
  }, [isOpen, messages, userMode]);

  useEffect(() => {
    if (userMode === 'admin') {
      setIsAdminPanelOpen(true);
      setIsOpen(false);
    }
  }, [userMode]);

  useEffect(() => {
    const remoteAudioElement = remoteAudioRef.current;
    return () => {
      if (noticeTimeoutRef.current) clearTimeout(noticeTimeoutRef.current);
      if (moodTimeoutRef.current) clearTimeout(moodTimeoutRef.current);
      if (actionTimeoutRef.current) clearTimeout(actionTimeoutRef.current);
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      if (memberRecorderRef.current && memberRecorderRef.current.state !== 'inactive') {
        memberRecorderRef.current.stop();
      }
      if (adminRecorderRef.current && adminRecorderRef.current.state !== 'inactive') {
        adminRecorderRef.current.stop();
      }
      if (memberRecorderStreamRef.current) {
        memberRecorderStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (adminRecorderStreamRef.current) {
        adminRecorderStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (memberRecordingIntervalRef.current) {
        clearInterval(memberRecordingIntervalRef.current);
        memberRecordingIntervalRef.current = null;
      }
      if (adminRecordingIntervalRef.current) {
        clearInterval(adminRecordingIntervalRef.current);
        adminRecordingIntervalRef.current = null;
      }
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
        callTimerRef.current = null;
      }
      if (peerConnectionRef.current) {
        try {
          peerConnectionRef.current.onicecandidate = null;
          peerConnectionRef.current.ontrack = null;
          peerConnectionRef.current.onconnectionstatechange = null;
          peerConnectionRef.current.close();
        } catch {
          // Ignore.
        }
        peerConnectionRef.current = null;
      }
      if (localCallStreamRef.current) {
        localCallStreamRef.current.getTracks().forEach((track) => track.stop());
        localCallStreamRef.current = null;
      }
      if (remoteAudioElement?.srcObject) {
        const remoteStream = remoteAudioElement.srcObject;
        if (remoteStream && typeof remoteStream.getTracks === 'function') {
          remoteStream.getTracks().forEach((track) => track.stop());
        }
        remoteAudioElement.srcObject = null;
      }
    };
  }, []);

  const pushTypingStatus = useCallback(
    async (isTyping, typingText = '') => {
      const next = { isTyping: Boolean(isTyping), typingText: String(typingText || '').slice(0, 1000) };
      const current = memberTypingStateRef.current;
      if (current.isTyping === next.isTyping && current.typingText === next.typingText) return;
      memberTypingStateRef.current = next;
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit('member:typing', {
          memberId: memberIdentity.memberId,
          sessionId: memberSessionIdRef.current,
          isTyping: next.isTyping,
          typingText: next.typingText,
          pageVisibility: memberPresence.pageVisibility,
          windowFocused: memberPresence.windowFocused,
          browserOnline: memberPresence.browserOnline,
          clientState: memberPresence.clientState,
        });
      }
      try {
        const typingResult = await sendTypingStatus({
          memberId: memberIdentity.memberId,
          sessionId: memberSessionIdRef.current,
          isTyping: next.isTyping,
          typingText: next.typingText,
          pageVisibility: memberPresence.pageVisibility,
          windowFocused: memberPresence.windowFocused,
          browserOnline: memberPresence.browserOnline,
          clientState: memberPresence.clientState,
        });
        if (typingResult?.success && typingResult?.resolvedMemberId) {
          adoptResolvedMemberId(typingResult.resolvedMemberId, { resetCursor: false });
        }
      } catch (error) {
        console.warn('Typing status failed:', error.message);
      }
    },
    [adoptResolvedMemberId, isSocketConnected, memberIdentity.memberId, memberPresence]
  );





  useEffect(() => {
    if (userMode !== 'member' || !memberName) return;
    const hasText = inputValue.trim().length > 0;
    if (hasText) {
      pushTypingStatus(true, inputValue);
      if (typingStopTimerRef.current) clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = setTimeout(() => {
        pushTypingStatus(false, '');
      }, TYPING_IDLE_MS);
      return;
    }

    if (typingStopTimerRef.current) {
      clearTimeout(typingStopTimerRef.current);
      typingStopTimerRef.current = null;
    }
    pushTypingStatus(false, '');
  }, [inputValue, memberName, pushTypingStatus, userMode]);

  useEffect(() => () => {
    if (userMode === 'member') pushTypingStatus(false, '');
  }, [pushTypingStatus, userMode]);

  useEffect(() => {
    if (!isOpen || userMode !== 'member') return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const messageId = entry.target.dataset.messageId;
            const message = messages.find(msg => String(msg.id) === messageId);
            if (message && message.from === 'admin' && !message.readByMember) {
              if (socketRef.current && isSocketConnected) {
                socketRef.current.emit('message:read', { memberId: memberIdentity.memberId, messageId });
              } else {
                markMessagesAsSeen(memberIdentity.memberId, [Number(messageId)])
                  .catch(() => {});
              }
              markAdminMessagesAsViewed(messageId);
              setMessages((prev) =>
                prev.map((msg) =>
                  String(msg.id) === String(messageId)
                    ? { ...msg, readByMember: true, seenAt: msg.seenAt || new Date().toISOString() }
                    : msg
                )
              );
            }
          }
        });
      },
      { threshold: 0.8 }
    );

    const messageElements = document.querySelectorAll('.message-from-admin');
    messageElements.forEach((el) => observer.observe(el));

    return () => {
      messageElements.forEach((el) => observer.unobserve(el));
    };
  }, [messages, isOpen, userMode, memberIdentity.memberId, isSocketConnected, markAdminMessagesAsViewed]);

  const sendUserMessage = useCallback(async () => {
    if (userMode !== 'member' || !memberName) return;
    const text = inputValue.trim();
    const attachmentsToSend = memberAttachments;
    if ((!text && attachmentsToSend.length === 0) || isSending) return;

    const tempId = `local_${generateId()}`;
    const pendingMessage = {
      id: tempId,
      role: 'user',
      source: 'member',
      content: text,
      createdAt: new Date().toISOString(),
      attachments: attachmentsToSend,
      status: 'sending',
    };

    setMessages((prev) => [...prev, pendingMessage]);
    setInputValue('');
    setMemberAttachments([]);
    setShowMemberEmojiPicker(false);
    setShowMemberStickerPicker(false);
    setSystemNotice('');
    animateAvatarReaction('thinking', 'bounce');
    pushTypingStatus(false, '');
    setIsSending(true);

    const payload = {
      tempId,
      memberId: memberIdentity.memberId,
      memberName,
      sessionId: memberSessionIdRef.current,
      content: text,
      path: window.location.hash || window.location.pathname || '/',
      userAgent: navigator.userAgent || '',
      attachments: attachmentsToSend,
      pageVisibility: memberPresence.pageVisibility,
      windowFocused: memberPresence.windowFocused,
      browserOnline: memberPresence.browserOnline,
      clientState: memberPresence.clientState,
      geoLat: memberGeo?.lat,
      geoLng: memberGeo?.lng,
      geoAccuracy: memberGeo?.accuracy,
      geoLabel: memberGeo?.label,
      geoUpdatedAt: memberGeo?.updatedAt,
    };

    try {
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit('member:message', payload);
        return;
      }

      const result = await sendMemberMessage(payload);
      if (result?.success && result?.resolvedMemberId) {
        adoptResolvedMemberId(result.resolvedMemberId, { resetCursor: false });
      }
      if (result?.success && result.message) {
        setMessages((prev) =>
          prev.map((message) =>
            String(message.id) === String(tempId)
              ? { ...result.message, role: 'user', source: 'member' }
              : message
          )
        );
        return;
      }

      setMessages((prev) =>
        prev.map((message) =>
          String(message.id) === String(tempId)
            ? { ...message, status: 'failed' }
            : message
        )
      );
      setSystemNotice(result?.error || 'Message send failed. Please retry.');
    } catch (error) {
      setMessages((prev) =>
        prev.map((message) =>
          String(message.id) === String(tempId)
            ? { ...message, status: 'failed' }
            : message
        )
      );
      setSystemNotice(error?.message || 'Message send failed. Please retry.');
    } finally {
      setIsSending(false);
    }
  }, [
    adoptResolvedMemberId,
    animateAvatarReaction,
    inputValue,
    isSending,
    memberAttachments,
    memberIdentity.memberId,
    memberName,
    memberPresence,
    memberGeo,
    pushTypingStatus,
    userMode,
    isSocketConnected,
  ]);

  const verifyAdminSession = useCallback(
    async (token) => {
      if (!token) {
        setIsAdminAuthenticated(false);
        setAdminProfile(null);
        return false;
      }

      const profileResponse = await adminGetProfile(token);
      if (!profileResponse?.success) {
        clearAdminSession('Session expired. Please login again.');
        return false;
      }

      setIsAdminAuthenticated(true);
      setAdminProfile(profileResponse.admin || null);
      return true;
    },
    [clearAdminSession]
  );

  useEffect(() => {
    verifyAdminSession(adminToken);
  }, [adminToken, verifyAdminSession]);

  const handleAdminPasswordLogin = useCallback(
    async (event) => {
      event.preventDefault();
      
      if (adminLoading) return;
      setAdminLoading(true);
      setAdminError('');

      const result = await adminLoginWithPassword(adminLoginForm.username.trim(), adminLoginForm.password);
      if (result?.success && result.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
        setAdminToken(result.token);
        setAdminLoginForm((prev) => ({ ...prev, password: '' }));
      } else {
        setAdminError(result?.error || 'Invalid admin credentials.');
      }
      setAdminLoading(false);
    },
    [adminLoading, adminLoginForm.password, adminLoginForm.username]
  );

  const handleAdminLogout = useCallback(() => {
    endActiveCallRef.current({ notifyPeer: true, reason: 'Call ended' });
    clearAdminSession('');
    localStorage.removeItem(USER_MODE_KEY);
    setUserMode('');
    setIsAdminPanelOpen(false);
    setIdentityInput('');
    setIdentityError('');
  }, [clearAdminSession]);

  const resetMemberIdentity = useCallback((notice = '') => {
    endActiveCallRef.current({ notifyPeer: true, reason: 'Call ended' });
    if (memberRecorderRef.current && memberRecorderRef.current.state !== 'inactive') {
      memberRecorderRef.current.stop();
    }
    memberRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
    memberRecorderStreamRef.current = null;
    memberRecorderRef.current = null;
    memberRecorderChunksRef.current = [];
    if (memberRecordingIntervalRef.current) {
      clearInterval(memberRecordingIntervalRef.current);
      memberRecordingIntervalRef.current = null;
    }

    purgeMemberCaches(memberIdentity.memberId);
    localStorage.removeItem(MEMBER_ID_KEY);
    localStorage.removeItem(MEMBER_NAME_KEY);
    localStorage.removeItem(USER_MODE_KEY);
    localStorage.removeItem(getLastViewedKey(memberIdentity.memberId));
    const nextMemberId = generateId();
    localStorage.setItem(MEMBER_ID_KEY, nextMemberId);
    setMemberIdentity({ memberId: nextMemberId, memberName: '' });
    setUserMode('');
    setMemberName('');
    setMessages([INITIAL_MEMBER_MESSAGE]);
    setInputValue('');
    setMemberAttachments([]);
    setIsMemberRecordingVoice(false);
    setMemberRecordingSeconds(0);
    setUnreadCount(0);
    setFloatingNotice('');
    setIsOpen(false);
    setIsMemberMenuOpen(false);
    messageCursorRef.current = 0;
    memberCallCursorRef.current = 0;
    lastViewedAdminIdRef.current = 0;
    lastNotifiedAdminIdRef.current = 0;
    feedBootstrappedRef.current = false;
    identityReconcileRef.current = '';
    if (notice) setSystemNotice(notice);
  }, [memberIdentity.memberId]);

  const handleMemberLogout = useCallback(() => {
    resetMemberIdentity('Logged out successfully.');
  }, [resetMemberIdentity]);

  const handleMemberDeleteAccount = useCallback(async () => {
    if (isDeletingMemberAccount) return;
    const confirmed = window.confirm('Delete your account and chat history on this device?');
    if (!confirmed) return;
    setIsDeletingMemberAccount(true);
    try {
      await deleteMemberSelf({ memberId: memberIdentity.memberId });
      resetMemberIdentity('Account deleted successfully.');
    } catch {
      resetMemberIdentity('Account deleted locally.');
    } finally {
      setIsDeletingMemberAccount(false);
    }
  }, [isDeletingMemberAccount, memberIdentity.memberId, resetMemberIdentity]);

  const handleIdentitySubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (isResolvingIdentity) return;
      const name = identityInput.trim().replace(/\s+/g, ' ').slice(0, 40);
      if (!name) {
        setIdentityError('Please enter your first name.');
        return;
      }

      if (/^admin$/i.test(name)) {
        localStorage.setItem(USER_MODE_KEY, 'admin');
        setUserMode('admin');
        setIdentityError('');
        setIdentityInput('');
        return;
      }

      let preferredMemberId = localStorage.getItem(MEMBER_ID_KEY) || '';
      if (!preferredMemberId) {
        preferredMemberId = generateId();
      }

      setIsResolvingIdentity(true);
      try {
        const resolved = await resolveMemberIdentity({
          memberName: name,
          preferredMemberId,
          sessionId: memberSessionIdRef.current,
          path: window.location.hash || window.location.pathname || '/',
          userAgent: navigator.userAgent || '',
          pageVisibility: memberPresence.pageVisibility,
          windowFocused: memberPresence.windowFocused,
          browserOnline: memberPresence.browserOnline,
          clientState: memberPresence.clientState,
          geoLat: memberGeo?.lat,
          geoLng: memberGeo?.lng,
          geoAccuracy: memberGeo?.accuracy,
          geoLabel: memberGeo?.label,
          geoUpdatedAt: memberGeo?.updatedAt,
        });
        if (!resolved?.success) {
          throw new Error(resolved?.error || 'Unable to continue. Please retry.');
        }

        const resolvedMemberId = String(resolved?.memberId || '').trim() || preferredMemberId;
        localStorage.setItem(MEMBER_ID_KEY, resolvedMemberId);
        localStorage.setItem(MEMBER_NAME_KEY, name);
        localStorage.setItem(USER_MODE_KEY, 'member');
        setMemberIdentity({ memberId: resolvedMemberId, memberName: name });
        setMemberName(name);
        setUserMode('member');
        setIdentityError('');
        setIdentityInput('');
        setSystemNotice(`Welcome ${name}. You can message your study companion anytime.`);
        setMessages([INITIAL_MEMBER_MESSAGE]);
      } catch (error) {
        setIdentityError(error?.message || 'Unable to continue. Please retry.');
      } finally {
        setIsResolvingIdentity(false);
      }
    },
    [identityInput, isResolvingIdentity, memberPresence, memberGeo]
  );

  useEffect(() => {
    if (userMode !== 'member' || !memberName || !memberIdentity.memberId) return;
    const reconcileKey = `${memberIdentity.memberId}::${memberName.toLowerCase()}`;
    if (identityReconcileRef.current === reconcileKey) return;
    identityReconcileRef.current = reconcileKey;
    let cancelled = false;

    const reconcileIdentity = async () => {
      try {
        const resolved = await resolveMemberIdentity({
          memberName,
          preferredMemberId: memberIdentity.memberId,
          sessionId: memberSessionIdRef.current,
          path: window.location.hash || window.location.pathname || '/',
          userAgent: navigator.userAgent || '',
          pageVisibility: memberPresence.pageVisibility,
          windowFocused: memberPresence.windowFocused,
          browserOnline: memberPresence.browserOnline,
          clientState: memberPresence.clientState,
          geoLat: memberGeo?.lat,
          geoLng: memberGeo?.lng,
          geoAccuracy: memberGeo?.accuracy,
          geoLabel: memberGeo?.label,
          geoUpdatedAt: memberGeo?.updatedAt,
        });
        if (cancelled || !resolved?.success) return;
        adoptResolvedMemberId(resolved.memberId);
      } catch {
        // Silent retry on next boot sequence.
      }
    };

    reconcileIdentity();
    return () => {
      cancelled = true;
    };
  }, [adoptResolvedMemberId, memberGeo, memberIdentity.memberId, memberName, memberPresence, userMode]);

  useEffect(() => {
    if (userMode !== 'member' || !memberName) return;
    let cancelled = false;

    const pingPresence = async () => {
      const payload = {
        memberId: memberIdentity.memberId,
        memberName,
        sessionId: memberSessionIdRef.current,
        path: window.location.hash || window.location.pathname || '/',
        userAgent: navigator.userAgent || '',
        pageVisibility: memberPresence.pageVisibility,
        windowFocused: memberPresence.windowFocused,
        clientState: memberPresence.clientState,
        browserOnline: memberPresence.browserOnline,
        geoLat: memberGeo?.lat,
        geoLng: memberGeo?.lng,
        geoAccuracy: memberGeo?.accuracy,
        geoLabel: memberGeo?.label,
        geoUpdatedAt: memberGeo?.updatedAt,
      };
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit('member:heartbeat', payload);
      }
      try {
        const heartbeatResult = await sendHeartbeat(payload);
        if (heartbeatResult?.success && heartbeatResult?.resolvedMemberId) {
          adoptResolvedMemberId(heartbeatResult.resolvedMemberId, { resetCursor: false });
        }
      } catch {
        // Keep UI silent here; retry on next heartbeat.
      }
    };

    pingPresence();
    const timer = setInterval(() => {
      if (!cancelled) pingPresence();
    }, HEARTBEAT_MS);

    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [adoptResolvedMemberId, isSocketConnected, memberIdentity.memberId, memberName, memberPresence, memberGeo, userMode]);

  useEffect(() => {
    if (userMode !== 'member' || !memberName) return;
    let cancelled = false;

    const pollFeed = async () => {
      const previousCursor = messageCursorRef.current;
      let response = await fetchMemberFeed({
        memberId: memberIdentity.memberId,
        memberName,
        afterId: previousCursor > 0 ? previousCursor : 0,
        callAfterId: memberCallCursorRef.current,
      });
      if (cancelled) return;
      if (!response?.success) {
        if (isUnauthorizedError(response?.error)) {
          handleMemberAccessRevoked('Session reset. Please enter your identity again.');
        }
        return;
      }
      if (adoptResolvedMemberId(response?.resolvedMemberId)) {
        return;
      }
      if (response?.memberDeleted) {
        handleMemberAccessRevoked('Your account was removed. Please enter your identity again.');
        return;
      }

      if (previousCursor > 0) {
        const latestMessageId = Number(response.latestMessageId || 0);
        const unreadCount = Number(response.unreadCount || 0);
        const hasCursorDrift = Number.isFinite(latestMessageId) && latestMessageId > 0 && latestMessageId < previousCursor;
        const hasUnreadWithoutIncrementalPayload =
          Array.isArray(response.messages) && response.messages.length === 0 && Number.isFinite(unreadCount) && unreadCount > 0;
        if (hasCursorDrift || hasUnreadWithoutIncrementalPayload) {
          const fullSync = await fetchMemberFeed({
            memberId: memberIdentity.memberId,
            memberName,
            afterId: 0,
            callAfterId: memberCallCursorRef.current,
          });
          if (!cancelled && fullSync?.success) {
            if (adoptResolvedMemberId(fullSync?.resolvedMemberId)) {
              return;
            }
            response = fullSync;
          }
        }
      }

      const rawMessages = Array.isArray(response.messages) ? response.messages : [];
      const wasBootstrapped = feedBootstrappedRef.current;
      if (!feedBootstrappedRef.current) {
        feedBootstrappedRef.current = true;
      }

      const normalized = rawMessages.map((message) => ({
        ...message,
        role: message.from === 'member' ? 'user' : 'assistant',
        source: message.from === 'member' ? 'member' : 'admin',
      }));
      const maxIncomingId = normalized.reduce((max, msg) => {
        const numericId = Number(msg.id);
        return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
      }, 0);
      messageCursorRef.current = Math.max(messageCursorRef.current, maxIncomingId);

      setMessages((prev) => {
        const isIncremental = previousCursor > 0;
        if (isIncremental) {
          const next = dedupeMessages([INITIAL_MEMBER_MESSAGE, ...prev, ...normalized]);
          return areMessageListsEqual(prev, next) ? prev : next;
        }

        const transientLocal = prev.filter(
          (message) =>
            typeof message.id === 'string' &&
            (message.status === 'sending' || message.status === 'failed')
        );
        const next = dedupeMessages([INITIAL_MEMBER_MESSAGE, ...normalized, ...transientLocal]);
        return areMessageListsEqual(prev, next) ? prev : next;
      });

      const freshAdmin = normalized.filter((msg) => {
        if (msg.from !== 'admin') return false;
        const id = Number(msg.id);
        return Number.isFinite(id) && id > previousCursor;
      });
      if (freshAdmin.length > 0 && wasBootstrapped) {
        const unseen = freshAdmin.filter((msg) => {
          const numericId = Number(msg.id);
          return Number.isFinite(numericId) && numericId > lastNotifiedAdminIdRef.current;
        });
        if (unseen.length > 0) {
          if (!isOpenRef.current) {
            setUnreadCount((prev) => prev + unseen.length);
          }
          showFloatingNotice(toPreviewText(unseen[unseen.length - 1]));
          lastNotifiedAdminIdRef.current = unseen.reduce((max, msg) => {
            const numericId = Number(msg.id);
            return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
          }, lastNotifiedAdminIdRef.current);
        }
      } else if (freshAdmin.length > 0 && !wasBootstrapped) {
        lastNotifiedAdminIdRef.current = freshAdmin.reduce((max, msg) => {
          const numericId = Number(msg.id);
          return Number.isFinite(numericId) ? Math.max(max, numericId) : max;
        }, lastNotifiedAdminIdRef.current);
      }

      if (!isOpenRef.current) {
        const serverUnreadCount = Number(response.unreadCount || 0);
        if (Number.isFinite(serverUnreadCount) && serverUnreadCount >= 0) {
          setUnreadCount((prev) => (prev === serverUnreadCount ? prev : serverUnreadCount));
        }
      }

      const callEvents = Array.isArray(response.callEvents) ? response.callEvents : [];
      if (!isSocketConnected) {
        for (const event of callEvents) {
          // Polling fallback for environments without Socket.IO.
          await processCallEventRef.current(event);
        }
      }
      const latestCallId = Number(response.callLatestId || 0);
      if (Number.isFinite(latestCallId) && latestCallId > memberCallCursorRef.current) {
        memberCallCursorRef.current = latestCallId;
      } else if (callEvents.length > 0) {
        const maxEventId = callEvents.reduce((max, event) => {
          const id = Number(event?.id || 0);
          return Number.isFinite(id) ? Math.max(max, id) : max;
        }, memberCallCursorRef.current);
        memberCallCursorRef.current = maxEventId;
      }
    };

    pollFeed();
    const timer = setInterval(pollFeed, MEMBER_FEED_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [adoptResolvedMemberId, handleMemberAccessRevoked, isSocketConnected, memberIdentity.memberId, memberName, showFloatingNotice, userMode]);

  useEffect(() => {
    if (!isAdminAuthenticated || !adminToken) return;
    let cancelled = false;

    const pollMembers = async () => {
      const response = await fetchActiveMembers(adminToken, { callAfterId: adminCallCursorRef.current });
      if (cancelled) return;
      if (!response?.success) {
        if (isUnauthorizedError(response?.error)) clearAdminSession('Session expired. Please login again.');
        return;
      }
      applyActiveMembersUpdate(response.members);

      const callEvents = Array.isArray(response.callEvents) ? response.callEvents : [];
      if (!isSocketConnected) {
        for (const event of callEvents) {
          await processCallEventRef.current(event);
        }
      }
      const latestCallId = Number(response.callLatestId || 0);
      if (Number.isFinite(latestCallId) && latestCallId > adminCallCursorRef.current) {
        adminCallCursorRef.current = latestCallId;
      } else if (callEvents.length > 0) {
        const maxEventId = callEvents.reduce((max, event) => {
          const id = Number(event?.id || 0);
          return Number.isFinite(id) ? Math.max(max, id) : max;
        }, adminCallCursorRef.current);
        adminCallCursorRef.current = maxEventId;
      }
    };

    pollMembers();
    const timer = setInterval(pollMembers, ADMIN_MEMBER_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [adminToken, applyActiveMembersUpdate, clearAdminSession, isAdminAuthenticated, isSocketConnected]);

  useEffect(() => {
    if (!isAdminAuthenticated || !adminToken || !selectedMemberId) return;
    let cancelled = false;

    const pollConversation = async () => {
      const response = await fetchAdminConversation(adminToken, selectedMemberId, {
        callAfterId: adminCallCursorRef.current,
      });
      if (cancelled) return;
      if (!response?.success) {
        if (isUnauthorizedError(response?.error)) clearAdminSession('Session expired. Please login again.');
        return;
      }

      const resolvedMemberId = String(response.memberId || selectedMemberId).trim() || selectedMemberId;
      if (resolvedMemberId && resolvedMemberId !== selectedMemberIdRef.current) {
        selectedMemberIdRef.current = resolvedMemberId;
        setSelectedMemberId(resolvedMemberId);
        setSelectedMemberMeta((prev) => ({
          ...(prev || {}),
          memberId: resolvedMemberId,
          memberName: prev?.memberName || selectedMemberDisplay?.memberName || 'Member',
        }));
      }
      const fresh = Array.isArray(response.messages) ? response.messages : [];
      mergeConversationForMember(resolvedMemberId, fresh, { replaceWithServerSnapshot: true });

      const callEvents = Array.isArray(response.callEvents) ? response.callEvents : [];
      if (!isSocketConnected) {
        for (const event of callEvents) {
          await processCallEventRef.current(event);
        }
      }
      const latestCallId = Number(response.callLatestId || 0);
      if (Number.isFinite(latestCallId) && latestCallId > adminCallCursorRef.current) {
        adminCallCursorRef.current = latestCallId;
      } else if (callEvents.length > 0) {
        const maxEventId = callEvents.reduce((max, event) => {
          const id = Number(event?.id || 0);
          return Number.isFinite(id) ? Math.max(max, id) : max;
        }, adminCallCursorRef.current);
        adminCallCursorRef.current = maxEventId;
      }
    };

    pollConversation();
    const timer = setInterval(pollConversation, ADMIN_CONVERSATION_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(timer);
    };
  }, [adminToken, clearAdminSession, isAdminAuthenticated, isSocketConnected, mergeConversationForMember, selectedMemberDisplay?.memberName, selectedMemberId]);




  const handleAdminSend = useCallback(async () => {
    const text = adminInput.trim();
    const attachmentsToSend = adminAttachments;
    if ((!text && attachmentsToSend.length === 0) || !selectedMemberId || !adminToken || isAdminSending) return;

    setAdminError('');
    setAdminInput('');
    setAdminAttachments([]);
    setShowAdminEmojiPicker(false);
    setShowAdminStickerPicker(false);
    setShowAdminAiAssist(false);
    setIsAdminSending(true);

    const tempId = `admin_local_${generateId()}`;
    const pendingMessage = {
      id: tempId,
      memberId: selectedMemberId,
      from: 'admin',
      role: 'assistant',
      source: 'admin',
      content: text,
      createdAt: new Date().toISOString(),
      attachments: attachmentsToSend,
      pending: true,
      readByMember: false,
      deliveredAt: null,
      seenAt: null,
    };

    mergeConversationForMember(selectedMemberId, [pendingMessage]);

    try {
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit('admin:message', {
          tempId,
          token: adminToken,
          memberId: selectedMemberId,
          content: text,
          attachments: attachmentsToSend,
          broadcast: false,
        });
        return;
      }

      const result = await sendAdminMessage(adminToken, {
        memberId: selectedMemberId,
        content: text,
        attachments: attachmentsToSend,
        broadcast: false,
      });

      if (result?.success && Array.isArray(result.messages) && result.messages.length > 0) {
        const resolvedMemberId = String(result.messages[0]?.memberId || selectedMemberId).trim() || selectedMemberId;
        if (resolvedMemberId !== selectedMemberIdRef.current) {
          selectedMemberIdRef.current = resolvedMemberId;
          setSelectedMemberId(resolvedMemberId);
        }
        mergeConversationForMember(resolvedMemberId, result.messages, { tempIdToRemove: tempId });
        return;
      }

      updateConversationForMember(selectedMemberId, (prev) =>
        prev.filter((message) => String(message.id) !== String(tempId))
      );
      setAdminError(result?.error || 'Failed to send message.');
    } catch (error) {
      updateConversationForMember(selectedMemberId, (prev) =>
        prev.filter((message) => String(message.id) !== String(tempId))
      );
      setAdminError(error?.message || 'Failed to send message.');
    } finally {
      setIsAdminSending(false);
    }
  }, [
    adminAttachments,
    adminInput,
    adminToken,
    isAdminSending,
    isSocketConnected,
    mergeConversationForMember,
    selectedMemberId,
    updateConversationForMember,
  ]);

  const handleAdminInputKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleAdminSend();
    }
  };

  const handleMemberAttachmentPick = useCallback(async (event) => {
    const files = event.target?.files;
    if (!files || files.length === 0) return;
    try {
      const next = await readFilesAsAttachments(files);
      setMemberAttachments((prev) => [...prev, ...next].slice(0, 5));
    } catch (error) {
      setSystemNotice(error.message || 'Failed to read attachment');
    } finally {
      event.target.value = '';
    }
  }, []);

  const handleAdminAttachmentPick = useCallback(async (event) => {
    const files = event.target?.files;
    if (!files || files.length === 0) return;
    try {
      const next = await readFilesAsAttachments(files);
      setAdminAttachments((prev) => [...prev, ...next].slice(0, 5));
    } catch (error) {
      setAdminError(error.message || 'Failed to read attachment');
    } finally {
      event.target.value = '';
    }
  }, []);

  const handleRemoveMemberAttachment = useCallback((indexToRemove) => {
    setMemberAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const handleRemoveAdminAttachment = useCallback((indexToRemove) => {
    setAdminAttachments((prev) => prev.filter((_, index) => index !== indexToRemove));
  }, []);

  const startMemberRecordingTimer = useCallback(() => {
    if (memberRecordingIntervalRef.current) clearInterval(memberRecordingIntervalRef.current);
    setMemberRecordingSeconds(0);
    memberRecordingIntervalRef.current = setInterval(() => {
      setMemberRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopMemberRecordingTimer = useCallback(() => {
    if (memberRecordingIntervalRef.current) {
      clearInterval(memberRecordingIntervalRef.current);
      memberRecordingIntervalRef.current = null;
    }
  }, []);

  const startAdminRecordingTimer = useCallback(() => {
    if (adminRecordingIntervalRef.current) clearInterval(adminRecordingIntervalRef.current);
    setAdminRecordingSeconds(0);
    adminRecordingIntervalRef.current = setInterval(() => {
      setAdminRecordingSeconds((prev) => prev + 1);
    }, 1000);
  }, []);

  const stopAdminRecordingTimer = useCallback(() => {
    if (adminRecordingIntervalRef.current) {
      clearInterval(adminRecordingIntervalRef.current);
      adminRecordingIntervalRef.current = null;
    }
  }, []);

  const handleMemberStartVoice = useCallback(async () => {
    if (isMemberRecordingVoice) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      memberRecorderStreamRef.current = stream;
      const preferredTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported?.(type)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      memberRecorderRef.current = recorder;
      memberRecorderChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          memberRecorderChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          if (memberRecorderChunksRef.current.length === 0) return;
          const blob = new Blob(memberRecorderChunksRef.current, {
            type: mimeType || memberRecorderChunksRef.current[0]?.type || 'audio/webm',
          });
          const audioAttachment = await blobToAttachment(blob, 'voice-message');
          setMemberAttachments((prev) => [...prev, audioAttachment].slice(0, 5));
        } catch (error) {
          setSystemNotice(error?.message || 'Could not attach voice message.');
        } finally {
          setIsMemberRecordingVoice(false);
          setIsMemberPushToTalkActive(false);
          stopMemberRecordingTimer();
          memberRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
          memberRecorderStreamRef.current = null;
          memberRecorderRef.current = null;
          memberRecorderChunksRef.current = [];
        }
      };

      recorder.onerror = () => {
        setSystemNotice('Voice recording failed. Please retry.');
        stopMemberRecordingTimer();
        memberRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
        memberRecorderStreamRef.current = null;
        memberRecorderRef.current = null;
        memberRecorderChunksRef.current = [];
        setIsMemberRecordingVoice(false);
        setIsMemberPushToTalkActive(false);
      };

      recorder.start();
      setIsMemberRecordingVoice(true);
      startMemberRecordingTimer();
      setSystemNotice('Recording voice...');
    } catch (error) {
      console.error('Failed to start recording:', error);
      setSystemNotice('Could not start recording. Check microphone permissions.');
    }
  }, [isMemberRecordingVoice, startMemberRecordingTimer, stopMemberRecordingTimer]);

  const handleMemberStopVoice = useCallback(() => {
    if (!isMemberRecordingVoice || !memberRecorderRef.current) return;
    memberRecorderRef.current.stop();
    stopMemberRecordingTimer();
    setIsMemberRecordingVoice(false);
    setIsMemberPushToTalkActive(false);
    setSystemNotice('Recording stopped. Voice message attached.');
  }, [isMemberRecordingVoice, stopMemberRecordingTimer]);

  const handleAdminStartVoice = useCallback(async () => {
    if (isAdminRecordingVoice) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      adminRecorderStreamRef.current = stream;
      const preferredTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/ogg',
      ];
      const mimeType = preferredTypes.find((type) => MediaRecorder.isTypeSupported?.(type)) || '';
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream);
      adminRecorderRef.current = recorder;
      adminRecorderChunksRef.current = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          adminRecorderChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = async () => {
        try {
          if (adminRecorderChunksRef.current.length === 0) return;
          const blob = new Blob(adminRecorderChunksRef.current, {
            type: mimeType || adminRecorderChunksRef.current[0]?.type || 'audio/webm',
          });
          const audioAttachment = await blobToAttachment(blob, 'voice-message-admin');
          setAdminAttachments((prev) => [...prev, audioAttachment].slice(0, 5));
        } catch (error) {
          setAdminError(error?.message || 'Could not attach voice message.');
        } finally {
          setIsAdminRecordingVoice(false);
          setIsAdminPushToTalkActive(false);
          stopAdminRecordingTimer();
          adminRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
          adminRecorderStreamRef.current = null;
          adminRecorderRef.current = null;
          adminRecorderChunksRef.current = [];
        }
      };

      recorder.onerror = () => {
        setAdminError('Voice recording failed. Please retry.');
        stopAdminRecordingTimer();
        adminRecorderStreamRef.current?.getTracks().forEach((track) => track.stop());
        adminRecorderStreamRef.current = null;
        adminRecorderRef.current = null;
        adminRecorderChunksRef.current = [];
        setIsAdminRecordingVoice(false);
        setIsAdminPushToTalkActive(false);
      };

      recorder.start();
      setIsAdminRecordingVoice(true);
      startAdminRecordingTimer();
      setAdminError('');
    } catch (error) {
      console.error('Failed to start admin recording:', error);
      setAdminError('Could not start recording. Check microphone permissions.');
    }
  }, [isAdminRecordingVoice, startAdminRecordingTimer, stopAdminRecordingTimer]);

  const handleAdminStopVoice = useCallback(() => {
    if (!isAdminRecordingVoice || !adminRecorderRef.current) return;
    adminRecorderRef.current.stop();
    stopAdminRecordingTimer();
    setIsAdminRecordingVoice(false);
    setIsAdminPushToTalkActive(false);
  }, [isAdminRecordingVoice, stopAdminRecordingTimer]);

  const emitCallSignal = useCallback(
    async (eventName, payload) => {
      const signalTypeMap = {
        'call:invite': 'invite',
        'call:answer': 'answer',
        'call:ice': 'ice',
        'call:hold': 'hold',
        'call:end': 'end',
        'call:unavailable': 'unavailable',
      };
      const signalType = signalTypeMap[eventName];
      if (!signalType) return false;
      const fromRole = userMode === 'admin' ? 'admin' : 'member';
      const packet = { ...payload, fromRole };
      if (fromRole === 'admin') {
        packet.token = adminToken;
      } else {
        packet.memberName = memberName || memberIdentity.memberName || '';
      }
      if (socketRef.current && isSocketConnected) {
        socketRef.current.emit(eventName, packet);
        return true;
      }
      try {
        const result = await sendCallSignal({
          fromRole,
          token: fromRole === 'admin' ? adminToken : '',
          memberId: packet.memberId,
          memberName: packet.memberName,
          sessionId: memberSessionIdRef.current,
          signalType,
          callId: packet.callId,
          payload: {
            answer: packet.answer || null,
            offer: packet.offer || null,
            candidate: packet.candidate || null,
            onHold: packet.onHold ?? null,
            accepted: packet.accepted ?? null,
            reason: packet.reason || '',
          },
          path: window.location.hash || window.location.pathname || '/',
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent || '' : '',
          pageVisibility: memberPresence.pageVisibility,
          windowFocused: memberPresence.windowFocused,
          browserOnline: memberPresence.browserOnline,
          clientState: memberPresence.clientState,
        });
        if (result?.success && result?.resolvedMemberId) {
          adoptResolvedMemberId(result.resolvedMemberId, { resetCursor: false });
        }
        return Boolean(result?.success);
      } catch {
        return false;
      }
    },
    [adminToken, adoptResolvedMemberId, isSocketConnected, memberIdentity.memberName, memberName, memberPresence, userMode]
  );

  const applyLocalCallAudioState = useCallback((muted, held) => {
    const stream = localCallStreamRef.current;
    if (!stream) return;
    stream.getAudioTracks().forEach((track) => {
      // When muted or on hold, stop sending audio frames.
      track.enabled = !(muted || held);
    });
  }, []);

  const cleanupCallResources = useCallback(() => {
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    if (callTimeoutRef.current) {
      clearTimeout(callTimeoutRef.current);
      callTimeoutRef.current = null;
    }

    if (peerConnectionRef.current) {
      try {
        peerConnectionRef.current.onicecandidate = null;
        peerConnectionRef.current.ontrack = null;
        peerConnectionRef.current.onconnectionstatechange = null;
        peerConnectionRef.current.close();
      } catch {
        // Ignore.
      }
      peerConnectionRef.current = null;
    }

    if (localCallStreamRef.current) {
      localCallStreamRef.current.getTracks().forEach((track) => track.stop());
      localCallStreamRef.current = null;
    }

    const remoteAudio = remoteAudioRef.current;
    if (remoteAudio?.srcObject) {
      const remoteStream = remoteAudio.srcObject;
      if (remoteStream && typeof remoteStream.getTracks === 'function') {
        remoteStream.getTracks().forEach((track) => track.stop());
      }
      remoteAudio.srcObject = null;
    }

    setCallSeconds(0);
    setIsCallMuted(false);
    setIsCallOnHold(false);
    setIsRemoteOnHold(false);
    setIsMemberPushToTalkActive(false);
    setIsAdminPushToTalkActive(false);
  }, []);

  const endActiveCall = useCallback(
    ({ notifyPeer = true, reason = 'Call ended' } = {}) => {
      const call = activeCallRef.current;
      if (notifyPeer && call) {
        void emitCallSignal('call:end', {
          callId: call.callId,
          memberId: call.memberId,
          reason,
        });
      }
      cleanupCallResources();
      setIncomingCall(null);
      setActiveCall(null);
      setIsCallPanelMinimized(false);
      if (reason) setCallNotice(reason);
    },
    [cleanupCallResources, emitCallSignal]
  );

  const createPeerConnection = useCallback(
    ({ callId, memberId }) => {
      const pc = new RTCPeerConnection({ iceServers: CALL_STUN_SERVERS });

      pc.onicecandidate = (event) => {
        if (!event.candidate) return;
        void emitCallSignal('call:ice', {
          callId,
          memberId,
          candidate: event.candidate,
        });
      };

      pc.ontrack = (event) => {
        const [stream] = event.streams || [];
        if (remoteAudioRef.current && stream) {
          remoteAudioRef.current.srcObject = stream;
          remoteAudioRef.current.play().catch(() => {});
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        if (state === 'connected') {
          setActiveCall((prev) =>
            prev && prev.callId === callId
              ? {
                  ...prev,
                  status: 'active',
                  startedAt: prev.startedAt || new Date().toISOString(),
                }
              : prev
          );
        } else if (state === 'failed' || state === 'disconnected') {
          endActiveCall({ notifyPeer: true, reason: 'Call disconnected' });
        } else if (state === 'closed') {
          endActiveCall({ notifyPeer: false, reason: '' });
        }
      };

      peerConnectionRef.current = pc;
      return pc;
    },
    [emitCallSignal, endActiveCall]
  );

  const startCallWithTarget = useCallback(
    async ({ memberId, peerName = 'Member', startMuted = false }) => {
      const targetMemberId = String(memberId || '').trim();
      if (!targetMemberId) {
        setCallNotice('Select a member to call.');
        return;
      }
      if (activeCallRef.current || incomingCall) {
        setCallNotice('Another call is already in progress.');
        return;
      }

      const callId = `call_${generateId()}`;
      try {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        localCallStreamRef.current = localStream;
        applyLocalCallAudioState(Boolean(startMuted), false);
        setIsCallMuted(Boolean(startMuted));
        const pc = createPeerConnection({ callId, memberId: targetMemberId });
        localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        setIncomingCall(null);
        setIsCallPanelMinimized(false);
        setActiveCall({
          callId,
          memberId: targetMemberId,
          peerName: String(peerName || 'Member'),
          direction: 'outgoing',
          status: 'ringing',
          startedAt: null,
        });

        const sent = await emitCallSignal('call:invite', {
          callId,
          memberId: targetMemberId,
          offer,
        });
        if (!sent) {
          endActiveCall({ notifyPeer: false, reason: 'Call service unavailable.' });
          return;
        }
        setCallNotice('Calling...');
        // If no answer/connection within 12s, abort the call to avoid hanging on "Connecting..."
        if (callTimeoutRef.current) {
          clearTimeout(callTimeoutRef.current);
        }
        callTimeoutRef.current = setTimeout(() => {
          const call = activeCallRef.current;
          if (call && (call.status === 'ringing' || call.status === 'connecting')) {
            endActiveCall({ notifyPeer: true, reason: 'No answer — call timed out' });
          }
        }, 12000);
      } catch (error) {
        cleanupCallResources();
        setActiveCall(null);
        setIncomingCall(null);
        setCallNotice(error?.message || 'Unable to start call.');
      }
    },
    [applyLocalCallAudioState, cleanupCallResources, createPeerConnection, emitCallSignal, endActiveCall, incomingCall]
  );

  const acceptIncomingCall = useCallback(async () => {
    const pending = incomingCall;
    if (!pending) return;
    if (!pending.offer) {
      void emitCallSignal('call:answer', {
        callId: pending.callId,
        memberId: pending.memberId,
        accepted: false,
        reason: 'Invalid call offer',
      });
      setIncomingCall(null);
      setCallNotice('Invalid call offer');
      return;
    }
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      localCallStreamRef.current = localStream;
      applyLocalCallAudioState(false, false);
      const pc = createPeerConnection({ callId: pending.callId, memberId: pending.memberId });
      localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

      await pc.setRemoteDescription(new RTCSessionDescription(pending.offer));
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);

      setActiveCall({
        callId: pending.callId,
        memberId: pending.memberId,
        peerName: pending.fromName || (pending.fromRole === 'admin' ? 'Admin' : 'Member'),
        direction: 'incoming',
        status: 'connecting',
        startedAt: null,
      });
      setIncomingCall(null);
      setIsCallPanelMinimized(false);

      await emitCallSignal('call:answer', {
        callId: pending.callId,
        memberId: pending.memberId,
        accepted: true,
        answer,
      });
      setCallNotice('Connecting call...');
      // Abort if still not connected after 12s
      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
      }
      callTimeoutRef.current = setTimeout(() => {
        const call = activeCallRef.current;
        if (call && call.status !== 'active') {
          endActiveCall({ notifyPeer: true, reason: 'Connection timed out' });
        }
      }, 12000);
    } catch (error) {
      setIncomingCall(null);
      cleanupCallResources();
      setCallNotice(error?.message || 'Could not answer call.');
      await emitCallSignal('call:answer', {
        callId: pending.callId,
        memberId: pending.memberId,
        accepted: false,
        reason: 'Unable to connect',
      });
    }
  }, [applyLocalCallAudioState, cleanupCallResources, createPeerConnection, emitCallSignal, incomingCall]);

  const rejectIncomingCall = useCallback(
    (reason = 'Call declined') => {
      if (!incomingCall) return;
      void emitCallSignal('call:answer', {
        callId: incomingCall.callId,
        memberId: incomingCall.memberId,
        accepted: false,
        reason,
      });
      setIncomingCall(null);
      setCallNotice(reason);
    },
    [emitCallSignal, incomingCall]
  );

  const toggleCallMute = useCallback(() => {
    setIsCallMuted((prev) => {
      const next = !prev;
      applyLocalCallAudioState(next, isCallOnHold);
      return next;
    });
  }, [applyLocalCallAudioState, isCallOnHold]);

  const toggleCallHold = useCallback(() => {
    const call = activeCallRef.current;
    if (!call) return;
    setIsCallOnHold((prev) => {
      const next = !prev;
      applyLocalCallAudioState(isCallMuted, next);
      void emitCallSignal('call:hold', {
        callId: call.callId,
        memberId: call.memberId,
        onHold: next,
      });
      setCallNotice(next ? 'Call on hold' : 'Call resumed');
      return next;
    });
  }, [applyLocalCallAudioState, emitCallSignal, isCallMuted]);

  const processCallEvent = useCallback(async (event) => {
    const signalType = String(event?.signalType || '').trim().toLowerCase();
    const callId = String(event?.callId || '').trim();
    const memberId = String(event?.memberId || '').trim();
    const fromRole = event?.fromRole === 'admin' ? 'admin' : 'member';
    const payload = event?.payload && typeof event.payload === 'object' ? event.payload : {};
    if (!signalType || !callId || !memberId) return;

    const currentRole = userModeRef.current === 'admin' ? 'admin' : 'member';

    if (signalType === 'invite') {
      if (fromRole === currentRole) return;
      if (activeCallRef.current || incomingCallRef.current) {
        void emitCallSignalRef.current('call:answer', {
          callId,
          memberId,
          accepted: false,
          reason: 'User is busy',
        });
        return;
      }
      if (currentRole === 'admin') {
        selectedMemberIdRef.current = memberId;
        setSelectedMemberId(memberId);
        setSelectedMemberMeta((prev) => ({
          ...(prev || {}),
          memberId,
          memberName: event?.fromName || prev?.memberName || 'Member',
        }));
      }
      setIncomingCall({
        callId,
        memberId,
        fromRole,
        fromName: event?.fromName || (fromRole === 'admin' ? 'Admin' : 'Member'),
        offer: payload.offer || null,
      });
      setIsCallPanelMinimized(false);
      setCallNotice('Incoming call');
      playNotificationSound();
      return;
    }

    const call = activeCallRef.current;
    if (!call || call.callId !== callId || call.memberId !== memberId) return;

    if (signalType === 'answer') {
      if (payload.accepted === false) {
        endActiveCallRef.current({
          notifyPeer: false,
          reason: String(payload.reason || 'Call declined'),
        });
        return;
      }
      if (!payload.answer || !peerConnectionRef.current) return;
      try {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(payload.answer));
        setActiveCall((prev) =>
          prev && prev.callId === callId ? { ...prev, status: 'connecting' } : prev
        );
      } catch {
        endActiveCallRef.current({ notifyPeer: true, reason: 'Call setup failed' });
      }
      return;
    }

    if (signalType === 'ice') {
      if (!peerConnectionRef.current || !payload.candidate) return;
      try {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(payload.candidate));
      } catch {
        // Ignore candidate race issues.
      }
      return;
    }

    if (signalType === 'hold') {
      const nextRemoteHold = Boolean(payload.onHold);
      setIsRemoteOnHold(nextRemoteHold);
      setCallNotice(nextRemoteHold ? 'Peer put call on hold' : 'Peer resumed call');
      return;
    }

    if (signalType === 'end' || signalType === 'unavailable') {
      endActiveCallRef.current({
        notifyPeer: false,
        reason: String(payload.reason || (signalType === 'unavailable' ? 'Peer unavailable' : 'Call ended')),
      });
    }
  }, []);

  useEffect(() => {
    emitCallSignalRef.current = emitCallSignal;
  }, [emitCallSignal]);

  useEffect(() => {
    endActiveCallRef.current = endActiveCall;
  }, [endActiveCall]);

  useEffect(() => {
    processCallEventRef.current = processCallEvent;
  }, [processCallEvent]);

  const handleMemberPushToTalkDown = useCallback(
    async (event) => {
      event.preventDefault();
      if (memberPushToTalkActiveRef.current) return;
      memberPushToTalkActiveRef.current = true;
      setIsMemberPushToTalkActive(true);
      const targetMemberId = String(memberIdentity.memberId || '').trim();
      if (!targetMemberId) {
        memberPushToTalkActiveRef.current = false;
        setIsMemberPushToTalkActive(false);
        setCallNotice('Sign in to use push-to-talk.');
        return;
      }

      const existingCall = activeCallRef.current;
      if (existingCall && existingCall.memberId !== targetMemberId) {
        memberPushToTalkActiveRef.current = false;
        setIsMemberPushToTalkActive(false);
        setCallNotice('Another call is already active.');
        return;
      }

      if (!existingCall) {
        await startCallWithTarget({
          memberId: targetMemberId,
          peerName: 'Admin',
          startMuted: true,
        });
      }

      if (!memberPushToTalkActiveRef.current) return;
      const call = activeCallRef.current;
      if (!call || call.memberId !== targetMemberId) {
        memberPushToTalkActiveRef.current = false;
        setIsMemberPushToTalkActive(false);
        return;
      }

      if (isCallOnHold) {
        setIsCallOnHold(false);
        void emitCallSignal('call:hold', {
          callId: call.callId,
          memberId: call.memberId,
          onHold: false,
        });
      }

      setIsCallMuted(false);
      applyLocalCallAudioState(false, false);
    },
    [applyLocalCallAudioState, emitCallSignal, isCallOnHold, memberIdentity.memberId, startCallWithTarget]
  );

  const handleMemberPushToTalkUp = useCallback(
    (event) => {
      event.preventDefault();
      memberPushToTalkActiveRef.current = false;
      if (!isMemberPushToTalkActive) return;
      setIsMemberPushToTalkActive(false);
      if (!activeCallRef.current) return;
      setIsCallMuted(true);
      applyLocalCallAudioState(true, isCallOnHold);
    },
    [applyLocalCallAudioState, isCallOnHold, isMemberPushToTalkActive]
  );

  const handleAdminPushToTalkDown = useCallback(
    async (event) => {
      event.preventDefault();
      if (adminPushToTalkActiveRef.current) return;
      adminPushToTalkActiveRef.current = true;
      setIsAdminPushToTalkActive(true);
      const existingCall = activeCallRef.current;
      const targetMemberId = String(existingCall?.memberId || selectedMemberId || '').trim();

      if (!targetMemberId) {
        adminPushToTalkActiveRef.current = false;
        setIsAdminPushToTalkActive(false);
        setCallNotice('Select a member to use push-to-talk.');
        return;
      }

      if (existingCall && existingCall.memberId !== targetMemberId) {
        adminPushToTalkActiveRef.current = false;
        setIsAdminPushToTalkActive(false);
        setCallNotice('End the current call before switching member.');
        return;
      }

      if (!existingCall) {
        await startCallWithTarget({
          memberId: targetMemberId,
          peerName: selectedMemberDisplay?.memberName || selectedMemberMeta?.memberName || 'Member',
          startMuted: true,
        });
      }

      if (!adminPushToTalkActiveRef.current) return;
      const call = activeCallRef.current;
      if (!call || call.memberId !== targetMemberId) {
        adminPushToTalkActiveRef.current = false;
        setIsAdminPushToTalkActive(false);
        return;
      }

      if (isCallOnHold) {
        setIsCallOnHold(false);
        void emitCallSignal('call:hold', {
          callId: call.callId,
          memberId: call.memberId,
          onHold: false,
        });
      }

      setIsCallMuted(false);
      applyLocalCallAudioState(false, false);
    },
    [
      applyLocalCallAudioState,
      emitCallSignal,
      isCallOnHold,
      selectedMemberDisplay?.memberName,
      selectedMemberId,
      selectedMemberMeta?.memberName,
      startCallWithTarget,
    ]
  );

  const handleAdminPushToTalkUp = useCallback(
    (event) => {
      event.preventDefault();
      adminPushToTalkActiveRef.current = false;
      if (!isAdminPushToTalkActive) return;
      setIsAdminPushToTalkActive(false);
      if (!activeCallRef.current) return;
      setIsCallMuted(true);
      applyLocalCallAudioState(true, isCallOnHold);
    },
    [applyLocalCallAudioState, isAdminPushToTalkActive, isCallOnHold]
  );

  const handleAdminEditMessage = useCallback(
    async (message) => {
      if (!adminToken || !selectedMemberId || !message?.id) return;
      const edited = window.prompt('Edit message', message.content || '');
      if (edited === null) return;
      const result = await editAdminMessage(adminToken, {
        memberId: selectedMemberId,
        messageId: message.id,
        content: edited,
      });
      if (!result?.success) {
        if (isUnauthorizedError(result?.error)) clearAdminSession('Session expired. Please login again.');
        else {
          const refreshed = await fetchAdminConversation(adminToken, selectedMemberId);
          if (refreshed?.success) {
            updateConversationForMember(selectedMemberId, Array.isArray(refreshed.messages) ? refreshed.messages : []);
          }
          setAdminError(result?.error || 'Failed to edit message.');
        }
        return;
      }
      updateConversationForMember(selectedMemberId, (prev) =>
        prev.map((msg) =>
          Number(msg.id) === Number(message.id)
            ? {
                ...msg,
                content: result.message?.content ?? edited,
                editedAt: result.message?.editedAt || new Date().toISOString(),
              }
            : msg
        )
      );
    },
    [adminToken, clearAdminSession, selectedMemberId, updateConversationForMember]
  );

  const handleAdminDeleteMessage = useCallback(
    async (message) => {
      if (!adminToken || !selectedMemberId || !message?.id) return;
      const confirmed = window.confirm('Delete this message?');
      if (!confirmed) return;
      const result = await deleteAdminMessage(adminToken, {
        memberId: selectedMemberId,
        messageId: message.id,
      });
      if (!result?.success) {
        if (isUnauthorizedError(result?.error)) clearAdminSession('Session expired. Please login again.');
        else {
          const refreshed = await fetchAdminConversation(adminToken, selectedMemberId);
          if (refreshed?.success) {
            updateConversationForMember(selectedMemberId, Array.isArray(refreshed.messages) ? refreshed.messages : []);
          }
          setAdminError(result?.error || 'Failed to delete message.');
        }
        return;
      }
      updateConversationForMember(selectedMemberId, (prev) =>
        prev.filter((msg) => Number(msg.id) !== Number(message.id))
      );
    },
    [adminToken, clearAdminSession, selectedMemberId, updateConversationForMember]
  );

  const handleAdminKickMember = useCallback(async () => {
    if (!adminToken || !selectedMemberId) return;
    const confirmed = window.confirm('Kick this member from chat access?');
    if (!confirmed) return;
    const result = await kickAdminMember(adminToken, { memberId: selectedMemberId });
    if (!result?.success) {
      if (isUnauthorizedError(result?.error)) clearAdminSession('Session expired. Please login again.');
      else setAdminError(result?.error || 'Failed to kick member.');
      return;
    }
    setActiveMembers((prev) => prev.filter((member) => member.memberId !== selectedMemberId));
    setSelectedMemberId('');
    setSelectedMemberMeta(null);
  }, [adminToken, clearAdminSession, selectedMemberId]);

  const handleAdminDeleteMember = useCallback(async () => {
    if (!adminToken || !selectedMemberId) return;
    const confirmed = window.confirm('Delete this member and full chat history?');
    if (!confirmed) return;
    const result = await deleteAdminMember(adminToken, { memberId: selectedMemberId });
    if (!result?.success) {
      if (isUnauthorizedError(result?.error)) clearAdminSession('Session expired. Please login again.');
      else setAdminError(result?.error || 'Failed to delete member.');
      return;
    }
    purgeMemberEverywhere(selectedMemberId);
  }, [adminToken, clearAdminSession, purgeMemberEverywhere, selectedMemberId]);

  useEffect(() => {
    if (isAdminAuthenticated) setIsAdminPanelOpen(true);
  }, [isAdminAuthenticated]);

  return (
    <>
      <audio ref={remoteAudioRef} autoPlay playsInline className="hidden" />

      {incomingCall && (
        <div className="fixed bottom-24 right-4 z-[97] w-[21rem] max-w-[92vw] rounded-2xl border border-indigo-300/60 bg-slate-900/95 p-3 text-slate-100 shadow-2xl">
          <p className="text-[11px] uppercase tracking-wide text-indigo-300">Incoming Call</p>
          <p className="mt-1 truncate text-sm font-semibold text-white">{incomingCall.fromName || 'Caller'}</p>
          <p className="mt-0.5 text-xs text-slate-300">Audio call</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              onClick={acceptIncomingCall}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-emerald-500/50 bg-emerald-500/20 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-500/35"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.05 3.15a1 1 0 01-.25 1.02L7.7 9.2a16 16 0 007.1 7.1l1.35-1.35a1 1 0 011.02-.25l3.15 1.05a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
              </svg>
              Pickup
            </button>
            <button
              type="button"
              onClick={() => rejectIncomingCall('Call declined')}
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-rose-500/50 bg-rose-500/20 px-3 py-2 text-xs font-semibold text-rose-100 hover:bg-rose-500/35"
            >
              <svg className="h-3.5 w-3.5 rotate-[135deg]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.05 3.15a1 1 0 01-.25 1.02L7.7 9.2a16 16 0 007.1 7.1l1.35-1.35a1 1 0 011.02-.25l3.15 1.05a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
              </svg>
              Cut
            </button>
          </div>
        </div>
      )}

      {activeCall && !isCallPanelMinimized && (
        <div className="fixed bottom-24 right-4 z-[96] w-[23rem] max-w-[94vw] rounded-2xl border border-cyan-300/40 bg-slate-900/95 p-3 text-slate-100 shadow-2xl">
          <div className="mb-2 flex items-start justify-between gap-2">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-cyan-300">Live Call</p>
              <p className="truncate text-sm font-semibold text-white">{activeCall.peerName || 'Participant'}</p>
              <p className="text-xs text-slate-300">
                {activeCall.status === 'active'
                  ? `Connected • ${formatDuration(callSeconds)}`
                  : activeCall.status === 'ringing'
                  ? 'Ringing...'
                  : 'Connecting...'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCallPanelMinimized(true)}
              className="rounded-md border border-slate-600 px-2 py-1 text-[10px] font-semibold text-slate-200 hover:border-cyan-300"
            >
              Background
            </button>
          </div>

          {(isCallOnHold || isRemoteOnHold || callNotice) && (
            <div className="mb-2 rounded-lg border border-slate-700 bg-slate-800/90 px-2 py-1.5 text-[11px] text-slate-200">
              {isCallOnHold ? 'You put this call on hold.' : isRemoteOnHold ? 'Peer is on hold.' : callNotice}
            </div>
          )}

          <div className="grid grid-cols-4 gap-1.5">
            <button
              type="button"
              onClick={toggleCallMute}
              className={`rounded-lg border px-2 py-2 text-[11px] font-semibold ${
                isCallMuted
                  ? 'border-amber-400/60 bg-amber-500/20 text-amber-100'
                  : 'border-slate-600 bg-slate-800 text-slate-100 hover:border-cyan-300'
              }`}
            >
              {isCallMuted ? 'Unmute' : 'Mute'}
            </button>
            <button
              type="button"
              onClick={toggleCallHold}
              className={`rounded-lg border px-2 py-2 text-[11px] font-semibold ${
                isCallOnHold
                  ? 'border-violet-400/60 bg-violet-500/20 text-violet-100'
                  : 'border-slate-600 bg-slate-800 text-slate-100 hover:border-cyan-300'
              }`}
            >
              {isCallOnHold ? 'Resume' : 'Hold'}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsCallPanelMinimized(true);
                if (userMode === 'member') setIsOpen(true);
                if (userMode === 'admin') setIsAdminPanelOpen(true);
              }}
              className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-2 text-[11px] font-semibold text-slate-100 hover:border-cyan-300"
            >
              Messages
            </button>
            <button
              type="button"
              onClick={() => endActiveCall({ notifyPeer: true, reason: 'Call ended' })}
              className="rounded-lg border border-rose-500/60 bg-rose-500/20 px-2 py-2 text-[11px] font-semibold text-rose-100 hover:bg-rose-500/35"
            >
              Cut
            </button>
          </div>
        </div>
      )}

      {activeCall && isCallPanelMinimized && (
        <button
          type="button"
          onClick={() => setIsCallPanelMinimized(false)}
          className="fixed bottom-24 right-4 z-[96] inline-flex items-center gap-2 rounded-full border border-cyan-300/50 bg-slate-900/95 px-3 py-2 text-xs font-semibold text-cyan-100 shadow-lg"
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
          Back to call • {formatDuration(callSeconds)}
        </button>
      )}

      {callNotice && !activeCall && !incomingCall && (
        <div className="fixed bottom-24 right-4 z-[96] max-w-[22rem] rounded-xl border border-cyan-300/40 bg-slate-900/95 px-3 py-2 text-xs font-medium text-cyan-100 shadow-lg">
          {callNotice}
        </div>
      )}

      {floatingNotice && (
        <div className="fixed bottom-24 right-4 z-50 max-w-[19rem] rounded-2xl border border-pink-200/70 bg-gradient-to-br from-pink-500 via-violet-500 to-indigo-500 px-3 py-2 text-white shadow-xl">
          <div className="flex items-start gap-2">
            <span className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/20">
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </span>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-pink-100">Your Study Companion</p>
              <p className="text-xs font-semibold text-white">{floatingNotice}</p>
            </div>
          </div>
        </div>
      )}

      {identityRequired && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center bg-slate-950/65 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-300 bg-white p-5 shadow-2xl">
            <div className="mb-3 border-b border-slate-200 pb-3">
              <h3 className="text-lg font-bold text-slate-800">Give Me Your Identity</h3>
              <p className="text-xs text-slate-500">Write your first name to continue.</p>
            </div>
            <form className="space-y-3" onSubmit={handleIdentitySubmit}>
              <input
                autoFocus
                type="text"
                value={identityInput}
                onChange={(e) => setIdentityInput(e.target.value)}
                placeholder="First name"
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
                maxLength={40}
              />
              <button
                type="submit"
                disabled={isResolvingIdentity}
                className="w-full rounded-xl bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                {isResolvingIdentity ? 'Loading...' : 'Continue'}
              </button>
            </form>
            {identityError && <p className="mt-2 rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-700">{identityError}</p>}
          </div>
        </div>
      )}

      {(userMode === 'admin' || isAdminAuthenticated) && (
        <button
          onClick={() => {
            setAdminError('');
            setIsAdminPanelOpen((prev) => !prev);
          }}
          className="fixed right-4 top-4 z-[90] flex h-9 w-9 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] font-bold text-slate-700 shadow-lg transition hover:scale-105 hover:border-indigo-400"
          title="Admin panel"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3l7 4v5c0 5-3.5 8.5-7 9-3.5-.5-7-4-7-9V7l7-4z" />
          </svg>
        </button>
      )}

      {isAdminPanelOpen && !isAdminAuthenticated && (
        <div className="fixed right-4 top-16 z-[90] w-[22rem] max-w-[92vw] rounded-2xl border border-slate-300 bg-white p-4 shadow-2xl">
          <div className="space-y-3">
            <div className="border-b border-slate-200 pb-2">
              <h3 className="text-sm font-bold text-slate-800">Admin Access</h3>
              <p className="text-xs text-slate-500">Login with username and password.</p>
            </div>

            <form className="space-y-2" onSubmit={handleAdminPasswordLogin}>
              <input
                type="text"
                placeholder="Username"
                value={adminLoginForm.username}
                onChange={(e) => setAdminLoginForm((prev) => ({ ...prev, username: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                autoComplete="username"
              />
              <input
                type="password"
                placeholder="Password"
                value={adminLoginForm.password}
                onChange={(e) => setAdminLoginForm((prev) => ({ ...prev, password: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500"
                autoComplete="current-password"
              />
              <button
                type="submit"
                disabled={adminLoading}
                className="w-full rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {adminLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            {adminError && <p className="rounded-lg bg-rose-50 px-2 py-1 text-xs text-rose-700">{adminError}</p>}
          </div>
        </div>
      )}

      {isAdminPanelOpen && isAdminAuthenticated && (
        <div className="fixed inset-0 z-[90] bg-slate-950/50 p-3 backdrop-blur-sm sm:p-5">
          <div className="mx-auto flex h-full max-w-7xl flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-700 bg-slate-900 px-4 py-3 sm:px-6">
              <div>
                <h3 className="text-base font-bold text-white">Admin Dashboard</h3>
                <p className="text-xs text-slate-300">
                  Active members: <span className="font-semibold text-indigo-300">{activeMembers.length}</span>
                  <span className="mx-2 text-slate-500">|</span>
                  Signed in as {adminProfile?.email || adminProfile?.username || 'admin'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleAdminLogout}
                  className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Logout
                </button>
                <button
                  onClick={() => setIsAdminPanelOpen(false)}
                  className="rounded-md border border-slate-600 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>

            {adminError && (
              <div className="border-b border-rose-700/40 bg-rose-900/30 px-6 py-2 text-xs text-rose-100">{adminError}</div>
            )}

            <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[360px_1fr]">
              <aside className="min-h-0 border-b border-slate-700 bg-slate-950 lg:border-b-0 lg:border-r">
                <div className="border-b border-slate-800 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Members
                </div>
                <div className="h-full space-y-2 overflow-y-auto p-3">
                  {activeMembers.length === 0 && (
                    <div className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400">
                      No active members right now.
                    </div>
                  )}

                  {activeMembers.map((member) => {
                    const isSelected = selectedMemberId === member.memberId;
                    const presenceState = !member.isOnline
                      ? 'offline'
                      : member.clientState || (member.pageVisibility !== 'visible' ? 'hidden' : 'active');
                    const presenceTone =
                      presenceState === 'offline'
                        ? 'bg-slate-700 text-slate-200'
                        : presenceState === 'hidden'
                        ? 'bg-amber-700 text-amber-100'
                        : presenceState === 'background'
                        ? 'bg-cyan-700 text-cyan-100'
                        : 'bg-emerald-700 text-white';
                    const mapHref =
                      member.mapUrl ||
                      (member.geoLabel || member.location
                        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            String(member.geoLabel || member.location)
                          )}`
                        : '');
                    return (
                      <button
                        key={member.memberId}
                        onClick={() => {
                          setSelectedMemberId(member.memberId);
                          setSelectedMemberMeta(member);
                        }}
                        className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-900/30'
                            : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between gap-2">
                          <span className="truncate text-sm font-semibold text-white">{member.memberName}</span>
                          <div className="flex items-center gap-1">
                            {member.isTyping && (
                              <span className="rounded-full bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                typing
                              </span>
                            )}
                            {member.unreadCount > 0 && (
                              <span className="rounded-full bg-rose-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                {member.unreadCount}
                              </span>
                            )}
                            <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${presenceTone}`}>
                              {presenceState}
                            </span>
                            <span className="rounded-full bg-slate-700 px-1.5 py-0.5 text-[10px] text-slate-200">
                              {formatRelative(member.lastSeenAt)}
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1 text-[11px] text-slate-300">
                          <div className="truncate"><span className="text-slate-500">ID:</span> {member.memberId}</div>
                          <div className="truncate"><span className="text-slate-500">IP:</span> {member.ipAddress || 'unknown'}</div>
                          <div className="truncate"><span className="text-slate-500">Location:</span> {member.geoLabel || member.location || 'Unknown'}</div>
                          {mapHref && (
                            <div className="truncate">
                              <span className="text-slate-500">Map:</span>{' '}
                              <a href={mapHref} target="_blank" rel="noreferrer" className="text-cyan-300 underline">
                                Google Maps
                              </a>
                            </div>
                          )}
                          <div className="truncate">
                            <span className="text-slate-500">Tabs:</span> {Number(member.activeSessionCount || 0)} open
                            {' '}({Number(member.visibleSessionCount || 0)} visible / {Number(member.focusedSessionCount || 0)} focused)
                          </div>
                          <div className="truncate"><span className="text-slate-500">Path:</span> {member.path || '/'}</div>
                          <div className="truncate"><span className="text-slate-500">Visibility:</span> {member.pageVisibility || 'visible'}</div>
                          <div className="truncate"><span className="text-slate-500">Window:</span> {member.windowFocused ? 'focused' : 'not focused'}</div>
                          <div className="truncate"><span className="text-slate-500">UA:</span> {member.userAgent || 'Unknown'}</div>
                          {member.isTyping && member.typingText && (
                            <div className="truncate text-emerald-300"><span className="text-slate-500">Typing:</span> {member.typingText}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </aside>

              <section className="flex min-h-0 flex-col bg-slate-900">
                <div className="flex items-center justify-between gap-2 border-b border-slate-700 px-4 py-3 sm:px-6">
                  <div className="min-w-0 text-sm font-semibold text-slate-100">
                    <div className="truncate">
                      {selectedMemberDisplay ? `Chat: ${selectedMemberDisplay.memberName}` : 'Select a member to chat'}
                    </div>
                    {selectedMemberDisplay?.isTyping && (
                      <div className="mt-0.5 max-w-[36rem] truncate text-xs font-normal text-emerald-300">
                        typing: {selectedMemberDisplay.typingText || '...'}
                      </div>
                    )}
                    <div className="mt-2">
                      <label className="flex items-center gap-2 rounded-md border border-slate-600 bg-slate-800 px-2.5 py-1.5">
                        <svg className="h-3.5 w-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                          value={adminSearchQuery}
                          onChange={(event) => setAdminSearchQuery(event.target.value)}
                          placeholder="Search in messages"
                          className="w-full bg-transparent text-xs font-normal text-slate-100 outline-none placeholder:text-slate-400"
                        />
                      </label>
                    </div>
                  </div>
                  {selectedMemberId && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          startCallWithTarget({
                            memberId: selectedMemberId,
                            peerName: selectedMemberDisplay?.memberName || 'Member',
                          })
                        }
                        disabled={!selectedMemberId || Boolean(activeCall) || Boolean(incomingCall)}
                        className="rounded-md border border-cyan-600/50 bg-cyan-900/30 px-2 py-1 text-[11px] font-semibold text-cyan-200 hover:bg-cyan-800/40 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span className="inline-flex items-center gap-1">
                          <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.05 3.15a1 1 0 01-.25 1.02L7.7 9.2a16 16 0 007.1 7.1l1.35-1.35a1 1 0 011.02-.25l3.15 1.05a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
                          </svg>
                          Call
                        </span>
                      </button>
                      <button
                        onClick={handleAdminKickMember}
                        className="rounded-md border border-amber-600/50 bg-amber-900/30 px-2 py-1 text-[11px] font-semibold text-amber-200 hover:bg-amber-800/40"
                      >
                        Kick
                      </button>
                      <button
                        onClick={handleAdminDeleteMember}
                        className="rounded-md border border-rose-600/50 bg-rose-900/30 px-2 py-1 text-[11px] font-semibold text-rose-200 hover:bg-rose-800/40"
                      >
                        Delete User
                      </button>
                    </div>
                  )}
                </div>

                <div
                  ref={adminMessagesScrollRef}
                  onScroll={(event) => {
                    const target = event.currentTarget;
                    const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
                    adminAutoScrollRef.current = distance < 120;
                  }}
                  className="min-h-0 flex-1 space-y-2 overflow-y-auto p-4 sm:p-6"
                >
                  {adminConversation.length === 0 && (
                    <p className="text-xs text-slate-400">No messages yet for this member.</p>
                  )}

                  {adminConversation.length > 0 && filteredAdminConversation.length === 0 && (
                    <p className="text-xs text-slate-400">No messages match your search.</p>
                  )}

                  {filteredAdminConversation.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${
                          msg.from === 'admin'
                            ? 'rounded-br-md bg-indigo-600 text-white'
                            : 'rounded-bl-md bg-slate-700 text-slate-100'
                        }`}
                      >
                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                        <AttachmentList attachments={msg.attachments} theme={msg.from === 'admin' ? 'admin' : 'slate'} />
                        <div className={`mt-1 text-[10px] ${msg.from === 'admin' ? 'text-indigo-200' : 'text-slate-300'}`}>
                          {formatDateTime(msg.createdAt)}
                          {msg.editedAt ? ' • edited' : ''}
                          {msg.from === 'admin' && (
                            <span className="ml-1 font-semibold">
                              {msg.pending
                                ? '⏳'
                                : msg.readByMember || msg.seenAt
                                ? '✓✓ Seen'
                                : msg.deliveredAt
                                ? '✓✓'
                                : '✓'}
                            </span>
                          )}
                        </div>
                        {!msg.pending && (
                          <div className="mt-1 flex gap-2 text-[10px]">
                            <button
                              onClick={() => handleAdminEditMessage(msg)}
                              className="rounded bg-black/20 px-1.5 py-0.5 hover:bg-black/30"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleAdminDeleteMessage(msg)}
                              className="rounded bg-black/20 px-1.5 py-0.5 hover:bg-black/30"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  {!normalizeSearchQuery(adminSearchQuery) && <div ref={adminMessageEndRef} />}
                </div>

                <div className="border-t border-slate-700 bg-slate-950 px-4 py-3 sm:px-6">
                  <ComposerAttachmentPreview attachments={adminAttachments} onRemove={handleRemoveAdminAttachment} />
                  {isAdminRecordingVoice && (
                    <div className="mb-2 flex items-center gap-2 rounded-lg border border-rose-700/50 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                      Recording voice: {formatDuration(adminRecordingSeconds)}
                    </div>
                  )}
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <div className="relative" ref={adminEmojiRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminStickerPicker(false);
                          setShowAdminAiAssist(false);
                          setShowAdminEmojiPicker((prev) => !prev);
                        }}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        Emoji
                      </button>
                      {showAdminEmojiPicker && (
                        <div className="absolute bottom-10 left-0 z-20 w-72 rounded-xl border border-slate-600 bg-slate-900 p-2 shadow-xl">
                          <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Recent</div>
                          <div className="mb-2 flex flex-wrap gap-1">
                            {(recentEmojis.length ? recentEmojis : ['😊', '🔥', '💯', '✨']).slice(0, 12).map((emoji) => (
                              <button
                                key={`admin_recent_${emoji}`}
                                type="button"
                                onClick={() => handleAdminEmojiPick(emoji)}
                                className="rounded-md border border-slate-700 px-1.5 py-1 text-base hover:border-indigo-400"
                              >
                                {emoji}
                              </button>
                            ))}
                          </div>
                          <div className="max-h-36 space-y-1 overflow-y-auto">
                            {EMOJI_GROUPS.map((group, idx) => (
                              <div key={`admin_group_${idx}`} className="flex flex-wrap gap-1">
                                {group.map((emoji) => (
                                  <button
                                    key={`admin_${emoji}`}
                                    type="button"
                                    onClick={() => handleAdminEmojiPick(emoji)}
                                    className="rounded-md border border-slate-700 px-1.5 py-1 text-base hover:border-indigo-400"
                                  >
                                    {emoji}
                                  </button>
                                ))}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative" ref={adminStickerRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminEmojiPicker(false);
                          setShowAdminAiAssist(false);
                          setShowAdminStickerPicker((prev) => !prev);
                        }}
                        className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-700"
                      >
                        Sticker
                      </button>
                      {showAdminStickerPicker && (
                        <div className="absolute bottom-10 left-0 z-20 w-80 rounded-xl border border-slate-600 bg-slate-900 p-2 shadow-xl">
                          <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Sticker Library</div>
                          <div className="mb-2 flex items-center gap-1">
                            <input
                              value={adminStickerSearch}
                              onChange={(event) => setAdminStickerSearch(event.target.value)}
                              placeholder="Search stickers"
                              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                if (adminStickerOptions.length === 0) return;
                                const random = adminStickerOptions[Math.floor(Math.random() * adminStickerOptions.length)];
                                sendAdminStickerNow(`${random.emoji} ${random.text}`, random.tone);
                              }}
                              className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-200 hover:border-indigo-400"
                            >
                              Random
                            </button>
                            <button
                              type="button"
                              onClick={sendAdminStickerFromChat}
                              className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-200 hover:border-indigo-400"
                            >
                              Auto
                            </button>
                          </div>
                          {recentStickers.length > 0 && (
                            <div className="mb-2">
                              <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Recent</div>
                              <div className="flex flex-wrap gap-1">
                                {recentStickers.slice(0, 6).map((text) => {
                                  const preview = buildStickerAttachment(text, 'rose', `recent-admin-${text}`);
                                  return (
                                    <button
                                      key={`admin_recent_sticker_chip_${text}`}
                                      type="button"
                                      onClick={() => sendAdminStickerNow(text, 'rose')}
                                      className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 hover:border-indigo-400"
                                    >
                                      <img src={preview?.dataUrl} alt={text} className="h-10 w-10 object-cover" />
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                          <div className="mb-2 grid max-h-44 grid-cols-3 gap-1 overflow-y-auto">
                            {adminStickerOptions.map((sticker) => (
                              <button
                                key={`admin_sticker_${sticker.text}_${sticker.emoji}`}
                                type="button"
                                onClick={() => sendAdminStickerNow(`${sticker.emoji} ${sticker.text}`, sticker.tone)}
                                className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-left hover:border-indigo-400"
                                title={`${sticker.emoji} ${sticker.text}`}
                              >
                                <img src={sticker.previewUrl} alt={sticker.text} className="h-16 w-full object-cover" />
                              </button>
                            ))}
                          </div>
                          <div className="flex items-center gap-1">
                            <input
                              value={adminStickerPrompt}
                              onChange={(event) => setAdminStickerPrompt(event.target.value)}
                              placeholder="Generate custom sticker"
                              className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-indigo-500"
                              maxLength={80}
                            />
                            <button
                              type="button"
                              onClick={() => sendAdminStickerNow(adminStickerPrompt || 'Custom sticker', 'rose')}
                              className="rounded-lg bg-indigo-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500"
                            >
                              Create
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="relative" ref={adminAiRef}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAdminEmojiPicker(false);
                          setShowAdminStickerPicker(false);
                          setShowAdminAiAssist((prev) => !prev);
                        }}
                        className="rounded-lg border border-indigo-500/50 bg-indigo-900/30 px-3 py-1.5 text-xs font-semibold text-indigo-200 hover:bg-indigo-800/40"
                      >
                        AI Assist
                      </button>
                      {showAdminAiAssist && (
                        <div className="absolute bottom-10 left-0 z-20 w-[23rem] rounded-xl border border-slate-600 bg-slate-900 p-3 shadow-xl">
                          <div className="mb-2 flex items-center gap-2">
                            <select
                              value={adminAiProvider}
                              onChange={(event) => setAdminAiProvider(event.target.value)}
                              className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none"
                            >
                              <option value="groq">Groq</option>
                              <option value="gemini">Gemini</option>
                            </select>
                            <input
                              value={adminAiPrompt}
                              onChange={(event) => setAdminAiPrompt(event.target.value)}
                              className="min-w-0 flex-1 rounded-md border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-500"
                              placeholder="Tone: playful, warm, concise"
                            />
                            <button
                              type="button"
                              onClick={handleAdminAiGenerate}
                              disabled={adminAiLoading || !selectedMemberId}
                              className="rounded-md bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500 disabled:opacity-50"
                            >
                              {adminAiLoading ? '...' : 'Generate'}
                            </button>
                          </div>
                          <div className="max-h-40 space-y-1 overflow-y-auto">
                            {adminAiSuggestions.length === 0 && (
                              <div className="rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-400">
                                Suggestions will appear here.
                              </div>
                            )}
                            {adminAiSuggestions.map((line, idx) => (
                              <button
                                key={`ai_line_${idx}`}
                                type="button"
                                onClick={() => {
                                  setAdminInput(line);
                                  setShowAdminAiAssist(false);
                                }}
                                className="w-full rounded-md border border-slate-700 bg-slate-800 px-2 py-1.5 text-left text-xs text-slate-100 hover:border-indigo-400 hover:bg-slate-700"
                              >
                                {line}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                    <input
                      ref={adminFileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleAdminAttachmentPick}
                    />
                    <button
                      type="button"
                      onClick={() => adminFileInputRef.current?.click()}
                      disabled={!selectedMemberId || isAdminSending}
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L19 8.828a4 4 0 00-5.656-5.656L5.757 10.76a6 6 0 108.486 8.486L20 13" />
                      </svg>
                      Media
                    </button>
                    {isAdminRecordingVoice ? (
                      <button
                        type="button"
                        onClick={handleAdminStopVoice}
                        disabled={!selectedMemberId || isAdminSending}
                        className="inline-flex items-center gap-1 rounded-lg border border-rose-500 bg-rose-500/20 px-3 py-2 text-sm font-semibold text-rose-200"
                        title="Stop recording"
                      >
                        <span className="h-2.5 w-2.5 rounded-sm bg-rose-300" />
                        Stop
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleAdminStartVoice}
                        disabled={!selectedMemberId || isAdminSending}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
                        title="Record voice message"
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0a3 3 0 003-3V7a3 3 0 10-6 0v2a3 3 0 003 3zm5 0v1a5 5 0 01-10 0v-1m5 6v3" />
                        </svg>
                        Mic
                      </button>
                    )}
                    <button
                      type="button"
                      onPointerDown={handleAdminPushToTalkDown}
                      onPointerUp={handleAdminPushToTalkUp}
                      onPointerCancel={handleAdminPushToTalkUp}
                      onPointerLeave={handleAdminPushToTalkUp}
                      disabled={!selectedMemberId || isAdminSending}
                      className={`inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                        isAdminPushToTalkActive
                          ? 'border-rose-500 bg-rose-500/20 text-rose-100'
                          : 'border-slate-600 bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                      title="Hold to talk (walkie-talkie)"
                    >
                      <span className={`h-2 w-2 rounded-full ${isAdminPushToTalkActive ? 'bg-rose-300' : 'bg-slate-300'}`} />
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0a3 3 0 003-3V7a3 3 0 10-6 0v2a3 3 0 003 3zm5 0v1a5 5 0 01-10 0v-1m5 6v3" />
                      </svg>
                      Push to Talk
                    </button>
                    <input
                      value={adminInput}
                      onChange={(e) => setAdminInput(e.target.value)}
                      onKeyDown={handleAdminInputKeyDown}
                      placeholder="Reply to selected member"
                      className="min-w-0 flex-1 rounded-lg border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-white outline-none focus:border-indigo-500"
                      disabled={!selectedMemberId || isAdminSending}
                    />
                    <button
                      onClick={handleAdminSend}
                      disabled={!selectedMemberId || (!adminInput.trim() && adminAttachments.length === 0) || isAdminSending}
                      className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      )}

      {userMode === 'member' && !identityRequired && !isAdminAuthenticated && (
        <>
          <div
            className={`fixed bottom-20 left-3 right-3 z-50 transition-all duration-300 ease-out sm:left-auto sm:right-4 ${
              isOpen ? 'pointer-events-auto translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'
            }`}
          >
            <div className="w-full max-w-[28rem] overflow-hidden rounded-2xl border border-slate-700 bg-slate-800 shadow-2xl">
              <div className="relative flex items-center justify-between bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white/20">
                    <CuteToddler mood={avatarMood} size={40} direction={1} action={avatarAction} />
                    <span className="absolute -bottom-1 -right-1 rounded-full bg-white px-1.5 py-0.5 text-[9px] font-bold text-violet-700">
                      SC
                    </span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Your Study Companion</h3>
                    <p className="text-xs text-violet-200">Support chat • {memberName}</p>
                    <label className="mt-1 flex w-44 max-w-full items-center gap-1.5 rounded-md border border-violet-300/40 bg-slate-900/35 px-2 py-1">
                      <svg className="h-3 w-3 text-violet-200/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      <input
                        value={memberSearchQuery}
                        onChange={(event) => setMemberSearchQuery(event.target.value)}
                        placeholder="Search in messages"
                        className="w-full bg-transparent text-[11px] text-violet-100 placeholder-violet-200/60 outline-none"
                      />
                    </label>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      startCallWithTarget({
                        memberId: memberIdentity.memberId,
                        peerName: 'Admin',
                      })
                    }
                    disabled={Boolean(activeCall) || Boolean(incomingCall)}
                    className="rounded-md border border-cyan-200/40 bg-cyan-500/20 px-2 py-1 text-[11px] font-semibold text-cyan-100 hover:bg-cyan-500/30 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.05 3.15a1 1 0 01-.25 1.02L7.7 9.2a16 16 0 007.1 7.1l1.35-1.35a1 1 0 011.02-.25l3.15 1.05a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C9.16 21 3 14.84 3 7V5z" />
                      </svg>
                      Call
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setIsMemberMenuOpen(false);
                    }}
                    className="p-1 text-white/70 transition-colors hover:text-white"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
    
              <div
                ref={memberMessagesScrollRef}
                onScroll={(event) => {
                  const target = event.currentTarget;
                  const distance = target.scrollHeight - target.scrollTop - target.clientHeight;
                  memberAutoScrollRef.current = distance < 120;
                }}
                className="h-[min(58vh,30rem)] space-y-3 overflow-y-auto bg-slate-900/50 p-4"
              >
                {systemNotice && (
                  <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-300">
                    {systemNotice}
                  </div>
                )}

                {messages.length > 0 && filteredMemberMessages.length === 0 && (
                  <div className="rounded-lg border border-slate-600/60 bg-slate-800/60 px-3 py-2 text-xs text-slate-300">
                    No messages match your search.
                  </div>
                )}

                {filteredMemberMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`} data-message-id={msg.id}>
                    <div
                      className={`max-w-[84%] rounded-2xl px-4 py-2 text-sm ${
                        msg.role === 'user' ? 'rounded-br-md bg-violet-600 text-white' : 'rounded-bl-md bg-slate-700 text-slate-200 message-from-admin'
                      }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                  <AttachmentList attachments={msg.attachments} theme={msg.role === 'user' ? 'admin' : 'slate'} />
                  <div className="mt-1 text-[10px] text-slate-300">
                    {formatDateTime(msg.createdAt)}
                    {msg.editedAt ? ' • edited' : ''}
                    {msg.status === 'sending' ? ' • sending' : ''}
                    {msg.status === 'failed' ? ' • failed' : ''}
                  </div>
                </div>
              </div>
            ))}

                {isSending && (
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-md bg-violet-700/70 px-4 py-2 text-xs text-violet-100">
                      Sending...
                    </div>
                  </div>
                )}
                {!normalizeSearchQuery(memberSearchQuery) && <div ref={messagesEndRef} />}
              </div>

              <div className="border-t border-slate-700 bg-slate-800 p-3">
                <ComposerAttachmentPreview attachments={memberAttachments} onRemove={handleRemoveMemberAttachment} />
                {isMemberRecordingVoice && (
                  <div className="mb-2 flex items-center gap-2 rounded-lg border border-rose-700/50 bg-rose-500/10 px-3 py-1.5 text-xs text-rose-200">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-rose-400" />
                    Recording voice: {formatDuration(memberRecordingSeconds)}
                  </div>
                )}
                <div className="mb-2 flex items-center gap-2">
                  <div className="relative" ref={memberEmojiRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMemberStickerPicker(false);
                        setShowMemberEmojiPicker((prev) => !prev);
                      }}
                      className="rounded-full border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-600"
                    >
                      Emoji
                    </button>
                    {showMemberEmojiPicker && (
                      <div className="absolute bottom-10 left-0 z-20 w-72 rounded-xl border border-slate-600 bg-slate-900 p-2 shadow-xl">
                        <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Recent</div>
                        <div className="mb-2 flex flex-wrap gap-1">
                          {(recentEmojis.length ? recentEmojis : ['😊', '🔥', '💯', '✨']).slice(0, 12).map((emoji) => (
                            <button
                              key={`member_recent_${emoji}`}
                              type="button"
                              onClick={() => handleMemberEmojiPick(emoji)}
                              className="rounded-md border border-slate-700 px-1.5 py-1 text-base hover:border-violet-400"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                        <div className="max-h-36 space-y-1 overflow-y-auto">
                          {EMOJI_GROUPS.map((group, idx) => (
                            <div key={`member_group_${idx}`} className="flex flex-wrap gap-1">
                              {group.map((emoji) => (
                                <button
                                  key={`member_${emoji}`}
                                  type="button"
                                  onClick={() => handleMemberEmojiPick(emoji)}
                                  className="rounded-md border border-slate-700 px-1.5 py-1 text-base hover:border-violet-400"
                                >
                                  {emoji}
                                </button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="relative" ref={memberStickerRef}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowMemberEmojiPicker(false);
                        setShowMemberStickerPicker((prev) => !prev);
                      }}
                      className="rounded-full border border-slate-600 bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 hover:bg-slate-600"
                    >
                      Sticker
                    </button>
                    {showMemberStickerPicker && (
                      <div className="absolute bottom-10 left-0 z-20 w-80 rounded-xl border border-slate-600 bg-slate-900 p-2 shadow-xl">
                        <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-400">Sticker Library</div>
                        <div className="mb-2 flex items-center gap-1">
                          <input
                            value={memberStickerSearch}
                            onChange={(event) => setMemberStickerSearch(event.target.value)}
                            placeholder="Search stickers"
                            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (memberStickerOptions.length === 0) return;
                              const random = memberStickerOptions[Math.floor(Math.random() * memberStickerOptions.length)];
                              sendMemberStickerNow(`${random.emoji} ${random.text}`, random.tone);
                            }}
                            className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-200 hover:border-violet-400"
                          >
                            Random
                          </button>
                          <button
                            type="button"
                            onClick={sendMemberStickerFromChat}
                            className="rounded-lg border border-slate-600 bg-slate-800 px-2 py-1.5 text-[11px] text-slate-200 hover:border-violet-400"
                          >
                            Auto
                          </button>
                        </div>
                        {recentStickers.length > 0 && (
                          <div className="mb-2">
                            <div className="mb-1 text-[10px] uppercase tracking-wide text-slate-500">Recent</div>
                            <div className="flex flex-wrap gap-1">
                              {recentStickers.slice(0, 6).map((text) => {
                                const preview = buildStickerAttachment(text, 'violet', `recent-member-${text}`);
                                return (
                                  <button
                                    key={`member_recent_sticker_chip_${text}`}
                                    type="button"
                                    onClick={() => sendMemberStickerNow(text, 'violet')}
                                    className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 hover:border-violet-400"
                                  >
                                    <img src={preview?.dataUrl} alt={text} className="h-10 w-10 object-cover" />
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        <div className="mb-2 grid max-h-44 grid-cols-3 gap-1 overflow-y-auto">
                          {memberStickerOptions.map((sticker) => (
                            <button
                              key={`member_sticker_${sticker.text}_${sticker.emoji}`}
                              type="button"
                              onClick={() => sendMemberStickerNow(`${sticker.emoji} ${sticker.text}`, sticker.tone)}
                              className="overflow-hidden rounded-md border border-slate-700 bg-slate-800 text-left hover:border-violet-400"
                              title={`${sticker.emoji} ${sticker.text}`}
                            >
                              <img src={sticker.previewUrl} alt={sticker.text} className="h-16 w-full object-cover" />
                            </button>
                          ))}
                        </div>
                        <div className="flex items-center gap-1">
                          <input
                            value={memberStickerPrompt}
                            onChange={(event) => setMemberStickerPrompt(event.target.value)}
                            placeholder="Generate custom sticker"
                            className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1.5 text-xs text-white outline-none focus:border-violet-500"
                            maxLength={80}
                          />
                          <button
                            type="button"
                            onClick={() => sendMemberStickerNow(memberStickerPrompt || 'Custom sticker', 'violet')}
                            className="rounded-lg bg-violet-600 px-2 py-1.5 text-xs font-semibold text-white hover:bg-violet-500"
                          >
                            Create
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                  <input
                    ref={memberFileInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={handleMemberAttachmentPick}
                  />
                  <button
                    type="button"
                    onClick={() => memberFileInputRef.current?.click()}
                    disabled={isSending}
                    className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-700 h-10 w-10 text-slate-200 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L19 8.828a4 4 0 00-5.656-5.656L5.757 10.76a6 6 0 108.486 8.486L20 13" />
                    </svg>
                  
                  </button>
                  {isMemberRecordingVoice ? (
                    <button
                      type="button"
                      onClick={handleMemberStopVoice}
                      disabled={isSending}
                      className="inline-flex items-center justify-center rounded-full border border-rose-500 bg-rose-500/10 h-10 w-10 text-rose-200"
                      title="Stop recording"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 6h12v12H6z" />
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleMemberStartVoice}
                      disabled={isSending}
                      className="inline-flex items-center justify-center rounded-full border border-slate-600 bg-slate-700 h-10 w-10 text-slate-200 hover:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Record voice message"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0a3 3 0 003-3V7a3 3 0 10-6 0v2a3 3 0 003 3zm5 0v1a5 5 0 01-10 0v-1m5 6v3" />
                      </svg>
                    </button>
                  )}
                  <button
                    type="button"
                    onPointerDown={handleMemberPushToTalkDown}
                    onPointerUp={handleMemberPushToTalkUp}
                    onPointerCancel={handleMemberPushToTalkUp}
                    onPointerLeave={handleMemberPushToTalkUp}
                    disabled={isSending}
                    className={`inline-flex items-center justify-center rounded-full border h-10 w-10 disabled:cursor-not-allowed disabled:opacity-50 ${
                      isMemberPushToTalkActive
                        ? 'border-rose-500 bg-rose-500/20 text-rose-100'
                        : 'border-slate-600 bg-slate-700 text-slate-200 hover:bg-slate-600'
                    }`}
                    title="Hold to talk (walkie-talkie)"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v8m0 0a3 3 0 003-3V7a3 3 0 10-6 0v2a3 3 0 003 3zm5 0v1a5 5 0 01-10 0v-1m5 6v3" />
                    </svg>
                  </button>
                  <textarea
                    ref={inputRef}
                    rows={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendUserMessage();
                      }
                    }}
                    placeholder="Send your message..."
                    className="min-w-0 flex-1 rounded-full border border-slate-600 bg-slate-700 px-4 py-2 text-sm text-white placeholder-slate-400 focus:border-violet-500 focus:outline-none resize-none overflow-y-auto max-h-24"
                    disabled={isSending}
                  />
                  <button
                    onClick={sendUserMessage}
                    disabled={(!inputValue.trim() && memberAttachments.length === 0) || isSending}
                    title="Send"
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-violet-600 text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <svg className="h-4 w-4 transform rotate-45" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9-7-9-7-2 6-7 1 9 7z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div ref={memberMenuRef} className="fixed right-4 top-4 z-50">
            <button
              type="button"
              onClick={() => setIsMemberMenuOpen((prev) => !prev)}
              className="rounded-full border border-slate-500 bg-slate-800/95 px-3 py-1.5 text-[11px] font-semibold text-slate-100 shadow-lg transition hover:border-violet-400 hover:bg-slate-700"
            >
              <span className="inline-flex items-center gap-1">
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9 9 0 1118.88 17.8M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Manage Account
              </span>
            </button>
            {isMemberMenuOpen && (
              <div className="absolute right-0 top-10 mt-2 min-w-44 rounded-xl border border-slate-600 bg-slate-900/95 p-2 shadow-xl">
                <button
                  type="button"
                  onClick={handleMemberLogout}
                  className="mb-1 w-full rounded-lg border border-slate-700 px-3 py-2 text-left text-xs font-semibold text-slate-200 hover:border-indigo-400 hover:bg-indigo-500/10"
                >
                  Logout
                </button>
                <button
                  type="button"
                  onClick={handleMemberDeleteAccount}
                  disabled={isDeletingMemberAccount}
                  className="w-full rounded-lg border border-rose-800 px-3 py-2 text-left text-xs font-semibold text-rose-200 hover:bg-rose-500/10 disabled:opacity-60"
                >
                  {isDeletingMemberAccount ? 'Deleting...' : 'Delete Account'}
                </button>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              const nextOpen = !isOpen;
              setIsOpen(nextOpen);
              if (!nextOpen) {
                setIsMemberMenuOpen(false);
                setShowMemberEmojiPicker(false);
                setShowMemberStickerPicker(false);
              }
              if (nextOpen) {
                setUnreadCount(0);
                animateAvatarReaction('excited', 'jump');
              } else {
                setAvatarMood('happy');
                setAvatarAction('idle');
              }
            }}
            className={`fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full shadow-xl transition-all duration-300 ${
              isOpen
                ? 'border border-slate-600 bg-slate-700/50 backdrop-blur-md'
                : 'bg-gradient-to-br from-violet-600 via-pink-500 to-indigo-600 hover:scale-105 hover:shadow-2xl'
            }`}
            title="Open chat"
          >
            {isOpen ? (
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <div className="-translate-y-1 scale-75 transform">
                <CuteToddler mood={avatarMood} size={60} direction={1} action={avatarAction} />
              </div>
            )}

            {!isOpen && unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 rounded-full border border-white bg-pink-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                {unreadCount > 10 ? '10+' : unreadCount}
              </span>
            )}
          </button>
        </>
      )}
    </>
  );
}

export default AIChatAssistant;
