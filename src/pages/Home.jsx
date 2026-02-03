import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Calendar, Clock, Target, Zap, Table2 } from 'lucide-react';
import { Card } from '../components/ui';
import { studyPlanConfig, getCurrentDay } from '../config/studyPlanConfig';

const Home = () => {
  const currentDay = getCurrentDay();

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="inline-flex p-4 bg-indigo-100 dark:bg-indigo-900/50 rounded-2xl mb-6">
          <BookOpen className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-4">
          {studyPlanConfig.title}
        </h1>
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
          {studyPlanConfig.description}
        </p>
      </div>

      {/* Quick Access - Study Plan Tracker */}
      <Card className="p-6 mb-8 border-2 border-dashed border-indigo-200 dark:border-indigo-800 bg-indigo-50/50 dark:bg-indigo-900/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-100 dark:bg-indigo-800 rounded-xl">
              <Table2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-1">
                Weekly Study Tracker
              </h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                Track your daily progress with the comprehensive table view
              </p>
            </div>
          </div>
          <Link
            to="/study-plan"
            className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg"
          >
            Open Tracker
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </Card>

      {/* Continue Learning Card */}
      {currentDay && (
        <Card className="p-6 mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 border-0">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="text-white">
              <div className="flex items-center gap-2 text-indigo-200 text-sm font-medium mb-1">
                <Zap className="w-4 h-4" />
                Continue Learning
              </div>
              <h2 className="text-2xl font-bold mb-1">
                {currentDay.week.title} - {currentDay.day.title}
              </h2>
              <p className="text-indigo-100">{currentDay.day.topic}</p>
            </div>
            <Link
              to={currentDay.day.path}
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
            >
              Resume
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Card>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
        <Card className="p-4 text-center">
          <Calendar className="w-6 h-6 text-indigo-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-white">6</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Weeks</div>
        </Card>
        <Card className="p-4 text-center">
          <Target className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-white">42</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Days</div>
        </Card>
        <Card className="p-4 text-center">
          <BookOpen className="w-6 h-6 text-purple-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-white">30+</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Topics</div>
        </Card>
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-slate-800 dark:text-white">25h</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">Total Time</div>
        </Card>
      </div>

      {/* Weeks Overview */}
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Curriculum Overview</h2>
      <div className="space-y-4">
        {studyPlanConfig.weeks.map((week) => (
          <Card key={week.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold rounded-lg">
                    {week.title}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">{week.subtitle}</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300">{week.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {week.days.slice(0, 3).map((day) => (
                    <span key={day.id} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
                      {day.topic}
                    </span>
                  ))}
                  {week.days.length > 3 && (
                    <span className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-500 rounded">
                      +{week.days.length - 3} more
                    </span>
                  )}
                </div>
              </div>
              <Link
                to={week.days[0].path}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap"
              >
                Start Week
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
