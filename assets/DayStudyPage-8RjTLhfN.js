const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/StudyGuide-CyhJuOlE.js","assets/index-Dfa4Lwsv.js","assets/index-CmsNP4ay.css","assets/StudyCodeBlock-gnjq8rh7.js","assets/cpu-CKp6wm_D.js","assets/book-open-CSs33TCn.js","assets/circle-check-big-BNzMe08Z.js","assets/zap-BluSaHar.js","assets/chevron-down-CFEiyoQP.js","assets/lightbulb-BDaEay1W.js","assets/Day2StudyPlan-C5KH73po.js","assets/layers-BoPtmg3U.js","assets/terminal-sMTjGTlZ.js","assets/arrow-right-left-KEK1HmjT.js","assets/database-G7xLx4jB.js","assets/circle-check-B-1E-Cuk.js","assets/circle-help-BiPYuMU0.js","assets/link-Be2_uywp.js","assets/Day3StudyPlan-DNIsspgw.js","assets/arrow-right-IM7qxqA7.js","assets/triangle-alert-7tDznxpp.js","assets/hash-ipQhCOwe.js","assets/Day4StudyPlan-X-OP4zNB.js","assets/trending-up-C-20TkpY.js","assets/activity-CAzWaK8R.js","assets/Day5StudyPlan-D5_AgJm6.js","assets/code-N7XaqLL8.js","assets/maximize-D0ibHr9T.js","assets/brain-ILVjv6PI.js","assets/clock-COyGAts0.js","assets/Day6StudyPlan-D5IwDJ9r.js","assets/server-rsZWh3p1.js","assets/search-BsZQPk1a.js","assets/Day7StudyPlan-DRzWZkE6.js","assets/mic-BSrvTI-b.js","assets/Week2PenaltyTopicsPage-BPcuVdF_.js","assets/Day11StudyPlan-BGECTiJd.js","assets/Day13StudyPlan-BuGIXha1.js","assets/eye-DbZWGj-p.js","assets/SystemEngineeringModule-a3xy0ban.js","assets/volume-x-EpYCdc5V.js","assets/sparkles-CG8VEgBu.js","assets/Week4SaturdayVirtualMemoryModule-WckX2Wsq.js","assets/message-square-share-mPnfSbJ5.js","assets/Week5SundayDebuggingMasterclass-BO28TjYL.js"])))=>i.map(i=>d[i]);
import{c as b,r as i,d as A,j as e,L as _,e as z,u as T,E as D,_ as c}from"./index-Dfa4Lwsv.js";/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const E=b("ArrowLeft",[["path",{d:"m12 19-7-7 7-7",key:"1l729n"}],["path",{d:"M19 12H5",key:"x3x0zl"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const L=b("ArrowUp",[["path",{d:"m5 12 7-7 7 7",key:"hav0vg"}],["path",{d:"M12 19V5",key:"x0mq9r"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const M=b("ChevronLeft",[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const j=b("ChevronRight",[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]]);/**
 * @license lucide-react v0.468.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const C=b("Library",[["path",{d:"m16 6 4 14",key:"ji33uf"}],["path",{d:"M12 6v14",key:"1n7gus"}],["path",{d:"M8 8v12",key:"1gg7y9"}],["path",{d:"M4 4v16",key:"6qkkli"}]]),I=r=>{var s;const n={"array memory layout":{title:"Array Memory Layout in C++",kind:"array-memory",emoji:"🧠",concepts:[{title:"Contiguous Memory Allocation",content:"Array elements occupy adjacent memory locations. Indexing computes an address in O(1) operations; actual access latency still depends on the memory hierarchy."},{title:"Memory Address Calculation",content:"For base address BASE, element index i, and element size S bytes, ADDRESS = BASE + (i * S). The size is sizeof(element), not necessarily four bytes."},{title:"Cache Efficiency",content:"Sequential traversal often benefits from adjacent elements sharing a cache line. Contiguous storage improves locality, but does not guarantee that every access is a cache hit."}],code:`// Array Memory Layout Visualization
#include <iostream>
using namespace std;

int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    
    // Print addresses of each element
    for (int i = 0; i < 5; i++) {
        cout << "arr[" << i << "] = " << arr[i] 
             << " at address: " << &arr[i] << endl;
    }
    
    // The byte stride is sizeof(int), which is implementation-defined.
    cout << "\\nSize of int: " << sizeof(int) << " bytes" << endl;
    cout << "Array is contiguous in memory! 🎯" << endl;
    
    return 0;
}`,problems:[{number:1,name:"Two Sum",difficulty:"Easy",link:"https://leetcode.com/problems/two-sum/"},{number:121,name:"Best Time to Buy and Sell Stock",difficulty:"Easy",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"},{number:217,name:"Contains Duplicate",difficulty:"Easy",link:"https://leetcode.com/problems/contains-duplicate/"},{number:238,name:"Product of Array Except Self",difficulty:"Medium",link:"https://leetcode.com/problems/product-of-array-except-self/"}],tips:["Always prefer arrays over linked lists when you need fast random access","Watch out for array bounds! C++ doesn't check them automatically","Use std::array for a safer, fixed-size container"]},"pointers and pointer arithmetic":{title:"Pointers & Pointer Arithmetic",emoji:"🔗",concepts:[{title:"What are Pointers?",content:'A pointer is a variable that stores the memory address of another variable. Think of it as a "link" to another location in memory.'},{title:"Pointer Arithmetic",content:"Adding 1 advances a pointer by sizeof(*pointer) bytes, not necessarily 4. Arithmetic must stay within the same array or one past its end; the one-past pointer must not be dereferenced."},{title:"Dereferencing",content:'The * operator "dereferences" a pointer - it follows the pointer to get the value stored at that memory address.'}],code:`// Pointer Arithmetic Fundamentals
#include <iostream>
using namespace std;

int main() {
    int arr[] = {100, 200, 300, 400, 500};
    int* ptr = arr;  // ptr points to first element
    
    cout << "Array using pointer arithmetic:" << endl;
    
    for (int i = 0; i < 5; i++) {
        cout << "*(ptr + " << i << ") = " << *(ptr + i) << endl;
    }
    
    // These are equivalent:
    cout << "\\narr[2] = " << arr[2] << endl;
    cout << "*(arr + 2) = " << *(arr + 2) << endl;
    cout << "*(ptr + 2) = " << *(ptr + 2) << endl;
    
    // Pointer increment
    ptr++;  // Now points to arr[1]
    cout << "\\nAfter ptr++, *ptr = " << *ptr << endl;
    
    return 0;
}`,problems:[{number:1,name:"Reverse String",difficulty:"Easy",link:"https://leetcode.com/problems/reverse-string/"},{number:2,name:"Move Zeroes",difficulty:"Easy",link:"https://leetcode.com/problems/move-zeroes/"},{number:3,name:"Two Sum II",difficulty:"Medium",link:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"},{number:4,name:"Container With Most Water",difficulty:"Medium",link:"https://leetcode.com/problems/container-with-most-water/"}],tips:["Pointers are just addresses - don't be scared of them!","Always initialize pointers (or use nullptr)","arr[i] is equivalent to *(arr + i)"]},"sliding window":{title:"Sliding Window Technique",emoji:"🪟",concepts:[{title:"Fixed Size Window",content:"Maintain a window of size K, slide it across the array. Remove the element leaving the window, add the element entering. O(n) instead of O(n×k)!"},{title:"Variable Size Window",content:"Expand the window by moving the right pointer. When a condition is violated, shrink from the left. Used for finding subarrays with certain properties."},{title:"When to Use",content:'Look for keywords: "contiguous subarray", "substring", "maximum/minimum of size k", "longest/shortest with condition".'}],code:`// Sliding Window - Maximum Sum of K elements
#include <iostream>
#include <vector>
#include <algorithm>
#include <stdexcept>
using namespace std;

long long maxSumSubarray(const vector<int>& arr, int k) {
    int n = arr.size();
  if (k <= 0 || n < k) throw invalid_argument("Window size must be between 1 and the array length");
    
    // First window sum
    long long windowSum = 0;
    for (int i = 0; i < k; i++) {
        windowSum += arr[i];
    }
    
    long long maxSum = windowSum;
    
    // Slide the window
    for (int i = k; i < n; i++) {
        windowSum += arr[i];
        windowSum -= arr[i - k];
        maxSum = max(maxSum, windowSum);
    }
    
    return maxSum;
}

int main() {
    vector<int> arr = {1, 4, 2, 10, 23, 3, 1, 0, 20};
    int k = 4;
    
    cout << "Max sum of " << k << " consecutive elements: " 
         << maxSumSubarray(arr, k) << endl;
    
    return 0;
}`,problems:[{number:1,name:"Maximum Average Subarray I",difficulty:"Easy",link:"https://leetcode.com/problems/maximum-average-subarray-i/"},{number:2,name:"Longest Substring Without Repeating Characters",difficulty:"Medium",link:"https://leetcode.com/problems/longest-substring-without-repeating-characters/"},{number:3,name:"Minimum Window Substring",difficulty:"Hard",link:"https://leetcode.com/problems/minimum-window-substring/"},{number:4,name:"Sliding Window Maximum",difficulty:"Hard",link:"https://leetcode.com/problems/sliding-window-maximum/"}],tips:['Always think: "Can I avoid recomputing by reusing?"',"Two pointers and sliding window often go together","Draw the window on paper to visualize the movement"]},"two pointers":{title:"Two Pointers Technique",emoji:"👆👆",concepts:[{title:"Opposite Ends",content:"Start with one pointer at the beginning and one at the end. Move them towards each other based on conditions. Great for sorted arrays!"},{title:"Same Direction",content:"Both pointers start from the beginning. Fast pointer explores ahead, slow pointer marks positions. Used for in-place modifications."},{title:"Time Complexity",content:"Typically reduces O(n²) brute force to O(n) by eliminating redundant comparisons."}],code:`// Two Pointers - Is Palindrome?
#include <iostream>
#include <string>
#include <cctype>
using namespace std;

bool isPalindrome(const string& s) {
    int left = 0;
  int right = static_cast<int>(s.length()) - 1;
    
    while (left < right) {
        // Skip non-alphanumeric from left
        while (left < right && !isalnum(static_cast<unsigned char>(s[left]))) {
            left++;
        }
        // Skip non-alphanumeric from right  
        while (left < right && !isalnum(static_cast<unsigned char>(s[right]))) {
            right--;
        }
        
        if (tolower(static_cast<unsigned char>(s[left])) != tolower(static_cast<unsigned char>(s[right]))) {
            return false;
        }
        
        left++;
        right--;
    }
    
    return true;
}

int main() {
    string test = "A man, a plan, a canal: Panama";
    
    cout << test << endl;
    cout << "Is palindrome? " << (isPalindrome(test) ? "YES ✓" : "NO ✗") << endl;
    
    return 0;
}`,problems:[{number:1,name:"Valid Palindrome",difficulty:"Easy",link:"https://leetcode.com/problems/valid-palindrome/"},{number:2,name:"Two Sum II",difficulty:"Medium",link:"https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/"},{number:3,name:"3Sum",difficulty:"Medium",link:"https://leetcode.com/problems/3sum/"},{number:4,name:"Trapping Rain Water",difficulty:"Hard",link:"https://leetcode.com/problems/trapping-rain-water/"}],tips:["Sorted array? Think two pointers!","Sum too small? Move left pointer right. Sum too big? Move right pointer left.","For duplicates, skip them to avoid repeated work"]},"kadane's algorithm":{title:"Kadane's Algorithm",emoji:"📈",concepts:[{title:"The Core Idea",content:"At each position, decide: should I extend the previous subarray, or start fresh from here? The answer depends on whether the previous sum helps or hurts."},{title:"Mathematical Form",content:"currentMax = max(arr[i], currentMax + arr[i]). If currentMax + arr[i] < arr[i], it means the previous subarray has negative sum, so start fresh."},{title:"Applications",content:"Kadane solves maximum-sum contiguous subarrays. Maximum-product and circular-subarray variants need different state or additional passes; the sum recurrence cannot be reused unchanged."}],code:`// Kadane's Algorithm - Maximum Subarray Sum
#include <iostream>
#include <vector>
#include <climits>
#include <algorithm>
#include <stdexcept>
#include <utility>
using namespace std;

int maxSubArray(vector<int>& nums) {
  if (nums.empty()) throw invalid_argument("A nonempty array is required");
    int currentMax = nums[0];
    int globalMax = nums[0];
    
    for (int i = 1; i < nums.size(); i++) {
        // Either extend previous subarray or start new one
        currentMax = max(nums[i], currentMax + nums[i]);
        globalMax = max(globalMax, currentMax);
    }
    
    return globalMax;
}

// Extended version: also returns the subarray
pair<int, pair<int,int>> maxSubArrayWithIndices(vector<int>& nums) {
  if (nums.empty()) throw invalid_argument("A nonempty array is required");
    int currentMax = nums[0], globalMax = nums[0];
    int start = 0, end = 0, tempStart = 0;
    
    for (int i = 1; i < nums.size(); i++) {
        if (nums[i] > currentMax + nums[i]) {
            currentMax = nums[i];
            tempStart = i;
        } else {
            currentMax = currentMax + nums[i];
        }
        
        if (currentMax > globalMax) {
            globalMax = currentMax;
            start = tempStart;
            end = i;
        }
    }
    
    return {globalMax, {start, end}};
}

int main() {
    vector<int> nums = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    
    auto [maxSum, indices] = maxSubArrayWithIndices(nums);
    
    cout << "Array: ";
    for (int n : nums) cout << n << " ";
    cout << endl;
    
    cout << "Maximum subarray sum: " << maxSum << endl;
    cout << "Subarray: [" << indices.first << ", " << indices.second << "]" << endl;
    
    return 0;
}`,problems:[{number:1,name:"Maximum Subarray",difficulty:"Medium",link:"https://leetcode.com/problems/maximum-subarray/"},{number:2,name:"Maximum Product Subarray",difficulty:"Medium",link:"https://leetcode.com/problems/maximum-product-subarray/"},{number:3,name:"Maximum Sum Circular Subarray",difficulty:"Medium",link:"https://leetcode.com/problems/maximum-sum-circular-subarray/"},{number:4,name:"Best Time to Buy and Sell Stock",difficulty:"Easy",link:"https://leetcode.com/problems/best-time-to-buy-and-sell-stock/"}],tips:["Kadane's is essentially local vs global maximum at each step","Initialize from the first element, not zero; this handles all-negative arrays correctly","Track indices if you need to return the actual subarray"]},"binary search on arrays":{title:"Binary Search on Arrays",emoji:"🔍",concepts:[{title:"The Power of Halving",content:"Binary search eliminates half the search space with each comparison. log₂(1,000,000) ≈ 20. That's 20 comparisons instead of 1,000,000!"},{title:"Variants",content:"Lower bound finds the first element greater than or equal to the target. Upper bound finds the first element strictly greater than it, not the last occurrence. Either can return the end position."},{title:"Beyond Arrays",content:"Binary search on answer space: minimize maximum, maximize minimum, find first/last satisfying condition."}],code:`// Binary Search - All Variants
#include <iostream>
#include <vector>
using namespace std;

// Standard binary search
int binarySearch(vector<int>& arr, int target) {
    int left = 0, right = static_cast<int>(arr.size()) - 1;
    
    while (left <= right) {
        int mid = left + (right - left) / 2;  // Avoid overflow!
        
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    
    return -1;  // Not found
}

// Returns the insertion position even when the target is absent.
int lowerBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] < target) left = mid + 1;
        else right = mid;
    }
    
    return left;
}

// Upper bound - first element > target
int upperBound(vector<int>& arr, int target) {
    int left = 0, right = arr.size();
    
    while (left < right) {
        int mid = left + (right - left) / 2;
        
        if (arr[mid] <= target) left = mid + 1;
        else right = mid;
    }
    
    return left;
}

int main() {
    vector<int> arr = {1, 2, 2, 2, 3, 4, 5, 5, 6};
    int target = 2;
    
    cout << "Array: ";
    for (int n : arr) cout << n << " ";
    cout << "\\n\\n";
    
    cout << "Binary search for " << target << ": index " << binarySearch(arr, target) << endl;
    cout << "Lower bound of " << target << ": index " << lowerBound(arr, target) << endl;
    cout << "Upper bound of " << target << ": index " << upperBound(arr, target) << endl;
    cout << "Count of " << target << ": " << upperBound(arr, target) - lowerBound(arr, target) << endl;
    
    return 0;
}`,problems:[{number:1,name:"Binary Search",difficulty:"Easy",link:"https://leetcode.com/problems/binary-search/"},{number:2,name:"Search Insert Position",difficulty:"Easy",link:"https://leetcode.com/problems/search-insert-position/"},{number:3,name:"Find First and Last Position",difficulty:"Medium",link:"https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/"},{number:4,name:"Search in Rotated Sorted Array",difficulty:"Medium",link:"https://leetcode.com/problems/search-in-rotated-sorted-array/"}],tips:["Always use mid = left + (right - left) / 2 to prevent overflow","Draw the search space and conditions on paper","left <= right for standard search, left < right for bounds"]}},a=(s=r==null?void 0:r.toLowerCase())==null?void 0:s.trim();if(!a)return null;const u=Object.entries(n).find(([o])=>(a==null?void 0:a.includes(o))||o.includes(a||""));return u?u[1]:null},f=[{week:1,day:"monday",id:"arrays",title:"Array Memory Layout",topic:"array memory layout"},{week:1,day:"tuesday",id:"hashing",title:"Hashing & Memory"},{week:1,day:"wednesday",id:"pointers",title:"Pointers & Stacks"},{week:1,day:"thursday",id:"const",title:"Profit Patterns & Const"},{week:1,day:"friday",id:"practice",title:"Structured DSA Practice"},{week:1,day:"saturday",id:"internals",title:"Internals & Mixed Problems"},{week:1,day:"sunday",id:"interview",title:"Interview Simulation"},{week:2,day:"penalty",id:"penalty",title:"Review Topics"},{week:3,day:"monday",id:"stacks",title:"Stack Mastery"},{week:3,day:"wednesday",id:"ownership",title:"C++ Ownership & Stacks"},{week:4,day:"friday",id:"systems",title:"System Engineering"},{week:4,day:"saturday",id:"memory",title:"Virtual Memory"},{week:5,day:"sunday",id:"debugging",title:"System Debugging"}];function R(r,n){if(!/^[1-9]\d*$/.test(String(r)))return null;const a=String(n||"").trim().toLowerCase(),u=Number(r)===2&&a.includes("penalty")?"penalty":a;return f.find(s=>s.week===Number(r)&&s.day===u)||null}function N(r,n,a){var o,h;if(!/^[1-9]\d*$/.test(String(n)))return null;const u=(o=r==null?void 0:r.weeks)==null?void 0:o.find(m=>String(m.weekNumber)===String(n)||m.id===`week-${n}`),s=String(a||"").trim().toLowerCase();return((h=u==null?void 0:u.days)==null?void 0:h.find(m=>String(m.day||"").trim().toLowerCase()===s))||null}function W({children:r,material:n}){const a=i.useRef(null),u=A(),s=f.findIndex(l=>l.id===(n==null?void 0:n.id)),o=f[s-1],h=s>=0?f[s+1]:null,[m,t]=i.useState(0),[v,S]=i.useState(!1);i.useEffect(()=>{window.scrollTo({top:0,behavior:"instant"});let l=0;const p=()=>{const w=document.documentElement,g=window.scrollY||w.scrollTop||0,x=w.scrollHeight-w.clientHeight;t(x>0?Math.max(0,Math.min(100,g/x*100)):100),S(g>480)},y=()=>{cancelAnimationFrame(l),l=requestAnimationFrame(p)},d=new ResizeObserver(y);return a.current&&d.observe(a.current),p(),window.addEventListener("scroll",y,{passive:!0}),window.addEventListener("resize",y),()=>{d.disconnect(),cancelAnimationFrame(l),window.removeEventListener("scroll",y),window.removeEventListener("resize",y)}},[]);const k=()=>window.scrollTo({top:0,behavior:window.matchMedia("(prefers-reduced-motion: reduce)").matches?"instant":"smooth"});return e.jsxs("div",{ref:a,"data-study-material":(n==null?void 0:n.id)||"topic",className:"study-shell relative min-h-screen",children:[e.jsx("div",{role:"progressbar","aria-label":"Reading progress","aria-valuemin":0,"aria-valuemax":100,"aria-valuenow":Math.round(m),className:"fixed inset-x-0 top-0 z-[70] h-1 bg-teal-100/50",children:e.jsx("div",{className:"h-full bg-teal-600",style:{width:`${m}%`}})}),e.jsx("nav",{className:"study-toolbar","aria-label":"Study navigation",children:e.jsxs("div",{className:"study-toolbar-inner",children:[e.jsxs(_,{to:"/",className:"study-library-link",title:"Back to dashboard",children:[e.jsx(E,{size:18}),e.jsx(C,{size:20}),e.jsx("span",{children:"Study Library"})]}),e.jsxs("select",{"aria-label":"Choose study lesson",value:(n==null?void 0:n.id)||"",onChange:l=>{const p=f.find(y=>y.id===l.target.value);p&&u(`/day/${p.week}/${p.day}`)},children:[!n&&e.jsx("option",{value:"",children:"Choose a lesson"}),f.map(l=>e.jsxs("option",{value:l.id,children:["Week ",l.week," / ",l.title]},l.id))]}),e.jsxs("div",{className:"study-navigation-actions",children:[o?e.jsx(_,{to:`/day/${o.week}/${o.day}`,"aria-label":"Previous lesson",title:o.title,children:e.jsx(M,{size:20})}):e.jsx("button",{type:"button","aria-label":"Previous lesson",disabled:!0,children:e.jsx(M,{size:20})}),h?e.jsx(_,{to:`/day/${h.week}/${h.day}`,"aria-label":"Next lesson",title:h.title,children:e.jsx(j,{size:20})}):e.jsx("button",{type:"button","aria-label":"Next lesson",disabled:!0,children:e.jsx(j,{size:20})})]})]})}),e.jsx("div",{"data-study-content":!0,children:r}),v&&e.jsx("button",{type:"button",onClick:k,"aria-label":"Back to top",title:"Back to top",className:"fixed bottom-5 left-5 z-[70] flex h-11 w-11 items-center justify-center rounded-lg border border-teal-200 bg-white text-teal-800 shadow-md hover:bg-teal-50",children:e.jsx(L,{size:20})})]})}const B=i.lazy(()=>c(()=>import("./StudyGuide-CyhJuOlE.js"),__vite__mapDeps([0,1,2,3,4,5,6,7,8,9]))),O=i.lazy(()=>c(()=>import("./Day2StudyPlan-C5KH73po.js"),__vite__mapDeps([10,1,2,3,11,12,13,14,15,16,17,8,9]))),V=i.lazy(()=>c(()=>import("./Day3StudyPlan-DNIsspgw.js"),__vite__mapDeps([18,1,2,3,4,19,20,21,11,7,17,8,5]))),$=i.lazy(()=>c(()=>import("./Day4StudyPlan-X-OP4zNB.js"),__vite__mapDeps([22,1,2,3,23,24,17,8]))),F=i.lazy(()=>c(()=>import("./Day5StudyPlan-D5_AgJm6.js"),__vite__mapDeps([25,1,2,3,26,6,27,24,28,21,11,19,23,5,8,29]))),q=i.lazy(()=>c(()=>import("./Day6StudyPlan-D5IwDJ9r.js"),__vite__mapDeps([30,1,2,3,14,31,13,11,7,17,8,32]))),U=i.lazy(()=>c(()=>import("./Day7StudyPlan-DRzWZkE6.js"),__vite__mapDeps([33,1,2,3,34,6,8,28,17]))),H=i.lazy(()=>c(()=>import("./Week2PenaltyTopicsPage-BPcuVdF_.js"),__vite__mapDeps([35,1,2,3,26,24,28,21,27,11,19,23,6,5,8,29]))),K=i.lazy(()=>c(()=>import("./Day11StudyPlan-BGECTiJd.js"),__vite__mapDeps([36,1,2,3,11,7,26,28,20,34,17,8,16,14,29]))),G=i.lazy(()=>c(()=>import("./Day13StudyPlan-BuGIXha1.js"),__vite__mapDeps([37,1,2,3,26,11,12,5,9,16,38]))),Y=i.lazy(()=>c(()=>import("./SystemEngineeringModule-a3xy0ban.js"),__vite__mapDeps([39,1,2,3,31,4,12,26,34,40,11,29,20,24,41,15,38]))),Z=i.lazy(()=>c(()=>import("./Week4SaturdayVirtualMemoryModule-WckX2Wsq.js"),__vite__mapDeps([42,1,2,3,31,4,12,26,34,40,11,43,7,41,20,15,38]))),J=i.lazy(()=>c(()=>import("./Week5SundayDebuggingMasterclass-BO28TjYL.js"),__vite__mapDeps([44,1,2,3,20,24,31,26,34,40,12,32,15,7,5,43,19,38])));function Q(){const{week:r,day:n}=z(),a=A(),{data:u,loading:s,error:o,refresh:h}=T(),m=String(n||"").trim().toLowerCase(),t=R(r,m),v=(t==null?void 0:t.id)==="penalty",S=(t==null?void 0:t.id)==="stacks",k=(t==null?void 0:t.id)==="ownership",l=(t==null?void 0:t.id)==="systems",p=(t==null?void 0:t.id)==="memory",y=(t==null?void 0:t.id)==="debugging",d=N(u,r,m),g=i.useMemo(()=>{const P=(t==null?void 0:t.topic)||(d==null?void 0:d.topic);return I(P)},[d,t]),x=()=>e.jsx("div",{className:"max-w-4xl mx-auto px-6 pt-5",children:e.jsxs("button",{onClick:()=>a("/"),className:"group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:-translate-x-0.5 hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md",children:[e.jsx(E,{className:"h-4 w-4 transition-transform group-hover:-translate-x-0.5"}),e.jsx("span",{children:"Back to Dashboard"})]})});return(!d||!g)&&!t?e.jsxs("div",{className:"min-h-screen bg-slate-50",children:[e.jsx(x,{}),e.jsx("div",{className:"flex items-center justify-center h-[80vh]",children:e.jsxs("div",{className:"text-center",children:[e.jsx("h1",{className:"text-2xl font-bold mb-2 text-slate-900",children:s?"Loading study plan...":o?"Study plan unavailable":d?"Lesson not published yet":"Day not found"}),e.jsx("p",{className:"text-slate-600",children:s?"Fetching your study plan data...":o||(d==null?void 0:d.topic)||`Week ${r}, ${n} is not in the study plan.`}),o&&e.jsx("button",{type:"button",onClick:h,className:"mt-4 rounded-lg bg-teal-700 px-4 py-2 text-white",children:"Retry"})]})})]}):e.jsx(W,{material:t,children:e.jsx(D,{fallback:e.jsxs("div",{className:"lesson-load-error",role:"alert",children:[e.jsx("h1",{children:"Unable to open this lesson"}),e.jsx("button",{type:"button",onClick:()=>window.location.reload(),children:"Reload"})]}),children:e.jsx(i.Suspense,{fallback:e.jsx("p",{className:"lesson-loading",role:"status",children:"Opening lesson..."}),children:e.jsx("div",{className:"min-h-screen bg-slate-50",children:v?e.jsx(H,{}):S?e.jsx(K,{}):k?e.jsx(G,{}):l?e.jsx(Y,{}):p?e.jsx(Z,{}):y?e.jsx(J,{}):(t==null?void 0:t.id)==="hashing"?e.jsx(O,{}):(t==null?void 0:t.id)==="pointers"?e.jsx(V,{}):(t==null?void 0:t.id)==="const"?e.jsx($,{}):(t==null?void 0:t.id)==="practice"?e.jsx(F,{}):(t==null?void 0:t.id)==="internals"?e.jsx(q,{}):(t==null?void 0:t.id)==="interview"?e.jsx(U,{}):e.jsx(B,{dayData:d||{day:m},topicContent:g})})})})},`${r}/${m}`)}const ee=Object.freeze(Object.defineProperty({__proto__:null,default:Q},Symbol.toStringTag,{value:"Module"}));export{L as A,ee as D};
