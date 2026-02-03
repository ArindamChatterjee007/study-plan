import React from 'react';
import { Card, SectionHeader } from '../../../components/ui';
import { Eye, Database, Layers, ArrowRight } from 'lucide-react';

// Hash Table Visualization
const HashTableVisualization = () => (
  <div className="my-6 overflow-x-auto">
    <div className="min-w-[600px] p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4 text-center">Hash Table: key → hash(key) → bucket</p>
      
      <div className="flex items-center justify-center gap-8">
        {/* Keys */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase text-center mb-2">Keys</p>
          {['apple', 'banana', 'cherry'].map((key) => (
            <div key={key} className="px-3 py-2 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg font-mono text-sm">
              "{key}"
            </div>
          ))}
        </div>

        {/* Arrow */}
        <div className="flex flex-col items-center gap-2">
          <ArrowRight className="w-6 h-6 text-slate-400" />
          <span className="text-xs text-slate-500 font-mono">hash()</span>
        </div>

        {/* Hash Values */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase text-center mb-2">Hash</p>
          {[2, 5, 1].map((hash, i) => (
            <div key={i} className="px-3 py-2 bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 rounded-lg font-mono text-sm text-center">
              {hash}
            </div>
          ))}
        </div>

        {/* Arrow */}
        <ArrowRight className="w-6 h-6 text-slate-400" />

        {/* Buckets */}
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase text-center mb-2">Buckets</p>
          {[0, 1, 2, 3, 4, 5, 6].map((bucket) => (
            <div 
              key={bucket} 
              className={`px-4 py-1 rounded border text-xs font-mono flex items-center gap-2 ${
                [1, 2, 5].includes(bucket)
                  ? 'bg-green-100 dark:bg-green-900/50 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
              }`}
            >
              <span className="w-4">[{bucket}]</span>
              <span>
                {bucket === 1 && '→ "cherry"'}
                {bucket === 2 && '→ "apple"'}
                {bucket === 5 && '→ "banana"'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
        O(1) average lookup: hash(key) directly gives bucket index
      </p>
    </div>
  </div>
);

// Time Complexity Comparison
const ComplexityComparison = () => (
  <div className="my-6">
    <Card className="overflow-hidden">
      <div className="bg-slate-50 dark:bg-slate-800/50 px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h4 className="font-semibold text-slate-700 dark:text-slate-200">Time Complexity Comparison</h4>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/30">
            <tr>
              <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Operation</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Array</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Hash Map</th>
              <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300">Sorted Array</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            <tr>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Search</td>
              <td className="px-4 py-3 text-center"><span className="text-red-600 dark:text-red-400 font-mono">O(n)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-amber-600 dark:text-amber-400 font-mono">O(log n)</span></td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Insert</td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)*</span></td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-red-600 dark:text-red-400 font-mono">O(n)</span></td>
            </tr>
            <tr>
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Delete</td>
              <td className="px-4 py-3 text-center"><span className="text-red-600 dark:text-red-400 font-mono">O(n)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-red-600 dark:text-red-400 font-mono">O(n)</span></td>
            </tr>
            <tr className="bg-slate-50/50 dark:bg-slate-800/20">
              <td className="px-4 py-3 text-slate-700 dark:text-slate-300">Access by Index</td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)</span></td>
              <td className="px-4 py-3 text-center"><span className="text-slate-400 font-mono">N/A</span></td>
              <td className="px-4 py-3 text-center"><span className="text-green-600 dark:text-green-400 font-mono">O(1)</span></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 dark:text-slate-400">
        * O(1) amortized for dynamic arrays (vector), O(n) worst case when resizing
      </div>
    </Card>
  </div>
);

const VisualsContent = () => (
  <section className="space-y-8">
    <SectionHeader icon={Eye} title="Visual Explanations" color="text-purple-600" />
    
    <Card className="p-6">
      <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Database className="w-5 h-5 text-purple-500" />
        Hash Table Internals
      </h3>
      <p className="text-slate-600 dark:text-slate-300 mb-4">
        A hash table uses a <strong>hash function</strong> to compute an index into an array of buckets, from which the desired value can be found.
      </p>
      <HashTableVisualization />
    </Card>

    <Card className="p-6">
      <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-4 flex items-center gap-2">
        <Layers className="w-5 h-5 text-purple-500" />
        Data Structure Comparison
      </h3>
      <ComplexityComparison />
    </Card>
  </section>
);

export default VisualsContent;
