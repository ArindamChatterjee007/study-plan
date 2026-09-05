import{c,r as h,j as e}from"./index-Dfa4Lwsv.js";import{S as j}from"./StudyCodeBlock-gnjq8rh7.js";import{M as w}from"./mic-BSrvTI-b.js";import{C as N}from"./circle-check-big-BNzMe08Z.js";import{C as y}from"./chevron-down-CFEiyoQP.js";import{B as k}from"./brain-ILVjv6PI.js";import{L as S}from"./link-Be2_uywp.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const I=c("Award",[["path",{d:"m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526",key:"1yiouv"}],["circle",{cx:"12",cy:"8",r:"6",key:"1vp47v"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=c("MessageSquare",[["path",{d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",key:"1lielz"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=c("Video",[["path",{d:"m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5",key:"ftymec"}],["rect",{x:"2",y:"6",width:"14",height:"12",rx:"2",key:"158x01"}]]),P=()=>{const[s,i]=h.useState("oral");return e.jsxs("div",{className:"min-h-screen bg-[#f4fcfc] text-slate-800 font-sans selection:bg-teal-100",children:[e.jsx("header",{className:"bg-white border-b border-slate-200 sticky top-0 z-50",children:e.jsxs("div",{className:"max-w-4xl mx-auto px-6 py-4 flex justify-between items-center",children:[e.jsxs("div",{className:"flex items-center space-x-3",children:[e.jsx("div",{className:"bg-teal-600 p-2 rounded-xl text-white shadow-lg shadow-teal-200",children:e.jsx(w,{size:24})}),e.jsxs("div",{children:[e.jsx("h1",{className:"text-xl font-bold text-slate-900 tracking-tight",children:"Day 7: Interview Simulation"}),e.jsx("p",{className:"text-[10px] text-slate-400 font-bold tracking-[0.2em] uppercase",children:"Interview Sprint • Sunday 2/9/2026"})]})]}),e.jsx("nav",{className:"flex space-x-1 bg-slate-100 p-1 rounded-xl",children:["oral","weak_spots","checklist"].map(t=>e.jsx("button",{onClick:()=>i(t),className:`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${s===t?"bg-white text-teal-700 shadow-sm":"text-slate-500 hover:text-slate-700"}`,children:t.charAt(0).toUpperCase()+t.slice(1).replace("_"," ")},t))})]})}),e.jsxs("main",{className:"max-w-4xl mx-auto px-6 py-10 space-y-12",children:[e.jsx("section",{className:s==="oral"?"block animate-in fade-in slide-in-from-bottom-4 duration-500":"hidden",children:e.jsx("div",{className:"space-y-8",children:e.jsxs("div",{className:"bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden",children:[e.jsxs("div",{className:"bg-gradient-to-r from-teal-900 to-slate-900 px-8 py-6 border-b border-slate-800 text-white",children:[e.jsxs("h2",{className:"text-lg font-bold flex items-center gap-2",children:[e.jsx(C,{size:20,className:"text-teal-400"}),' The "Think Out Loud" Protocol']}),e.jsx("p",{className:"text-sm text-teal-200 mt-1 opacity-80",children:"Silence is your enemy. Here is how to structure your 45 minutes."})]}),e.jsxs("div",{className:"p-8 grid md:grid-cols-2 gap-6",children:[e.jsxs("div",{className:"space-y-4",children:[e.jsx(d,{num:"1",title:"Restate & Clarify",time:"2 min",text:"Don't start coding! Repeat the question back. Ask about constraints: 'Can the array be empty?', 'Are numbers negative?', 'Does it fit in memory?'"}),e.jsx(d,{num:"2",title:"Example Walkthrough",time:"3 min",text:"Draw a sample input/output. Walk through the logic MANUALLY. 'If I have [1,2], my pointer goes here...'"}),e.jsx(d,{num:"3",title:"Propose Solution",time:"5 min",text:"Describe the algorithm (e.g., 'I'll use a sliding window'). Mention Time/Space complexity BEFORE coding. Ask: 'Does this sound good?'"})]}),e.jsxs("div",{className:"bg-teal-50 rounded-2xl p-6 border border-teal-100 flex flex-col justify-center",children:[e.jsxs("h3",{className:"font-bold text-teal-900 mb-4 flex items-center gap-2",children:[e.jsx(L,{size:18})," Practice Prompt"]}),e.jsx("div",{className:"bg-white p-4 rounded-xl border border-teal-200 shadow-sm mb-4",children:e.jsx("p",{className:"text-sm text-slate-600 italic",children:`"Pretend I am the interviewer. Explain how you would find the 'Middle of a Linked List' in one pass."`})}),e.jsxs("div",{className:"text-xs text-slate-500 leading-relaxed",children:[e.jsx("strong",{children:"Key phrase to use:"})," ",e.jsx("br",{}),`"I would use the Tortoise and Hare approach. I'll have a slow pointer move 1 step and a fast pointer move 2 steps. When fast reaches the end, slow will be at the middle."`]})]})]})]})})}),e.jsx("section",{className:s==="weak_spots"?"block animate-in fade-in slide-in-from-bottom-4 duration-500":"hidden",children:e.jsxs("div",{className:"space-y-6",children:[e.jsxs("div",{className:"flex items-center justify-between",children:[e.jsx("h2",{className:"text-lg font-bold text-slate-800",children:'5 Classic "Trap" Problems'}),e.jsx("span",{className:"text-xs font-bold text-slate-400 uppercase tracking-widest",children:"High Fail Rate"})]}),e.jsx(r,{title:"1. Trapping Rain Water",difficulty:"Hard",tags:["Two Pointers","Array"],problem:"Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",example:"Input: [0,1,0,2,1,0,1,3,2,1,2,1] | Output: 6",approach:"Min(MaxLeft, MaxRight) - Height",description:"Water at any index `i` is determined by the shortest wall on its left or right. We can precompute these 'max walls' or use two pointers moving inward.",steps:["Init `left=0`, `right=n-1`.","Track `maxLeft` and `maxRight`.","While left < right: Compare height[left] and height[right].","Move the pointer of the SMALLER height. Water = max - current.","Update max if current is taller."],complexity:{time:"O(n)",space:"O(1)"},link:"https://leetcode.com/problems/trapping-rain-water/",code:`int trap(vector<int>& height) {
    int left = 0, right = height.size() - 1;
    int maxLeft = 0, maxRight = 0;
    int res = 0;
    
    while (left < right) {
        if (height[left] <= height[right]) {
            if (height[left] >= maxLeft) maxLeft = height[left];
            else res += maxLeft - height[left];
            left++;
        } else {
            if (height[right] >= maxRight) maxRight = height[right];
            else res += maxRight - height[right];
            right--;
        }
    }
    return res;
}`}),e.jsx(r,{title:"2. Search in Rotated Sorted Array",difficulty:"Medium",tags:["Binary Search","Logic"],problem:"There is an integer array nums sorted in ascending order (with distinct values) that is rotated at an unknown pivot. Given a target, return index or -1.",example:"Input: nums = [4,5,6,7,0,1,2], target = 0 | Output: 4",approach:"Find the Sorted Half",description:"Standard Binary Search breaks. Trick: One half of the array (left or right) is ALWAYS sorted. Check if target is in that sorted half.",steps:["While low <= high: mid = (low+high)/2.","If nums[low] <= nums[mid]: Left side is sorted.","--> Is target in [low, mid]? Yes: high=mid-1. No: low=mid+1.","Else: Right side is sorted.","--> Is target in [mid, high]? Yes: low=mid+1. No: high=mid-1."],complexity:{time:"O(log n)",space:"O(1)"},link:"https://leetcode.com/problems/search-in-rotated-sorted-array/",code:`int search(vector<int>& nums, int target) {
    int low = 0, high = nums.size() - 1;
    while (low <= high) {
        int mid = low + (high - low) / 2;
        if (nums[mid] == target) return mid;
        
        // Check if left half is sorted
        if (nums[low] <= nums[mid]) {
            if (nums[low] <= target && target < nums[mid]) high = mid - 1;
            else low = mid + 1;
        } 
        // Right half is sorted
        else {
            if (nums[mid] < target && target <= nums[high]) low = mid + 1;
            else high = mid - 1;
        }
    }
    return -1;
}`}),e.jsx(r,{title:"3. Merge Intervals",difficulty:"Medium",tags:["Sorting","Array"],problem:"Given an array of intervals, merge all overlapping intervals.",example:"Input: [[1,3],[2,6],[8,10]] | Output: [[1,6],[8,10]]",approach:"Sort by Start Time",description:"Once sorted, overlapping intervals are adjacent. Iterate and check: does the current interval start before the previous one ends?",steps:["Sort intervals by start time.","Push first interval to result.","Iterate from 2nd interval.","If current.start <= result.back().end: Merge (update end to max of both).","Else: Push current to result."],complexity:{time:"O(n log n)",space:"O(n)"},link:"https://leetcode.com/problems/merge-intervals/",code:`vector<vector<int>> merge(vector<vector<int>>& intervals) {
    sort(intervals.begin(), intervals.end());
    vector<vector<int>> res;
    res.push_back(intervals[0]);
    
    for (int i = 1; i < intervals.size(); i++) {
        if (intervals[i][0] <= res.back()[1]) {
            // Overlap: extend the end time
            res.back()[1] = max(res.back()[1], intervals[i][1]);
        } else {
            // No overlap: add new interval
            res.push_back(intervals[i]);
        }
    }
    return res;
}`}),e.jsx(r,{title:"4. 3Sum",difficulty:"Medium",tags:["Two Pointers","Sorting"],problem:"Return all unique triplets [nums[i], nums[j], nums[k]] such that their sum is 0.",example:"Input: [-1,0,1,2,-1,-4] | Output: [[-1,-1,2],[-1,0,1]]",approach:"Fix One, Solve 2Sum",description:"Sort the array. Iterate `i`. For each `i`, use two pointers (`low`, `high`) on the rest of the array to find pairs that sum to `-nums[i]`.",steps:["Sort nums.","Loop i from 0 to n-2. Skip duplicate `i`.","Set low = i+1, high = n-1.","If sum < 0: low++. If sum > 0: high--.","If sum == 0: Add to res. Move low/high. Skip duplicates for low/high."],complexity:{time:"O(n^2)",space:"O(1)"},link:"https://leetcode.com/problems/3sum/",code:`vector<vector<int>> threeSum(vector<int>& nums) {
    sort(nums.begin(), nums.end());
    vector<vector<int>> res;
    for (int i = 0; i < nums.size(); i++) {
        if (i > 0 && nums[i] == nums[i-1]) continue; // Skip duplicate i
        int l = i + 1, r = nums.size() - 1;
        while (l < r) {
            int sum = nums[i] + nums[l] + nums[r];
            if (sum < 0) l++;
            else if (sum > 0) r--;
            else {
                res.push_back({nums[i], nums[l], nums[r]});
                while (l < r && nums[l] == nums[l+1]) l++; // Skip duplicate l
                while (l < r && nums[r] == nums[r-1]) r--; // Skip duplicate r
                l++; r--;
            }
        }
    }
    return res;
}`}),e.jsx(r,{title:"5. Spiral Matrix",difficulty:"Medium",tags:["Matrix","Simulation"],problem:"Given an m x n matrix, return all elements of the matrix in spiral order.",example:"Input: [[1,2,3],[4,5,6],[7,8,9]] | Output: [1,2,3,6,9,8,7,4,5]",approach:"Layer by Layer (Bounds)",description:"Maintain 4 boundaries: top, bottom, left, right. Loop while top <= bottom and left <= right. Move Right -> Down -> Left -> Up. Update bounds after each move.",steps:["Traverse Top Row (left->right), top++.","Traverse Right Col (top->bottom), right--.","Check if bounds valid. Traverse Bottom Row (right->left), bottom--.","Check if bounds valid. Traverse Left Col (bottom->top), left++."],complexity:{time:"O(m*n)",space:"O(1)"},link:"https://leetcode.com/problems/spiral-matrix/",code:`vector<int> spiralOrder(vector<vector<int>>& matrix) {
    int top = 0, bottom = matrix.size() - 1;
    int left = 0, right = matrix[0].size() - 1;
    vector<int> res;
    
    while (top <= bottom && left <= right) {
        for (int i = left; i <= right; i++) res.push_back(matrix[top][i]);
        top++;
        
        for (int i = top; i <= bottom; i++) res.push_back(matrix[i][right]);
        right--;
        
        if (top <= bottom) {
            for (int i = right; i >= left; i--) res.push_back(matrix[bottom][i]);
            bottom--;
        }
        if (left <= right) {
            for (int i = bottom; i >= top; i--) res.push_back(matrix[i][left]);
            left++;
        }
    }
    return res;
}`})]})}),e.jsx("section",{className:s==="checklist"?"block animate-in fade-in slide-in-from-bottom-4 duration-500":"hidden",children:e.jsxs("div",{className:"bg-white p-8 rounded-3xl border border-slate-200",children:[e.jsxs("h3",{className:"font-bold text-slate-900 mb-6 flex items-center gap-2 text-lg",children:[e.jsx(I,{className:"text-teal-600",size:24})," Final Readiness Checklist"]}),e.jsx("div",{className:"grid md:grid-cols-2 gap-4",children:["Can I define Stack vs Heap memory?","Can I write a HashMap implementation from scratch?","Do I check for empty inputs (Edge cases)?","Do I know the time complexity of sorting (O(N log N))?","Am I speaking while I code?","Did I ask clarifying questions first?"].map((t,a)=>e.jsxs("div",{className:"flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-teal-50 transition-colors cursor-pointer group",children:[e.jsx(N,{size:20,className:"text-slate-300 group-hover:text-teal-500 transition-colors"}),e.jsx("span",{className:"text-sm text-slate-700 font-medium",children:t})]},a))})]})})]})]})},d=({num:s,title:i,time:t,text:a})=>e.jsxs("div",{className:"flex gap-4",children:[e.jsxs("div",{className:"flex flex-col items-center",children:[e.jsx("div",{className:"w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold flex items-center justify-center text-sm border border-teal-200",children:s}),e.jsx("div",{className:"w-0.5 h-full bg-slate-100 my-2"})]}),e.jsxs("div",{className:"pb-6",children:[e.jsxs("div",{className:"flex items-center gap-2 mb-1",children:[e.jsx("h3",{className:"font-bold text-slate-800",children:i}),e.jsx("span",{className:"text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-500",children:t})]}),e.jsx("p",{className:"text-sm text-slate-500 leading-relaxed",children:a})]})]}),r=({title:s,difficulty:i,tags:t,problem:a,example:x,approach:p,description:u,steps:g,complexity:n,link:f,code:b})=>{const[o,v]=h.useState(!1);return e.jsxs("div",{className:"bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden transition-all hover:shadow-lg hover:border-teal-200",children:[e.jsxs("div",{className:"p-6 flex flex-wrap items-center justify-between cursor-pointer group",onClick:()=>v(!o),children:[e.jsxs("div",{className:"flex-1 min-w-[200px]",children:[e.jsxs("div",{className:"flex items-center gap-3 mb-2",children:[e.jsx("h3",{className:"text-xl font-extrabold text-slate-900 group-hover:text-teal-600 transition-colors",children:s}),e.jsx("span",{className:`text-[10px] px-2 py-1 rounded-lg font-black uppercase tracking-wider ${i==="Easy"?"bg-emerald-100 text-emerald-700":i==="Hard"?"bg-rose-100 text-rose-700":"bg-amber-100 text-amber-700"}`,children:i})]}),e.jsx("div",{className:"flex flex-wrap gap-2",children:t.map(l=>e.jsx("span",{className:"text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100 uppercase",children:l},l))})]}),e.jsxs("div",{className:"flex items-center gap-6",children:[e.jsxs("div",{className:"hidden md:block text-right",children:[e.jsx("div",{className:"text-[10px] font-bold text-slate-400 uppercase tracking-widest",children:"Time Complexity"}),e.jsx("div",{className:"text-sm font-bold text-emerald-600",children:n.time})]}),e.jsx("div",{className:`p-2 rounded-full bg-slate-50 text-slate-400 group-hover:text-teal-500 transition-all ${o?"rotate-180 bg-teal-50 text-teal-500":""}`,children:e.jsx(y,{size:20})})]})]}),o&&e.jsx("div",{className:"border-t border-slate-100 bg-slate-50/50 animate-in slide-in-from-top-2 duration-300",children:e.jsxs("div",{className:"p-8 grid gap-10 lg:grid-cols-5",children:[e.jsxs("div",{className:"lg:col-span-2 space-y-6",children:[e.jsxs("div",{children:[e.jsx("h4",{className:"text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3",children:"The Problem"}),e.jsx("p",{className:"text-sm text-slate-700 leading-relaxed font-medium",children:a}),e.jsx("div",{className:"mt-4 p-4 bg-white rounded-2xl border border-slate-200 text-xs font-mono text-slate-500 shadow-inner",children:x})]}),e.jsxs("div",{children:[e.jsxs("h4",{className:"text-[10px] font-black text-teal-600 uppercase tracking-[0.2em] mb-3 flex items-center gap-1",children:[e.jsx(k,{size:12})," Best Strategy: ",p]}),e.jsx("p",{className:"text-sm text-slate-600 mb-4",children:u}),e.jsx("div",{className:"space-y-3",children:g.map((l,m)=>e.jsxs("div",{className:"flex gap-3 items-start",children:[e.jsx("div",{className:"w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5",children:m+1}),e.jsx("p",{className:"text-sm text-slate-700",children:l})]},m))})]}),e.jsx("div",{className:"pt-4",children:e.jsxs("a",{href:f,target:"_blank",rel:"noopener noreferrer",className:"inline-flex items-center gap-2 text-xs font-bold text-white bg-slate-900 px-6 py-3 rounded-xl hover:bg-teal-600 transition-colors shadow-lg shadow-slate-200",children:["Try on LeetCode ",e.jsx(S,{size:14})]})})]}),e.jsxs("div",{className:"lg:col-span-3 space-y-4",children:[e.jsx("h4",{className:"text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]",children:"Quick C++ View"}),e.jsxs("div",{className:"relative group",children:[e.jsx("div",{className:"absolute -inset-1 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"}),e.jsx(j,{className:"relative bg-slate-900 text-teal-100 p-6 rounded-2xl text-xs font-mono overflow-x-auto leading-relaxed shadow-2xl border border-slate-800",children:b})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-4",children:[e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 block uppercase mb-1",children:"Space"}),e.jsx("span",{className:"text-sm font-bold text-slate-800",children:n.space})]}),e.jsxs("div",{className:"bg-white p-3 rounded-xl border border-slate-200",children:[e.jsx("span",{className:"text-[10px] font-bold text-slate-400 block uppercase mb-1",children:"Time"}),e.jsx("span",{className:"text-sm font-bold text-slate-800",children:n.time})]})]})]})]})})]})};export{P as default};
