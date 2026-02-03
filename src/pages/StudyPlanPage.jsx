import React from 'react';
import { 
  BookOpen, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Target,
  TrendingUp,
  Zap
} from 'lucide-react';
import { WeekAccordion, StatsCard, ProgressBar } from '../components/StudyPlan';
import { studyPlanData, getTotalDays, getCompletedDays } from '../data/studyPlanData';

const StudyPlanPage = () => {
  const totalDays = getTotalDays();
  const completedDays = getCompletedDays();
  const progressPercentage = Math.round((completedDays / totalDays) * 100);

  // Calculate total time spent
  const totalTimeSpent = studyPlanData.weeks.reduce((total, week) => {
    return total + week.days.reduce((dayTotal, day) => {
      return dayTotal + (typeof day.timeSpent === 'number' ? day.timeSpent : 0);
    }, 0);
  }, 0);

  // Calculate total problems solved
  const totalProblemsSolved = studyPlanData.weeks.reduce((total, week) => {
    return total + week.days.reduce((dayTotal, day) => {
      return dayTotal + (typeof day.problemsSolved === 'number' ? day.problemsSolved : 0);
    }, 0);
  }, 0);

  return (
    <div className="max-w-7xl mx-auto animate-fade-in">
      {/* Hero Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-medium mb-2">
          <Zap className="w-4 h-4" />
          <span className="text-sm">Interview Preparation</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
          {studyPlanData.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 max-w-2xl">
          {studyPlanData.description}
        </p>
      </div>

      {/* Overall Progress Card */}
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 md:p-8 mb-8 text-white shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-semibold text-white/90 mb-1">Overall Progress</h2>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl md:text-5xl font-extrabold">{progressPercentage}%</span>
              <span className="text-white/70">completed</span>
            </div>
            <p className="text-white/80 text-sm mt-2">
              {completedDays} of {totalDays} days completed
            </p>
          </div>
          
          <div className="flex-1 max-w-md">
            <div className="h-4 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-white/70 mt-2">
              <span>Week 1</span>
              <span>Week {studyPlanData.weeks.length}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={Calendar}
          label="Total Weeks"
          value={studyPlanData.weeks.length}
          color="indigo"
        />
        <StatsCard
          icon={CheckCircle2}
          label="Days Completed"
          value={`${completedDays}/${totalDays}`}
          color="emerald"
        />
        <StatsCard
          icon={Target}
          label="Problems Solved"
          value={totalProblemsSolved}
          color="amber"
        />
        <StatsCard
          icon={Clock}
          label="Hours Invested"
          value={totalTimeSpent}
          color="purple"
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-6 px-1">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Legend:</span>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Done</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-sm text-slate-600 dark:text-slate-400">Pending</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <span className="text-amber-400">★★★☆☆</span>
          <span className="text-sm text-slate-600 dark:text-slate-400">Confidence (1-5)</span>
        </div>
      </div>

      {/* Week Accordions */}
      <div className="space-y-4">
        {studyPlanData.weeks.map((week) => (
          <WeekAccordion key={week.id} week={week} />
        ))}
      </div>

      {/* Footer Note */}
      <div className="mt-8 p-4 bg-slate-100 dark:bg-slate-800 rounded-xl text-center">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          💡 <strong>Tip:</strong> Click on any row to view detailed notes and code for that day.
          <br />
          <span className="text-xs">Last updated: February 3, 2026</span>
        </p>
      </div>
    </div>
  );
};

export default StudyPlanPage;
