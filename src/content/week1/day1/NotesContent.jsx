import React, { useState } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { Card, SectionHeader } from '../../../components/ui';

const NotesContent = () => {
  const [notes, setNotes] = useState(`## Day 1 Notes: Arrays & Hashing

### Key Takeaways

1. **Arrays are contiguous** - Elements stored side-by-side in memory
2. **Hash maps give O(1) lookup** - Perfect for "have I seen this before?" problems
3. **Two Sum pattern** - Use complement = target - current

### Common Mistakes to Avoid

- Forgetting to handle edge cases (empty array, single element)
- Not considering duplicate values
- Using wrong data structure (set vs map)

### Questions to Review

- [ ] Two Sum (LeetCode #1)
- [ ] Contains Duplicate (LeetCode #217)
- [ ] Valid Anagram (LeetCode #242)

### Personal Notes

Add your own notes here...
`);

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a real app, this would persist to storage
    localStorage.setItem('week1-day1-notes', notes);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <section>
      <SectionHeader icon={FileText} title="Personal Notes" color="text-orange-600" />
      
      <Card className="p-6">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Write down key insights, questions, and personal notes for review.
          </p>
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              saved 
                ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300' 
                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-800'
            }`}
          >
            {saved ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Saved!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Notes
              </>
            )}
          </button>
        </div>

        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-96 p-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg font-mono text-sm text-slate-700 dark:text-slate-300 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Start typing your notes..."
        />

        <div className="mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-2">Quick Tips</h4>
          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
            <li>• Use ## for headings</li>
            <li>• Use **text** for bold</li>
            <li>• Use - [ ] for checkboxes</li>
            <li>• Notes are saved to local storage</li>
          </ul>
        </div>
      </Card>
    </section>
  );
};

export default NotesContent;
