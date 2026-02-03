import React from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  Lightbulb
} from 'lucide-react';
import { Card, SectionHeader, CodeBlock, Collapsible } from '../../../components/ui';

// Array Memory Diagram
const ArrayMemoryDiagram = () => (
  <div className="my-6 overflow-x-auto">
    <div className="min-w-[500px] p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-600">
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 font-mono text-center">Memory Addresses (Hex)</p>
      <div className="flex justify-center gap-1">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col items-center group relative">
             {/* Address Label */}
            <span className="text-[10px] font-mono text-slate-400 mb-1">0x10{i*4}</span>
            
            {/* Memory Block */}
            <div className="w-20 h-20 border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-slate-900 flex items-center justify-center relative group-hover:border-indigo-500 group-hover:shadow-md transition-all">
              <span className="font-bold text-slate-700 dark:text-slate-200 text-xl">{[10, 20, 30, 40, 50][i]}</span>
              <span className="absolute bottom-1 right-2 text-[10px] text-slate-300 dark:text-slate-600">int</span>
            </div>
            
            {/* Index Label */}
            <span className="mt-2 text-xs font-mono bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded">
              arr[{i}]
            </span>

            {/* Connecting Line (except last) */}
            {i < 4 && (
              <div className="absolute top-1/2 -right-[14px] w-4 h-[2px] bg-indigo-200 dark:bg-indigo-800 z-10"></div>
            )}
          </div>
        ))}
      </div>
      <p className="text-center text-xs text-slate-500 dark:text-slate-400 mt-4 italic">
        Contiguous allocation: Next address = Previous + sizeof(type)
      </p>
    </div>
  </div>
);

const ConceptsContent = () => (
  <section>
    <SectionHeader icon={Cpu} title="C++ Array Memory Layout" color="text-indigo-600" />
    <Card className="p-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2">Key Concepts</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-white">Contiguous Memory:</strong> Elements are stored side-by-side. No gaps.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-white">Fixed Size:</strong> Static arrays (stack) size is known at compile time. Dynamic (`std::vector`) is on heap.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
              <span className="text-slate-600 dark:text-slate-300">
                <strong className="text-slate-800 dark:text-white">Address Calculation:</strong> <code className="bg-slate-100 dark:bg-slate-700 px-1 py-0.5 rounded text-pink-600 dark:text-pink-400 font-mono text-sm">Addr(i) = Base + (i * size)</code>
              </span>
            </li>
          </ul>
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 flex items-start gap-2">
            <Lightbulb className="w-4 h-4 shrink-0 mt-0.5" />
            <p><strong>Why it matters?</strong> Contiguous memory means <strong>cache locality</strong>. CPU fetches a "cache line" (chunk of memory). Accessing `arr[i]` likely brings `arr[i+1]` into cache, making iteration extremely fast.</p>
          </div>
        </div>
      </div>
      
      <ArrayMemoryDiagram />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
           <span className="text-xs font-bold text-slate-400 uppercase">Stack Array</span>
           <code className="block mt-1 text-sm font-mono text-slate-700 dark:text-slate-300">int arr[5];</code>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Fast, auto-cleaned, fixed size.</p>
        </div>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700">
           <span className="text-xs font-bold text-slate-400 uppercase">Heap Array (Vector)</span>
           <code className="block mt-1 text-sm font-mono text-slate-700 dark:text-slate-300">vector&lt;int&gt; v(5);</code>
           <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Dynamic, resizable, slightly slower allocation.</p>
        </div>
      </div>
    </Card>
  </section>
);

export default ConceptsContent;
