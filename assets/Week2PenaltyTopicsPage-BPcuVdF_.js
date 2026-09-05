import{r as x,j as e}from"./index-Dfa4Lwsv.js";import{S as U}from"./StudyCodeBlock-gnjq8rh7.js";import{C as G}from"./code-N7XaqLL8.js";import{A as B}from"./activity-CAzWaK8R.js";import{B as $}from"./brain-ILVjv6PI.js";import{H as q}from"./hash-ipQhCOwe.js";import{C as K,M as J,a as W,L as Y}from"./maximize-D0ibHr9T.js";import{L as F}from"./layers-BoPtmg3U.js";import{A as V}from"./arrow-right-IM7qxqA7.js";import{T as X,L as Q}from"./trending-up-C-20TkpY.js";import{C as D}from"./circle-check-big-BNzMe08Z.js";import{B as Z}from"./book-open-CSs33TCn.js";import{C as ee}from"./chevron-down-CFEiyoQP.js";import{C as te}from"./clock-COyGAts0.js";const O="week2_penalty_topics_dsa_strength_progress",C="dsa_strength_plan_data",h="https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec".trim(),R="week2_penalty_topics_cache_to_docs_migrated_v1",z="1K0Hs23qhII18wDNUFylDuTzhdkV25YAZbRXNSLGunQo",T="1103660116",g=s=>{const t=String(s||"").trim().toLowerCase();return t?t==="done"||t==="completed"||t==="complete"?"Done":t==="revision"||t==="revise"||t==="review"?"Revision":t==="not understood"||t==="not_understood"?"Not Understood":t==="pending"?"Pending":s:"Pending"},j=s=>{if(!s)return{};if(typeof s=="string")return{status:g(s)};if(typeof s=="object"){const t={...s};return t.status?t.status=g(t.status):t.completed===!0?t.status="Done":t.revision===!0&&(t.status="Revision"),t}return{}},A=s=>s?Array.isArray(s)?s.reduce((t,n,r)=>{const a=String((n==null?void 0:n.id)??r+1);return t[a]=j(n),t},{}):typeof s=="object"?Object.entries(s).reduce((t,[n,r])=>(t[n]=j(r),t),{}):{}:{},N=s=>{const t={};return Object.keys(s||{}).sort((n,r)=>Number(n)-Number(r)).forEach(n=>{const r=j(s[n]);if(!r||typeof r!="object")return;const u={status:g(r.status||"Pending"),time:r.time||"",ds:r.ds||"",difficultyRating:r.difficultyRating||"",comments:r.comments||""};t[n]=u}),t},se=s=>Object.values(s||{}).some(t=>{const n=j(t);return!!(g(n.status||"Pending")!=="Pending"||n.time||n.ds||n.difficultyRating||n.comments)}),ne=()=>typeof window>"u"?!1:localStorage.getItem(R)==="1",re=()=>{typeof window>"u"||localStorage.setItem(R,"1")},ie=async s=>{const t=await s.text();if(!t)return{};try{return JSON.parse(t)}catch{return{}}},ae=async()=>{if(!h)return{};const s=new URLSearchParams({action:"getDsaStrengthProgress",sheetId:z,gid:T}),t=h.includes("?")?"&":"?",n=await fetch(`${h}${t}${s.toString()}`,{method:"GET"});if(!n.ok)throw new Error(`Docs GET failed: ${n.status}`);const r=await ie(n),a=(r==null?void 0:r.progress)||(r==null?void 0:r.items)||(r==null?void 0:r.data)||r;return A(a)},E=async(s,t)=>{if(!h)return;const n=await fetch(h,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"upsertDsaStrengthProgress",sheetId:z,gid:T,reason:t,progress:N(s)})});if(!n.ok)throw new Error(`Docs POST failed: ${n.status}`)},v=s=>{if(typeof window>"u")return{};try{const t=localStorage.getItem(s),n=t?JSON.parse(t):{};return A(n)}catch{return{}}},M=(s,t)=>{const n={};return new Set([...Object.keys(t||{}),...Object.keys(s||{})]).forEach(a=>{const u=j((t==null?void 0:t[a])||{}),p=j((s==null?void 0:s[a])||{}),c={...u,...p};c.status&&(c.status=g(c.status)),n[a]=c}),n},we=()=>{const[s,t]=x.useState(null),[n,r]=x.useState(h?"syncing...":"local only"),[a,u]=x.useState(!h),p=x.useRef(""),[c,f]=x.useState(()=>{if(typeof window<"u")try{const i=v(O),d=v(C);return M(i,d)}catch(i){return console.error("Failed to load progress:",i),{}}return{}});x.useEffect(()=>{localStorage.setItem(O,JSON.stringify(c)),localStorage.setItem(C,JSON.stringify(c))},[c]),x.useEffect(()=>{let i=!1;return(async()=>{if(h)try{r("syncing...");const l=await ae();if(i)return;const y=v(O),m=v(C),_=M(y,m),k=M(_,l),H=JSON.stringify(N(l)),P=JSON.stringify(N(k)),L=se(_)&&(!ne()||H!==P);f(k),L?(await E(k,"cache-migration"),i||(re(),r("migrated from cache + synced"),p.current=P)):(r("synced"),p.current=P)}catch(l){i||(console.error("[Week2PenaltyTopicsPage] Docs sync hydrate failed:",l),r("docs sync failed, using local"))}finally{i||u(!0)}})(),()=>{i=!0}},[]),x.useEffect(()=>{if(!h||!a)return;const i=JSON.stringify(N(c));if(i===p.current)return;const d=setTimeout(async()=>{try{await E(c,"autosave"),p.current=i,r("synced")}catch(l){console.error("[Week2PenaltyTopicsPage] Docs autosave failed:",l),r("docs sync failed, using local")}},700);return()=>clearTimeout(d)},[c,a]);const w=i=>{t(s===i?null:i)},S=(i,d,l)=>{const y=d==="status"?g(l):l;f(m=>({...m,[i]:{...m[i],[d]:y}}))},o=x.useMemo(()=>{const i=Object.values(c),d=i.filter(m=>g(m==null?void 0:m.status)==="Done").length,l=i.filter(m=>g(m==null?void 0:m.status)==="Revision").length,y=I.length-d-l;return{done:d,revision:l,pending:y}},[c]);return e.jsxs("div",{className:"min-h-screen bg-slate-50 pb-20 font-sans text-slate-800",children:[e.jsx("div",{className:"bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xl",children:e.jsxs("div",{className:"mx-auto max-w-5xl px-6 py-10",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-3 opacity-90",children:[e.jsx(G,{size:20}),e.jsx("span",{className:"text-sm font-bold uppercase tracking-widest",children:"Interview Prep"})]}),e.jsx("h1",{className:"mb-4 text-3xl font-bold md:text-4xl",children:"Aishwarya - Structured DSA Strength Plan"}),e.jsx("p",{className:"max-w-2xl text-lg text-indigo-100",children:"A curated roadmap from foundational arrays to complex hash maps. Increasing difficulty order."})]})}),e.jsxs("main",{className:"mx-auto max-w-5xl space-y-16 px-6 py-10",children:[e.jsxs("section",{className:"rounded-xl border border-slate-200 bg-white p-4 shadow-sm",children:[e.jsxs("div",{className:"flex flex-wrap gap-2 text-xs font-semibold",children:[e.jsxs("span",{className:"rounded-full bg-emerald-100 px-3 py-1 text-emerald-700",children:[o.done," Done"]}),e.jsxs("span",{className:"rounded-full bg-amber-100 px-3 py-1 text-amber-700",children:[o.revision," Revision"]}),e.jsxs("span",{className:"rounded-full bg-slate-100 px-3 py-1 text-slate-600",children:[o.pending," Pending"]})]}),e.jsxs("p",{className:"mt-2 text-[11px] text-slate-500",children:["Progress Sync: ",n]})]}),e.jsxs("section",{children:[e.jsxs("div",{className:"mb-6 flex items-center gap-3",children:[e.jsx("div",{className:"rounded-lg bg-indigo-100 p-2 text-indigo-700",children:e.jsx(B,{size:24})}),e.jsx("h2",{className:"text-2xl font-bold text-slate-800",children:"Problem Set"})]}),e.jsx("div",{className:"space-y-6",children:I.map((i,d)=>e.jsx(oe,{index:d,isExpanded:s===i.id,onToggle:()=>w(i.id),problem:i,progress:c[i.id]||{},onUpdate:(l,y)=>S(i.id,l,y)},i.id))})]}),e.jsxs("section",{className:"overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm",children:[e.jsxs("div",{className:"bg-slate-900 p-8 text-white",children:[e.jsxs("div",{className:"mb-2 flex items-center gap-3 text-indigo-400",children:[e.jsx($,{size:24}),e.jsx("span",{className:"text-sm font-bold uppercase tracking-wider",children:"Strategy Guide"})]}),e.jsx("h2",{className:"text-2xl font-bold",children:"Pattern Summary"}),e.jsx("p",{className:"mt-2 text-slate-400",children:"When to use what data structure."})]}),e.jsxs("div",{className:"grid gap-6 p-8 md:grid-cols-2 lg:grid-cols-3",children:[e.jsx(b,{title:"HashMap / Dictionary",icon:e.jsx(q,{size:18}),trigger:"Use for frequency counting, grouping by key, and O(1) complement lookups."}),e.jsx(b,{title:"HashSet",icon:e.jsx(K,{size:18}),trigger:"Use for uniqueness and O(1) existence checks."}),e.jsx(b,{title:"Stack (Monotonic)",icon:e.jsx(F,{size:18}),trigger:"Use for next greater/next smaller style pattern problems."}),e.jsx(b,{title:"Sorting",icon:e.jsx(V,{size:18}),trigger:"Useful for interval merging and simplifying two-pointer logic."}),e.jsx(b,{title:"Sliding Window",icon:e.jsx(J,{size:18}),trigger:"Use for contiguous subarray/substring problems with grow-shrink ranges."}),e.jsx(b,{title:"Prefix Sum",icon:e.jsx(X,{size:18}),trigger:"Use for subarray sum queries and counting subarrays with sum K."})]})]}),e.jsx("div",{className:"py-10 text-center opacity-60",children:e.jsx("p",{className:"text-lg font-serif italic text-slate-600",children:'"Consistency builds mastery. Mastery builds confidence."'})})]})]})},b=({title:s,icon:t,trigger:n})=>e.jsxs("div",{className:"rounded-xl border border-slate-100 bg-slate-50 p-5 transition-colors hover:border-indigo-200",children:[e.jsxs("div",{className:"mb-3 flex items-center gap-2 font-bold text-slate-800",children:[e.jsx("span",{className:"rounded-lg bg-white p-2 text-indigo-600 shadow-sm",children:t}),s]}),e.jsxs("div",{className:"text-sm leading-relaxed text-slate-600",children:[e.jsx("strong",{className:"mb-1 block text-xs uppercase tracking-wide text-indigo-600",children:"When to Use:"}),n]})]}),oe=({problem:s,index:t,isExpanded:n,onToggle:r,progress:a,onUpdate:u})=>{const[p,c]=x.useState(!1),[f,w]=x.useState(""),S=()=>{const o=f.trim(),i=o?o.split(/\s+/).length:0;i>30?c(!0):alert(`Please write more about your thought process. (~${i}/100 words)`)};return e.jsxs("div",{className:`rounded-2xl border bg-white transition-all duration-300 ${n?"border-indigo-200 shadow-lg ring-1 ring-indigo-50":"border-slate-200 shadow-sm hover:border-indigo-200"}`,children:[e.jsx("div",{className:"cursor-pointer p-6",onClick:r,children:e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsxs("div",{className:"flex items-center gap-4",children:[e.jsx("div",{className:`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${a.status==="Done"?"bg-emerald-100 text-emerald-600":a.status==="Revision"?"bg-amber-100 text-amber-600":"bg-slate-100 text-slate-500"}`,children:a.status==="Done"?e.jsx(D,{size:16}):t+1}),e.jsxs("div",{children:[e.jsxs("h3",{className:"flex items-center gap-2 text-lg font-bold text-slate-800",children:[s.name,e.jsx("a",{href:s.link,target:"_blank",rel:"noreferrer",onClick:o=>o.stopPropagation(),className:"text-indigo-500 opacity-40 transition-opacity hover:opacity-100",children:e.jsx(Z,{size:16})})]}),e.jsxs("div",{className:"mt-1 flex items-center gap-3 text-xs",children:[e.jsx("span",{className:`rounded px-2 py-0.5 font-bold ${s.difficulty==="Easy"?"bg-emerald-50 text-emerald-700":s.difficulty==="Medium"?"bg-amber-50 text-amber-700":"bg-rose-50 text-rose-700"}`,children:s.difficulty}),e.jsx("span",{className:"text-slate-400",children:"-"}),e.jsx("span",{className:"font-medium text-slate-500",children:s.concept})]})]})]}),e.jsx("div",{className:`rounded-full p-2 transition-transform duration-300 ${n?"rotate-180 bg-indigo-50 text-indigo-600":"text-slate-400"}`,children:e.jsx(ee,{size:20})})]})}),n&&e.jsx("div",{className:"animate-in fade-in slide-in-from-top-2 px-6 pb-6 duration-300",children:e.jsxs("div",{className:"grid gap-8 border-t border-slate-100 pt-4 md:grid-cols-2",children:[e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"mb-2 text-xs font-bold uppercase tracking-widest text-slate-400",children:"Context"}),e.jsxs("div",{className:"space-y-3 rounded-lg border border-slate-100 bg-slate-50 p-4",children:[e.jsxs("p",{className:"text-sm leading-relaxed text-slate-600",children:[e.jsx("strong",{className:"text-slate-800",children:"Why Important:"})," ",s.why]}),e.jsxs("div",{className:"flex gap-4 border-t border-slate-200 pt-2 font-mono text-xs",children:[e.jsxs("span",{className:"flex items-center gap-1 text-emerald-700",children:[e.jsx(te,{size:12})," ",s.time]}),e.jsxs("span",{className:"flex items-center gap-1 text-indigo-700",children:[e.jsx(D,{size:12})," ",s.space]})]})]})]}),e.jsxs("div",{className:"rounded-lg border border-amber-100 bg-amber-50 p-4",children:[e.jsxs("h4",{className:"mb-1 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-600",children:[e.jsx(W,{size:12})," Hint"]}),e.jsxs("p",{className:"text-sm italic text-slate-700",children:['"',s.hint,'"']})]}),e.jsx("div",{className:"overflow-hidden rounded-xl border border-slate-200 bg-white",children:e.jsxs("table",{className:"w-full text-left text-xs",children:[e.jsx("thead",{className:"bg-slate-50 font-bold uppercase text-slate-500",children:e.jsxs("tr",{children:[e.jsx("th",{className:"p-3",children:"Status"}),e.jsx("th",{className:"p-3",children:"Time"}),e.jsx("th",{className:"p-3",children:"DS Used"}),e.jsx("th",{className:"p-3",children:"Diff (1-5)"})]})}),e.jsxs("tbody",{className:"divide-y divide-slate-100",children:[e.jsxs("tr",{children:[e.jsx("td",{className:"p-2",children:e.jsxs("select",{value:a.status||"Pending",onChange:o=>u("status",o.target.value),className:`w-full bg-transparent font-medium outline-none ${a.status==="Done"?"text-emerald-600":a.status==="Revision"?"text-amber-600":"text-slate-600"}`,children:[e.jsx("option",{value:"Pending",children:"Pending"}),e.jsx("option",{value:"Done",children:"Done"}),e.jsx("option",{value:"Revision",children:"Revision"}),e.jsx("option",{value:"Not Understood",children:"Not Understood"})]})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"text",placeholder:"-- min",value:a.time||"",onChange:o=>u("time",o.target.value),className:"w-full bg-transparent outline-none"})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"text",placeholder:"vector...",value:a.ds||"",onChange:o=>u("ds",o.target.value),className:"w-full bg-transparent outline-none"})}),e.jsx("td",{className:"p-2",children:e.jsx("input",{type:"number",min:"1",max:"5",placeholder:"-",value:a.difficultyRating||"",onChange:o=>u("difficultyRating",o.target.value),className:"w-full bg-transparent outline-none"})})]}),e.jsx("tr",{children:e.jsx("td",{colSpan:4,className:"bg-slate-50/50 p-2",children:e.jsx("input",{type:"text",placeholder:"Comments...",value:a.comments||"",onChange:o=>u("comments",o.target.value),className:"w-full bg-transparent italic text-slate-500 outline-none"})})})]})]})})]}),e.jsxs("div",{className:"flex h-full flex-col",children:[e.jsxs("div",{className:"mb-2 flex items-end justify-between",children:[e.jsx("h4",{className:"text-xs font-bold uppercase tracking-widest text-slate-400",children:"Optimal Solution"}),e.jsx("span",{className:"rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500",children:s.structure})]}),e.jsx("div",{className:"group relative flex-grow overflow-hidden rounded-xl border border-slate-200 bg-slate-900",children:p?e.jsx(U,{className:"h-full overflow-x-auto p-4 font-mono text-xs leading-relaxed text-indigo-100",children:s.code}):e.jsxs("div",{className:"absolute inset-0 z-10 flex flex-col items-center justify-center bg-slate-50 p-6 text-center",children:[e.jsx("div",{className:"mb-3 rounded-full bg-indigo-100 p-3 text-indigo-600",children:e.jsx(Q,{size:24})}),e.jsx("h3",{className:"mb-2 font-bold text-slate-800",children:"Solution Locked"}),e.jsx("p",{className:"mb-4 max-w-xs text-xs leading-relaxed text-slate-500",children:"To unlock the solution, please write a 100-word reflection on your approach."}),e.jsx("textarea",{value:f,onChange:o=>w(o.target.value),placeholder:"I tried using a nested loop, then moved to a hash map...",className:"mb-3 h-32 w-full resize-none rounded-lg border border-slate-200 bg-white p-3 text-xs outline-none focus:border-indigo-500"}),e.jsxs("div",{className:"flex w-full items-center justify-between",children:[e.jsxs("span",{className:`text-[10px] font-bold ${f.trim().split(/\s+/).filter(Boolean).length>30?"text-emerald-500":"text-slate-400"}`,children:[f.trim().split(/\s+/).filter(Boolean).length," / 100 words"]}),e.jsxs("button",{onClick:S,className:"flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-700",children:[e.jsx(Y,{size:12})," Unlock"]})]})]})})]})]})})]})},I=[{id:1,name:"Intersection of Two Arrays II",link:"https://leetcode.com/problems/intersection-of-two-arrays-ii/",difficulty:"Easy",concept:"HashMap / Two Pointers",structure:"HashMap",why:"Teaches you to choose between O(N) memory (HashMap) vs O(N log N) time (Sorting).",time:"O(N + M)",space:"O(min(N, M))",hint:"Store counts of the smaller array in a HashMap and decrement on match.",code:`vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
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
}`},{id:2,name:"Remove Duplicates from Sorted Array",link:"https://leetcode.com/problems/remove-duplicates-from-sorted-array/",difficulty:"Easy",concept:"Two Pointers (In-place)",structure:"Array",why:"Fundamental for in-place manipulation with read/write pointers.",time:"O(N)",space:"O(1)",hint:"Use a write pointer `k` and move it only for new unique elements.",code:`int removeDuplicates(vector<int>& nums) {
    if (nums.empty()) return 0;
    int k = 1;
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] != nums[i - 1]) {
            nums[k] = nums[i];
            k++;
        }
    }
    return k;
}`},{id:3,name:"Best Time to Buy and Sell Stock II",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/",difficulty:"Medium",concept:"Greedy",structure:"Array",why:"Builds greedy intuition by accumulating all local upward differences.",time:"O(N)",space:"O(1)",hint:"Add positive day-to-day differences.",code:`int maxProfit(vector<int>& prices) {
    int maxProfit = 0;
    for (int i = 1; i < prices.size(); i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    return maxProfit;
}`},{id:4,name:"Minimum Size Subarray Sum",link:"https://leetcode.com/problems/minimum-size-subarray-sum/",difficulty:"Medium",concept:"Sliding Window (Variable)",structure:"Array",why:"Classic expand-shrink pattern for minimum length window.",time:"O(N)",space:"O(1)",hint:"Expand right, shrink left while condition is satisfied.",code:`int minSubArrayLen(int target, vector<int>& nums) {
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
}`},{id:5,name:"Next Greater Element I",link:"https://leetcode.com/problems/next-greater-element-i/",difficulty:"Easy",concept:"Monotonic Stack",structure:"Stack + HashMap",why:"The entry point to monotonic stacks for next-greater patterns.",time:"O(N)",space:"O(N)",hint:"Use a decreasing stack; current number resolves smaller elements on stack top.",code:`vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
    unordered_map<int, int> nextGreater;
    stack<int> s;

    for (int num : nums2) {
        while (!s.empty() && s.top() < num) {
            nextGreater[s.top()] = num;
            s.pop();
        }
        s.push(num);
    }

    vector<int> res;
    for (int n : nums1) {
        res.push_back(nextGreater.count(n) ? nextGreater[n] : -1);
    }
    return res;
}`},{id:6,name:"Sort Colors",link:"https://leetcode.com/problems/sort-colors/",difficulty:"Medium",concept:"Dutch National Flag",structure:"3 Pointers",why:"Partitions array into three regions in one pass.",time:"O(N)",space:"O(1)",hint:"Track low, mid, high and swap based on current value.",code:`void sortColors(vector<int>& nums) {
    int low = 0, mid = 0, high = nums.size() - 1;
    while (mid <= high) {
        if (nums[mid] == 0) {
            swap(nums[low], nums[mid]);
            low++; mid++;
        } else if (nums[mid] == 1) {
            mid++;
        } else {
            swap(nums[mid], nums[high]);
            high--;
        }
    }
}`},{id:7,name:"Merge Intervals",link:"https://leetcode.com/problems/merge-intervals/",difficulty:"Medium",concept:"Sorting + Greedy",structure:"Vector<Vector>",why:"Sorting by start enables simple one-pass merging.",time:"O(N log N)",space:"O(N)",hint:"Merge if current start <= last merged end.",code:`vector<vector<int>> merge(vector<vector<int>>& intervals) {
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
}`},{id:8,name:"Longest Consecutive Sequence",link:"https://leetcode.com/problems/longest-consecutive-sequence/",difficulty:"Medium",concept:"HashSet",structure:"HashSet",why:"Uses O(1) lookups to solve in linear time.",time:"O(N)",space:"O(N)",hint:"Start sequence only when num - 1 is absent in set.",code:`int longestConsecutive(vector<int>& nums) {
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
}`},{id:9,name:"Subarray Sum Equals K",link:"https://leetcode.com/problems/subarray-sum-equals-k/",difficulty:"Medium",concept:"Prefix Sum + HashMap",structure:"HashMap",why:"Core template for counting subarrays with target sum.",time:"O(N)",space:"O(N)",hint:"If sum - k exists in map, add its frequency to answer.",code:`int subarraySum(vector<int>& nums, int k) {
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
}`},{id:10,name:"Group Anagrams",link:"https://leetcode.com/problems/group-anagrams/",difficulty:"Medium",concept:"HashMap (String Key)",structure:"HashMap",why:"Shows grouping using normalized keys.",time:"O(N * K log K)",space:"O(N * K)",hint:"Sort each word and use sorted word as map key.",code:`vector<vector<string>> groupAnagrams(vector<string>& strs) {
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
}`}];export{we as default};
