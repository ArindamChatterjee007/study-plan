import{c as A,r as m,j as e}from"./index-BvzBKsDk.js";import{S as H}from"./StudyCodeBlock-KJ-pM_cg.js";import{C as W}from"./code-CZbYZ7bo.js";import{C as P}from"./circle-check-big-DptvikTn.js";import{C as E,M as B,a as q,L as K}from"./maximize-DjC-f6cL.js";import{A as V}from"./activity-46wgX4GL.js";import{B as F}from"./brain-DmmFWgIh.js";import{H as Y}from"./hash-DHCD7wTs.js";import{L as J}from"./layers-BMzYwFUp.js";import{A as X}from"./arrow-right-lXoZ774-.js";import{T as Q,L as Z}from"./trending-up-5U5ZAR4Z.js";import{B as ee}from"./book-open-BqayCdbu.js";import{C as te}from"./chevron-down-D-XyoH8u.js";import{C as se}from"./clock-BIk2KS7K.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ne=A("RefreshCcw",[["path",{d:"M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8",key:"14sxne"}],["path",{d:"M3 3v5h5",key:"1xhq8a"}],["path",{d:"M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16",key:"1hlbsb"}],["path",{d:"M16 16h5v5",key:"ccwih5"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const ae=A("Save",[["path",{d:"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",key:"1c8476"}],["path",{d:"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",key:"1ydtos"}],["path",{d:"M7 3v4a1 1 0 0 0 1 1h7",key:"t51u73"}]]),z="dsa_strength_plan_data",U="week2_penalty_topics_local",M="1K0Hs23qhII18wDNUFylDuTzhdkV25YAZbRXNSLGunQo",T="1103660116",ie=`https://docs.google.com/spreadsheets/d/${M}/edit?gid=${T}#gid=${T}`,L="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec".trim(),re=t=>{const l=[];let i=[],c="",o=!1;for(let u=0;u<t.length;u+=1){const h=t[u];o?h==='"'?t[u+1]==='"'?(c+='"',u+=1):o=!1:c+=h:h==='"'?o=!0:h===","?(i.push(c),c=""):h===`
`?(i.push(c),l.push(i),i=[],c=""):h!=="\r"&&(c+=h)}return(c.length>0||i.length>0)&&(i.push(c),l.push(i)),l},O=t=>String(t||"").trim(),oe=()=>{if(typeof window>"u")return[];try{const t=localStorage.getItem(U);if(!t)return[];const l=JSON.parse(t);return Array.isArray(l)?l:[]}catch{return[]}},D=t=>{if(!(typeof window>"u"))try{localStorage.setItem(U,JSON.stringify(t))}catch(l){console.error("[Day5] Failed to persist local penalty topics:",l)}},le=async t=>{if(!L)return{synced:!1,message:"Local only"};const l=await fetch(L,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"appendPenaltyTopic",sheetId:M,gid:T,...t})});if(!l.ok)throw new Error(`HTTP ${l.status}`);return{synced:!0,message:"Synced to Google Docs backend"}},ce=t=>{if(!t||t.length===0)return[];const l=t[0].map(n=>O(n).toLowerCase()),i=n=>l.findIndex(d=>n.some(f=>d.includes(f))),c=i(["day"]),o=i(["date"]),u=i(["c++ topic","topic"]),h=i(["output"]),v=i(["leetcode"]),g=i(["status"]),j=i(["remarks"]),p=(n,d)=>d>=0?O(n[d]):"";return t.slice(1).map((n,d)=>{const f=p(n,c),N=f.toLowerCase(),s=p(n,o),a=p(n,u),x=p(n,h),r=p(n,v),b=p(n,g),y=p(n,j),C=N.includes("penalty topic");if(!C&&!(a||x||r||y))return null;if(C){const S=n.map(($,G)=>G===c?"":O($)).filter(Boolean),R=S.length===0?"Penalty topics row exists in sheet, but no detail text was found.":S.length===1&&/^\d+$/.test(S[0])?`Penalty target count: ${S[0]}`:S.join(" | ");return{id:`sheet-${d+1}-penalty`,title:"Penalty Topics",content:R,source:"week2-sheet"}}const I=a||r||x||y||`Topic ${d+1}`,w=[];return s&&w.push(`Date: ${s}`),a&&w.push(`C++ Topic: ${a}`),x&&w.push(`Output: ${x}`),r&&w.push(`LeetCode: ${r}`),b&&w.push(`Status: ${b}`),y&&w.push(`Remarks: ${y}`),{id:`sheet-${d+1}`,title:f?`${f} - ${I}`:I,content:w.join(`
`),source:"week2-sheet"}}).filter(Boolean)},Te=()=>{const[t,l]=m.useState(null),[i,c]=m.useState(null),[o,u]=m.useState([]),[h,v]=m.useState(!1),[g,j]=m.useState(null),[p,n]=m.useState(()=>{if(typeof window>"u")return{};try{const s=localStorage.getItem(z);return s?JSON.parse(s):{}}catch(s){return console.error("[Day5] Failed to load progress:",s),{}}});m.useEffect(()=>{try{localStorage.setItem(z,JSON.stringify(p))}catch(s){console.error("[Day5] Failed to save progress:",s)}},[p]),m.useEffect(()=>{let s=!1;const a=`https://docs.google.com/spreadsheets/d/${M}/export?format=csv&gid=${T}`;return(async()=>{v(!0),j(null);try{const r=await fetch(a);if(!r.ok)throw new Error(`HTTP ${r.status}`);const b=await r.text(),y=re(b),C=ce(y);s||u(C)}catch{s||(u([]),j("Unable to load Week 2 topics from Google Sheets."))}finally{s||v(!1)}})(),()=>{s=!0}},[]);const d=m.useMemo(()=>{const s=Object.values(p).map(r=>(r==null?void 0:r.status)||"Pending"),a=s.filter(r=>r==="Done").length,x=s.filter(r=>r==="Revision").length;return{done:a,revision:x,pending:_.length-a-x}},[p]),f=s=>{l(a=>a===s?null:s)},N=(s,a,x)=>{n(r=>({...r,[s]:{...r[s],[a]:x}}))};return e.jsxs("div",{className:"min-h-screen bg-slate-50 pb-20 text-slate-800 font-sans",children:[e.jsx("div",{className:"bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl",children:e.jsxs("div",{className:"mx-auto max-w-5xl px-6 py-10",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-3 opacity-90",children:[e.jsx(W,{size:20}),e.jsx("span",{className:"text-sm font-bold uppercase tracking-widest",children:"Interview Prep"})]}),e.jsx("h1",{className:"mb-4 text-3xl font-bold md:text-4xl",children:"Aishwarya - Structured DSA Strength Plan"}),e.jsx("p",{className:"max-w-2xl text-lg text-indigo-100",children:"A curated roadmap from foundational arrays to complex hash maps, organized in increasing difficulty."})]})}),e.jsxs("main",{className:"mx-auto max-w-5xl space-y-16 px-6 py-10",children:[e.jsx("section",{className:"rounded-2xl border border-indigo-100 bg-white p-5 shadow-sm",children:e.jsxs("div",{className:"flex flex-wrap items-center gap-3",children:[e.jsxs("span",{className:"inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700",children:[e.jsx(P,{size:14})," ",d.done," Done"]}),e.jsxs("span",{className:"inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700",children:[e.jsx(ne,{size:14})," ",d.revision," Revision"]}),e.jsxs("span",{className:"inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600",children:[e.jsx(E,{size:14})," ",d.pending," Pending"]})]})}),e.jsxs("section",{children:[e.jsxs("div",{className:"mb-6 flex items-center gap-3",children:[e.jsx("div",{className:"rounded-lg bg-indigo-100 p-2 text-indigo-700",children:e.jsx(V,{size:24})}),e.jsx("h2",{className:"text-2xl font-bold text-slate-800",children:"Problem Set"})]}),e.jsx("div",{className:"space-y-6",children:_.map((s,a)=>e.jsx(de,{index:a,isExpanded:t===s.id,onToggle:()=>f(s.id),problem:s,progress:p[s.id]||{},onUpdate:(x,r)=>N(s.id,x,r)},s.id))})]}),e.jsxs("section",{className:"overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",children:[e.jsxs("div",{className:"bg-slate-900 p-8 text-white",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-3 text-indigo-400",children:[e.jsx(F,{size:24}),e.jsx("span",{className:"text-sm font-bold uppercase tracking-wider",children:"Strategy Guide"})]}),e.jsx("h2",{className:"text-2xl font-bold",children:"Pattern Summary"}),e.jsx("p",{className:"mt-2 text-slate-400",children:"When to use which data structure or pattern."})]}),e.jsxs("div",{className:"grid gap-6 p-8 md:grid-cols-2 lg:grid-cols-3",children:[e.jsx(k,{title:"HashMap / Dictionary",icon:e.jsx(Y,{size:18}),trigger:"Use for frequencies, grouping by key, and O(1) complement lookups."}),e.jsx(k,{title:"HashSet",icon:e.jsx(E,{size:18}),trigger:"Use for uniqueness checks and O(1) existence checks."}),e.jsx(k,{title:"Stack (Monotonic)",icon:e.jsx(J,{size:18}),trigger:"Use for next greater/smaller element style problems."}),e.jsx(k,{title:"Sorting",icon:e.jsx(X,{size:18}),trigger:"Use to simplify interval merging or two-pointer scans."}),e.jsx(k,{title:"Sliding Window",icon:e.jsx(B,{size:18}),trigger:"Use for contiguous range problems with grow/shrink behavior."}),e.jsx(k,{title:"Prefix Sum",icon:e.jsx(Q,{size:18}),trigger:"Use for subarray sum and count-of-subarray queries."})]})]}),e.jsxs("section",{className:"rounded-3xl border border-slate-200 bg-white p-6 shadow-sm",children:[e.jsxs("div",{className:"mb-6 flex items-center justify-between gap-3",children:[e.jsxs("div",{children:[e.jsx("h2",{className:"text-2xl font-bold text-slate-800",children:"Week 2 Penalty Topics"}),e.jsx("p",{className:"mt-1 text-sm text-slate-500",children:"Google Sheet feed + Docs-backed persistence (Apps Script endpoint optional)."})]}),e.jsx("a",{className:"rounded-lg bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100",href:ie,rel:"noreferrer",target:"_blank",children:"Open Google Sheet"})]}),e.jsxs("div",{className:"grid gap-6 lg:grid-cols-2",children:[e.jsxs("div",{className:"rounded-xl border border-slate-200 p-4",children:[e.jsx("h3",{className:"mb-3 text-sm font-bold uppercase tracking-wide text-slate-600",children:"Sheet Topics"}),h?e.jsx("p",{className:"text-sm text-slate-500",children:"Loading topics from sheet..."}):g?e.jsx("p",{className:"text-sm text-rose-600",children:g}):o.length===0?e.jsx("p",{className:"text-sm text-slate-500",children:"No Week 2 topics were parsed from this sheet tab."}):e.jsx("ul",{className:"max-h-[26rem] space-y-2 overflow-auto pr-1",children:o.map(s=>e.jsx("li",{children:e.jsxs("button",{className:"w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition-colors hover:border-indigo-200 hover:bg-indigo-50",onClick:()=>c(s),type:"button",children:[e.jsx("div",{className:"text-sm font-semibold text-slate-800",children:s.title}),e.jsx("p",{className:"mt-1 line-clamp-2 text-xs text-slate-500",children:s.content})]})},s.id))})]}),e.jsx(me,{selectedSheetTopic:i})]})]}),e.jsx("div",{className:"py-10 text-center opacity-60",children:e.jsx("p",{className:"text-lg italic text-slate-600",children:'"Consistency builds mastery. Mastery builds confidence."'})})]})]})},k=({title:t,icon:l,trigger:i})=>e.jsxs("div",{className:"rounded-xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-indigo-200",children:[e.jsxs("div",{className:"mb-3 flex items-center gap-2 font-bold text-slate-800",children:[e.jsx("span",{className:"rounded-lg bg-white p-2 text-indigo-600 shadow-sm",children:l}),t]}),e.jsxs("div",{className:"text-sm leading-relaxed text-slate-600",children:[e.jsx("strong",{className:"mb-1 block text-xs uppercase tracking-wide text-indigo-600",children:"When to Use:"}),i]})]}),de=({problem:t,index:l,isExpanded:i,onToggle:c,progress:o,onUpdate:u})=>{const[h,v]=m.useState(!1),[g,j]=m.useState(""),p=()=>{const n=g.trim(),d=n?n.split(/\s+/).length:0;if(d>=100){v(!0);return}alert(`Please write a little more reflection before unlocking. (${d}/100 words)`)};return e.jsxs("div",{className:`rounded-2xl border bg-white transition-all duration-300 ${i?"border-indigo-200 shadow-lg ring-1 ring-indigo-50":"border-slate-200 shadow-sm hover:border-indigo-200"}`,children:[e.jsx("div",{className:"cursor-pointer p-6",onClick:c,children:e.jsxs("div",{className:"flex items-center justify-between gap-3",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${o.status==="Done"?"bg-emerald-100 text-emerald-600":o.status==="Revision"?"bg-amber-100 text-amber-600":"bg-slate-100 text-slate-500"}`,children:o.status==="Done"?e.jsx(P,{size:16}):l+1}),e.jsxs("div",{children:[e.jsxs("h3",{className:"flex items-center gap-2 text-lg font-bold text-slate-800",children:[t.name,e.jsx("a",{className:"text-indigo-500 opacity-40 transition-opacity hover:opacity-100",href:t.link,onClick:n=>n.stopPropagation(),rel:"noreferrer",target:"_blank",children:e.jsx(ee,{size:16})})]}),e.jsxs("div",{className:"mt-1 flex items-center gap-3 text-xs",children:[e.jsx("span",{className:`rounded px-2 py-0.5 font-bold ${t.difficulty==="Easy"?"bg-emerald-50 text-emerald-700":t.difficulty==="Medium"?"bg-amber-50 text-amber-700":"bg-rose-50 text-rose-700"}`,children:t.difficulty}),e.jsx("span",{className:"text-slate-400",children:"-"}),e.jsx("span",{className:"font-medium text-slate-500",children:t.concept})]})]})]}),e.jsx("div",{className:`rounded-full p-2 transition-transform duration-300 ${i?"rotate-180 bg-indigo-50 text-indigo-600":"text-slate-400"}`,children:e.jsx(te,{size:20})})]})}),i&&e.jsx("div",{className:"animate-in slide-in-from-top-2 px-6 pb-6 duration-300",children:e.jsxs("div",{className:"grid gap-8 border-t border-slate-100 pt-4 md:grid-cols-2",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"mb-2 text-xs font-bold uppercase tracking-widest text-slate-400",children:"Context"}),e.jsxs("div",{className:"space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4",children:[e.jsxs("p",{className:"text-sm leading-relaxed text-slate-600",children:[e.jsx("strong",{className:"text-slate-800",children:"Why Important:"})," ",t.why]}),e.jsxs("div",{className:"flex gap-4 border-t border-slate-200 pt-2 font-mono text-xs",children:[e.jsxs("span",{className:"flex items-center gap-1 text-emerald-700",children:[e.jsx(se,{size:12})," ",t.time]}),e.jsxs("span",{className:"flex items-center gap-1 text-indigo-700",children:[e.jsx(P,{size:12})," ",t.space]})]})]})]}),e.jsxs("div",{className:"rounded-lg border border-amber-100 bg-amber-50 p-4",children:[e.jsxs("h4",{className:"mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600",children:[e.jsx(q,{size:12})," Hint"]}),e.jsxs("p",{className:"text-sm italic text-slate-700",children:['"',t.hint,'"']})]}),e.jsx("div",{className:"overflow-hidden rounded-xl border border-slate-200 bg-white",children:e.jsxs("table",{className:"w-full text-left text-xs",children:[e.jsx("thead",{className:"bg-slate-50 font-bold uppercase text-slate-500",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3",children:"Status"}),e.jsx("th",{className:"p-3",children:"Time"}),e.jsx("th",{className:"p-3",children:"DS Used"}),e.jsx("th",{className:"p-3",children:"Diff (1-5)"})]})}),e.jsxs("tbody",{className:"divide-y divide-slate-100",children:[e.jsxs("tr",{children:[e.jsx("td",{className:"p-2",children:e.jsxs("select",{className:`w-full bg-transparent font-medium outline-none ${o.status==="Done"?"text-emerald-600":o.status==="Revision"?"text-amber-600":"text-slate-600"}`,onChange:n=>u("status",n.target.value),value:o.status||"Pending",children:[e.jsx("option",{value:"Pending",children:"Pending"}),e.jsx("option",{value:"Done",children:"Done"}),e.jsx("option",{value:"Revision",children:"Revision"}),e.jsx("option",{value:"Not Understood",children:"Not Understood"})]})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{className:"w-full bg-transparent outline-none",onChange:n=>u("time",n.target.value),placeholder:"-- min",type:"text",value:o.time||""})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{className:"w-full bg-transparent outline-none",onChange:n=>u("ds",n.target.value),placeholder:"vector...",type:"text",value:o.ds||""})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{className:"w-full bg-transparent outline-none",max:"5",min:"1",onChange:n=>u("difficultyRating",n.target.value),placeholder:"-",type:"number",value:o.difficultyRating||""})})]}),e.jsx("tr",{children:e.jsx("td",{className:"bg-slate-50/50 p-2",colSpan:4,children:e.jsx("input",{className:"w-full bg-transparent italic text-slate-500 outline-none",onChange:n=>u("comments",n.target.value),placeholder:"Comments...",type:"text",value:o.comments||""})})})]})]})})]}),e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-2 flex items-end justify-between",children:[e.jsx("h4",{className:"text-xs font-bold uppercase tracking-widest text-slate-400",children:"Optimal Solution"}),e.jsx("span",{className:"rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500",children:t.structure})]}),e.jsx("div",{className:"relative flex-grow overflow-hidden rounded-xl border border-slate-200 bg-slate-900",children:h?e.jsx(H,{className:"h-full overflow-x-auto p-4 font-mono text-xs leading-relaxed text-indigo-100",children:t.code}):e.jsxs("div",{className:"absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-6 text-center",children:[e.jsx("div",{className:"mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600",children:e.jsx(Z,{size:24})}),e.jsx("h3",{className:"mb-2 font-bold text-slate-800",children:"Solution Locked"}),e.jsx("p",{className:"mb-4 max-w-xs text-xs leading-relaxed text-slate-500",children:"Write a 100-word reflection about your approach before unlocking the solution."}),e.jsx("textarea",{className:"mb-3 h-32 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-indigo-500",onChange:n=>j(n.target.value),placeholder:"I started with nested loops, then tried a map for faster lookups...",value:g}),e.jsxs("div",{className:"flex w-full items-center justify-between",children:[e.jsxs("span",{className:`text-[10px] font-bold ${g.trim().split(/\s+/).filter(Boolean).length>=100?"text-emerald-500":"text-slate-400"}`,children:[g.trim().split(/\s+/).filter(Boolean).length," / 100 words"]}),e.jsxs("button",{className:"flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700",onClick:p,type:"button",children:[e.jsx(K,{size:12})," Unlock"]})]})]})})]})]})})]})},me=({selectedSheetTopic:t})=>{const[l,i]=m.useState("Custom Penalty Topic"),[c,o]=m.useState(""),[u,h]=m.useState(!1),[v,g]=m.useState([]),[j,p]=m.useState(!1),[n,d]=m.useState(null),[f,N]=m.useState(L?"Google Docs backend sync is enabled.":"Apps Script URL not set. Saves will stay local in this browser.");m.useEffect(()=>{t&&(i(t.title||"Loaded Sheet Topic"),o(t.content||""))},[t]),m.useEffect(()=>{(async()=>{p(!0),d(null);try{g(oe())}catch{d("Unable to load local saved penalty topics.")}finally{p(!1)}})()},[]);const s=async()=>{if(!c.trim()){alert("Please add content before saving.");return}h(!0),d(null);try{const a={id:Date.now(),title:l.trim()||"Untitled Penalty Topic",content:c.trim(),source:t?t.source||"week2-sheet":"day5-ui",createdAt:new Date().toISOString()};let x=!1;L&&(await le(a),x=!0);const r={...a,synced:x};g(b=>{const y=[r,...b];return D(y),y}),N(x?"Saved and synced to Google Docs backend.":"Saved locally. Add `VITE_GOOGLE_APPS_SCRIPT_URL` to sync to Google Docs backend."),o("")}catch{const x={id:Date.now(),title:l.trim()||"Untitled Penalty Topic",content:c.trim(),source:t?t.source||"week2-sheet":"day5-ui",createdAt:new Date().toISOString(),synced:!1};g(r=>{const b=[x,...r];return D(b),b}),d("Saved locally, but Google Docs backend sync failed."),N("Check Apps Script web app URL/deployment and CORS settings."),o("")}finally{h(!1)}};return e.jsxs("div",{className:"rounded-xl border border-slate-200 bg-slate-50 p-4",children:[e.jsx("h3",{className:"mb-3 text-sm font-bold uppercase tracking-wide text-slate-600",children:"Save Topic"}),e.jsx("p",{className:"mb-2 text-[11px] text-slate-500",children:f}),e.jsx("input",{className:"mb-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500",onChange:a=>i(a.target.value),placeholder:"Topic title",type:"text",value:l}),e.jsx("textarea",{className:"mb-3 h-36 w-full rounded-lg border border-slate-200 bg-white p-3 font-mono text-xs outline-none focus:border-indigo-500",onChange:a=>o(a.target.value),placeholder:"Paste notes or sheet topic details...",value:c}),e.jsx("div",{className:"mb-4 flex items-center gap-2",children:e.jsxs("button",{className:"inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60",disabled:u,onClick:s,type:"button",children:[e.jsx(ae,{size:12})," ",u?"Saving...":"Save Topic"]})}),e.jsx("h4",{className:"mb-2 text-sm font-bold text-slate-700",children:"Saved Topics"}),j?e.jsx("p",{className:"text-xs text-slate-500",children:"Loading saved topics..."}):null,n?e.jsx("p",{className:"mb-2 text-xs text-rose-600",children:n}):null,e.jsx("ul",{className:"max-h-44 space-y-2 overflow-auto",children:v.map(a=>e.jsx("li",{children:e.jsxs("button",{className:"w-full rounded-lg border border-slate-200 bg-white p-2 text-left text-xs transition-colors hover:border-indigo-200 hover:bg-indigo-50",onClick:()=>{i(a.title||"Saved Topic"),o(a.content||"")},type:"button",children:[e.jsx("div",{className:"font-semibold text-slate-800",children:a.title}),e.jsx("div",{className:"line-clamp-2 text-slate-500",children:a.content}),e.jsx("div",{className:"mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400",children:a.synced?"Synced":"Local"})]})},a.id))})]})},_=[{id:1,name:"Intersection of Two Arrays II",link:"https://leetcode.com/problems/intersection-of-two-arrays-ii/",difficulty:"Easy",concept:"HashMap / Two Pointers",structure:"HashMap",why:"Teaches trade-offs between O(N) memory (HashMap) and O(N log N) sorting.",time:"O(N + M)",space:"O(min(N, M))",hint:"Store counts of the smaller array in a map, then decrement while iterating the other array.",code:`vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> counts;
    vector<int> res;

    for (int n : nums1) counts[n]++;

    for (int n : nums2) {
        if (counts[n] > 0) {
            res.push_back(n);
            counts[n]--;
        }
    }
    return res;
}`},{id:2,name:"Remove Duplicates from Sorted Array",link:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/",difficulty:"Easy",concept:"Two Pointers (In-place)",structure:"Array",why:"Fundamental in-place read/write pointer pattern.",time:"O(N)",space:"O(1)",hint:"Use a write pointer `k`, and move it only when you see a new value.",code:`int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int k = 1;
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] != nums[i - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`},{id:3,name:"Best Time to Buy and Sell Stock II",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",difficulty:"Medium",concept:"Greedy",structure:"Array",why:"Builds greedy intuition by summing each local upward slope.",time:"O(N)",space:"O(1)",hint:"Add `prices[i] - prices[i - 1]` whenever it is positive.",code:`int maxProfit(vector<int>& prices) {
    int maxProfit = 0;
    for (int i = 1; i < prices.size(); i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    return maxProfit;
}`},{id:4,name:"Minimum Size Subarray Sum",link:"https://leetcode.com/problems/minimum-size-subarray-sum/",difficulty:"Medium",concept:"Sliding Window (Variable)",structure:"Array",why:"Classic expand-shrink window optimization.",time:"O(N)",space:"O(1)",hint:"Expand right, and once sum >= target, shrink left to minimize length.",code:`int minSubArrayLen(int target, vector<int>& nums) {
    int left = 0, sum = 0, minLen = INT_MAX;

    for (int right = 0; right < nums.size(); right++) {
        sum += nums[right];
        while (sum >= target) {
            minLen = min(minLen, right - left + 1);
            sum -= nums[left];
            left++;
        }
    }
    return minLen == INT_MAX ? 0 : minLen;
}`},{id:5,name:"Next Greater Element I",link:"https://leetcode.com/problems/next-greater-element-i/",difficulty:"Easy",concept:"Monotonic Stack",structure:"Stack + HashMap",why:"Entry point to monotonic stack and next-greater templates.",time:"O(N)",space:"O(N)",hint:"Use a decreasing stack; current value resolves all smaller top values.",code:`vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> nextGreater;
    stack<int> st;

    for (int num : nums2) {
        while (!st.empty() && st.top() < num) {
            nextGreater[st.top()] = num;
            st.pop();
        }
        st.push(num);
    }

    vector<int> res;
    for (int n : nums1) {
        res.push_back(nextGreater.count(n) ? nextGreater[n] : -1);
    }
    return res;
}`},{id:6,name:"Sort Colors",link:"https://leetcode.com/problems/sort-colors/",difficulty:"Medium",concept:"Dutch National Flag",structure:"3 Pointers",why:"Three-way partitioning in a single pass.",time:"O(N)",space:"O(1)",hint:"Track low, mid, high and swap 0s left, 2s right.",code:`void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;

    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++;
            mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`},{id:7,name:"Merge Intervals",link:"https://leetcode.com/problems/merge-intervals/",difficulty:"Medium",concept:"Sorting + Greedy",structure:"Vector<Vector>",why:"Standard interval merge logic after sorting by start.",time:"O(N log N)",space:"O(N)",hint:"If current.start <= last.end, merge using max end; otherwise push a new interval.",code:`vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res;
    res.push_back(intervals[0]);

    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= res.back()[1]) {
            res.back()[1] = max(res.back()[1], intervals[i][1]);
        } else {
            res.push_back(intervals[i]);
        }
    }
    return res;
}`},{id:8,name:"Longest Consecutive Sequence",link:"https://leetcode.com/problems/longest-consecutive-sequence/",difficulty:"Medium",concept:"HashSet",structure:"HashSet",why:"Uses O(1) hash lookups to avoid sorting.",time:"O(N)",space:"O(N)",hint:"Only start counting from numbers where `num - 1` does not exist.",code:`int longestConsecutive(vector<int>& nums) {
    unordered_set<int> s(nums.begin(), nums.end());
    int maxLen = 0;

    for (int num : nums) {
        if (!s.count(num - 1)) {
            int curr = num;
            int len = 1;
            while (s.count(curr + 1)) {
                curr++;
                len++;
            }
            maxLen = max(maxLen, len);
        }
    }
    return maxLen;
}`},{id:9,name:"Subarray Sum Equals K",link:"https://leetcode.com/problems/subarray-sum-equals-k/",difficulty:"Medium",concept:"Prefix Sum + HashMap",structure:"HashMap",why:"Core prefix sum pattern for subarray count queries.",time:"O(N)",space:"O(N)",hint:"If `sum - k` exists in map, add its frequency to answer.",code:`int subarraySum(vector<int>& nums, int k) {
    unordered_map<int, int> prefixMap;
    prefixMap[0] = 1;
    int sum = 0, count = 0;

    for (int num : nums) {
        sum += num;
        if (prefixMap.count(sum - k)) {
            count += prefixMap[sum - k];
        }
        prefixMap[sum]++;
    }
    return count;
}`},{id:10,name:"Group Anagrams",link:"https://leetcode.com/problems/group-anagrams/",difficulty:"Medium",concept:"HashMap (String Key)",structure:"HashMap",why:"Uses normalized keys to group related data efficiently.",time:"O(N * K log K)",space:"O(N * K)",hint:"Sort each word and use the sorted string as the hash key.",code:`vector<vector<string>> groupAnagrams(vector<string>& strs) {
    unordered_map<string, vector<string>> mp;

    for (string s : strs) {
        string key = s;
        sort(key.begin(), key.end());
        mp[key].push_back(s);
    }

    vector<vector<string>> res;
    for (auto& p : mp) {
        res.push_back(p.second);
    }
    return res;
}`}];export{Te as default};
