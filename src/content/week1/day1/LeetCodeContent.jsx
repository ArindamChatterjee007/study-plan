import React from 'react';
import { Code2, Zap } from 'lucide-react';
import { Card, SectionHeader, CodeBlock, Collapsible, Tag } from '../../../components/ui';

const LeetCodeContent = () => (
  <section>
    <SectionHeader icon={Code2} title="LeetCode Practice" color="text-emerald-600" />
    
    <div className="grid md:grid-cols-2 gap-6">
      
      {/* Problem 1: Two Sum */}
      <Card className="flex flex-col h-full">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">1. Two Sum</h3>
            <Tag text="Easy" color="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Find two numbers in array <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">nums</code> that add up to <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">target</code>. Return their indices.
          </p>
          <div className="mt-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
            Input: nums = [2,7,11,15], target = 9<br/>
            Output: [0,1] <span className="text-slate-400">// 2 + 7 = 9</span>
          </div>
        </div>
        
        <div className="p-5 flex-1">
          <div className="flex items-center gap-2 mb-3">
             <Zap className="w-4 h-4 text-amber-500" />
             <span className="font-bold text-sm text-slate-700 dark:text-slate-200">The "Aha!" Moment</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            Don't iterate twice! As you walk through the array, ask: <em>"Have I seen the number needed to complete this pair before?"</em>
          </p>
          
          <Collapsible title="Best Approach (Hash Map)">
            <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Strategy</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Use a <code className="text-pink-600 dark:text-pink-400">unordered_map</code> to store value → index.</p>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Formula</h4>
                <code className="text-sm bg-slate-100 dark:bg-slate-700 px-1 rounded text-slate-700 dark:text-slate-300">complement = target - current_num</code>
              </div>
              <CodeBlock code={`vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (map.count(complement)) {
            return {map[complement], i};
        }
        map[nums[i]] = i;
    }
    return {};
}`} />
              <div className="flex gap-4 mt-2 text-xs font-bold">
                 <span className="text-emerald-600 dark:text-emerald-400">Time: O(n)</span>
                 <span className="text-amber-600 dark:text-amber-400">Space: O(n)</span>
              </div>
            </div>
          </Collapsible>
        </div>
      </Card>

      {/* Problem 2: Contains Duplicate */}
      <Card className="flex flex-col h-full">
        <div className="p-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">217. Contains Duplicate</h3>
            <Tag text="Easy" color="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300" />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Return <code className="bg-slate-100 dark:bg-slate-700 px-1 rounded">true</code> if any value appears at least twice in the array.
          </p>
          <div className="mt-3 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-xs font-mono text-slate-600 dark:text-slate-300">
            Input: nums = [1,2,3,1]<br/>
            Output: true
          </div>
        </div>
        
        <div className="p-5 flex-1">
           <div className="flex items-center gap-2 mb-3">
             <Zap className="w-4 h-4 text-amber-500" />
             <span className="font-bold text-sm text-slate-700 dark:text-slate-200">The "Aha!" Moment</span>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">
            A Set is a mathematical collection of <em>unique</em> items. If you try to put the array into a Set and the size shrinks, there were duplicates.
          </p>

          <Collapsible title="Best Approach (Hash Set)">
             <div className="space-y-3">
              <div>
                <h4 className="text-xs font-bold uppercase text-slate-400">Strategy</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300">Use <code className="text-pink-600 dark:text-pink-400">unordered_set</code>. If <code className="text-pink-600 dark:text-pink-400">set.count(num)</code> is true, return true.</p>
              </div>
              <CodeBlock code={`bool containsDuplicate(vector<int>& nums) {
    unordered_set<int> s;
    for (int x : nums) {
        if (s.count(x)) return true;
        s.insert(x);
    }
    return false;
}`} />
              <div className="flex gap-4 mt-2 text-xs font-bold">
                 <span className="text-emerald-600 dark:text-emerald-400">Time: O(n)</span>
                 <span className="text-amber-600 dark:text-amber-400">Space: O(n)</span>
              </div>
              
              <div className="pt-3 mt-3 border-t border-slate-100 dark:border-slate-700">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-1">Alternative (Sorting)</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sort O(n log n), then check neighbors `nums[i] == nums[i+1]`. Saves space O(1).</p>
              </div>
            </div>
          </Collapsible>
        </div>
      </Card>

    </div>
  </section>
);

export default LeetCodeContent;
