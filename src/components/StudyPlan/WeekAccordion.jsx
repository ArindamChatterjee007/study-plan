import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Calendar, CheckCircle2, Clock } from 'lucide-react';
import DayTable from './DayTable';
import { ProgressBar } from './StatusComponents';
import { useStudyPlan } from '../../context/StudyPlanContext';

const WeekAccordion = ({ week }) => {
  const [isExpanded, setIsExpanded] = useState(week.isExpanded);
  const { getWeekProgress } = useStudyPlan();
  const progress = getWeekProgress(week.id);
  const hasProgress = progress.completed > 0;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
      {/* Accordion Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
      >
        <div className="flex items-center gap-4">
          {/* Expand Icon */}
          <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 transition-transform duration-300 ${isExpanded ? 'rotate-0' : '-rotate-90'}`}>
            <ChevronDown className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          </div>
          
          {/* Week Info */}
          <div className="text-left">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">
                {week.title}
              </h3>
              {hasProgress && (
                <span className="flex items-center gap-1 px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-xs font-medium rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  {progress.completed}/{progress.total}
                </span>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              {week.subtitle}
            </p>
          </div>
        </div>

        {/* Right Side - Progress Bar */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">{week.days.length} Days</span>
          </div>
          <div className="w-32">
            <ProgressBar completed={progress.completed} total={progress.total} showLabel={false} />
          </div>
        </div>
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-6 pb-6">
          {/* Mobile Progress Bar */}
          <div className="md:hidden mb-4">
            <ProgressBar completed={progress.completed} total={progress.total} />
          </div>
          
          {/* Day Table */}
          <DayTable days={week.days} weekId={week.id} />
        </div>
      </div>
    </div>
  );
};

export default WeekAccordion;
