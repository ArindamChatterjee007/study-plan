import React from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, Target, Lock } from 'lucide-react';
import { Card } from '../components/ui';
import { getDay, getWeek } from '../config/studyPlanConfig';

// Placeholder page for days that don't have content yet
const PlaceholderDay = () => {
  const { weekId, dayId } = useParams();
  
  const weekSlug = `week-${weekId?.replace('week-', '')}`;
  const daySlug = `day-${dayId?.replace('day-', '')}`;
  
  const week = getWeek(weekSlug);
  const day = getDay(weekSlug, daySlug);

  if (!day) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Page Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400">This day doesn't exist in the study plan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700 mb-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-semibold mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{day.date}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {week?.title} - {day.title}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">Topic: {day.topic}</p>
        </div>
        <div className="flex gap-2">
          <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Goal</div>
            <div className="font-bold text-green-600 dark:text-green-400">{day.goals}</div>
          </div>
          <div className="text-center px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Est. Time</div>
            <div className="font-bold text-indigo-600 dark:text-indigo-400">{day.estimatedTime}</div>
          </div>
        </div>
      </header>

      {/* Coming Soon Card */}
      <Card className="p-12 text-center">
        <div className="inline-flex p-4 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
          <Lock className="w-8 h-8 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">
          Content Coming Soon
        </h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
          This day's content is being prepared. Check back soon for detailed concepts, 
          visual explanations, and LeetCode practice problems.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Target className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-700 dark:text-slate-200">Concepts</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Core theory & patterns</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Clock className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-700 dark:text-slate-200">Visuals</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Diagrams & walkthroughs</div>
          </div>
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
            <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
            <div className="font-semibold text-slate-700 dark:text-slate-200">LeetCode</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Practice problems</div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PlaceholderDay;
