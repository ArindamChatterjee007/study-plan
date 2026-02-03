import React from 'react';
import { Star } from 'lucide-react';

// Status Badge Component
export const StatusBadge = ({ status }) => {
  const isDone = status === 'Done';
  
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${
        isDone
          ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400'
          : 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isDone ? 'bg-emerald-500' : 'bg-amber-500'}`} />
      {status}
    </span>
  );
};

// Confidence Stars Component
export const ConfidenceStars = ({ level }) => {
  if (level === 'TBA') {
    return <span className="text-slate-400 dark:text-slate-500 text-xs">TBA</span>;
  }
  
  const numLevel = typeof level === 'number' ? level : parseInt(level, 10);
  
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-3.5 h-3.5 ${
            star <= numLevel
              ? 'fill-amber-400 text-amber-400'
              : 'fill-slate-200 text-slate-200 dark:fill-slate-600 dark:text-slate-600'
          }`}
        />
      ))}
    </div>
  );
};

// Progress Bar Component
export const ProgressBar = ({ completed, total, showLabel = true }) => {
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 whitespace-nowrap">
          {completed}/{total} Days
        </span>
      )}
    </div>
  );
};

// TBA Cell Component
export const TBACell = ({ value }) => {
  if (value === 'TBA') {
    return <span className="text-slate-400 dark:text-slate-500 italic text-sm">TBA</span>;
  }
  return <span>{value}</span>;
};

// Platform Badge Component
export const PlatformBadge = ({ platform }) => {
  if (platform === 'TBA') {
    return <span className="text-slate-400 dark:text-slate-500 italic text-sm">TBA</span>;
  }
  
  const colors = {
    LeetCode: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-400',
    HackerRank: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    CodeForces: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  };
  
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[platform] || colors.default}`}>
      {platform}
    </span>
  );
};

// Stats Card Component
export const StatsCard = ({ icon: Icon, label, value, color = 'indigo' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400',
  };
  
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{value}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
        </div>
      </div>
    </div>
  );
};
