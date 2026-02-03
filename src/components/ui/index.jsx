import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

// Card Component
export const Card = ({ children, className = "" }) => (
  <div className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden ${className}`}>
    {children}
  </div>
);

// Section Header Component
export const SectionHeader = ({ icon: Icon, title, color = "text-slate-800" }) => (
  <div className="flex items-center gap-3 mb-4">
    <div className={`p-2 rounded-lg ${color} bg-opacity-10`}>
      <Icon className={`w-6 h-6 ${color}`} />
    </div>
    <h2 className="text-xl font-bold text-slate-800 dark:text-white">{title}</h2>
  </div>
);

// Code Block Component
export const CodeBlock = ({ code, language = "cpp" }) => (
  <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm overflow-x-auto my-3 text-slate-50">
    <div className="flex justify-between items-center mb-2 border-b border-slate-700 pb-2">
      <span className="text-xs text-slate-400 uppercase">{language}</span>
      <div className="flex gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
      </div>
    </div>
    <pre className="leading-relaxed">
      <code>{code}</code>
    </pre>
  </div>
);

// Collapsible Component
export const Collapsible = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg mb-3">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg"
      >
        <span className="font-semibold text-slate-700 dark:text-slate-200">{title}</span>
        {isOpen ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
      </button>
      {isOpen && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-b-lg animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
};

// Tag Component
export const Tag = ({ text, color }) => (
  <span className={`px-2 py-1 rounded text-xs font-semibold ${color}`}>
    {text}
  </span>
);

// Day Header Component
export const DayHeader = ({ date, title, subtitle, goals, estimatedTime }) => (
  <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700 mb-8">
    <div>
      <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
        <span className="text-sm">{date}</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        {title}
      </h1>
      <p className="text-slate-500 dark:text-slate-400 mt-2">{subtitle}</p>
    </div>
    <div className="flex gap-2">
      <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Goal</div>
        <div className="font-bold text-green-600 dark:text-green-400">{goals}</div>
      </div>
      <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Est. Time</div>
        <div className="font-bold text-indigo-600 dark:text-indigo-400">{estimatedTime}</div>
      </div>
    </div>
  </header>
);

// Footer Component
export const DayFooter = ({ nextDayPreview, onComplete }) => (
  <div className="mt-8 p-6 bg-slate-800 dark:bg-slate-900 rounded-xl text-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
    <div className="text-sm">
      <span className="text-white font-bold block mb-1">Next Day's Preview</span>
      {nextDayPreview}
    </div>
    <button 
      onClick={onComplete}
      className="px-6 py-2 bg-white text-slate-900 font-bold rounded-full hover:bg-indigo-50 transition-colors shadow-lg"
    >
      Mark Day Complete
    </button>
  </div>
);
