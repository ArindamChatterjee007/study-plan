import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Calendar,
  Menu,
  X
} from 'lucide-react';
import { studyPlanConfig } from '../config/studyPlanConfig';

const StatusIcon = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'current':
      return <PlayCircle className="w-4 h-4 text-indigo-500" />;
    default:
      return <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600" />;
  }
};

const WeekDropdown = ({ week, isOpen, onToggle }) => {
  const location = useLocation();
  const isWeekActive = location.pathname.includes(week.id);

  return (
    <div className="mb-2">
      {/* Week Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
          isWeekActive 
            ? 'bg-indigo-50 dark:bg-indigo-900/20' 
            : 'hover:bg-slate-100 dark:hover:bg-slate-800'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-1.5 rounded-md ${
            isWeekActive 
              ? 'bg-indigo-100 dark:bg-indigo-800' 
              : 'bg-slate-100 dark:bg-slate-700 group-hover:bg-slate-200 dark:group-hover:bg-slate-600'
          }`}>
            <Calendar className={`w-4 h-4 ${
              isWeekActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`} />
          </div>
          <div className="text-left">
            <div className={`font-semibold text-sm ${
              isWeekActive ? 'text-indigo-700 dark:text-indigo-300' : 'text-slate-700 dark:text-slate-200'
            }`}>
              {week.title}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">{week.subtitle}</div>
          </div>
        </div>
        {isOpen ? (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronRight className="w-4 h-4 text-slate-400" />
        )}
      </button>

      {/* Days List */}
      {isOpen && (
        <div className="mt-1 ml-3 pl-3 border-l-2 border-slate-200 dark:border-slate-700 space-y-1 animate-slide-down">
          {week.days.map((day) => (
            <NavLink
              key={day.id}
              to={day.path}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'}`
              }
            >
              <StatusIcon status={day.status} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{day.title}: {day.topic}</div>
              </div>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const [expandedWeeks, setExpandedWeeks] = useState(
    studyPlanConfig.weeks.reduce((acc, week) => {
      acc[week.id] = week.isExpanded;
      return acc;
    }, {})
  );

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:z-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                <BookOpen className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h1 className="font-bold text-slate-900 dark:text-white">Study Plan</h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Interview Prep</p>
              </div>
            </div>
            <button 
              onClick={onMobileClose}
              className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
            Curriculum
          </div>
          
          {studyPlanConfig.weeks.map((week) => (
            <WeekDropdown
              key={week.id}
              week={week}
              isOpen={expandedWeeks[week.id]}
              onToggle={() => toggleWeek(week.id)}
            />
          ))}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">1/15 Days</span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="h-full w-[7%] bg-indigo-500 rounded-full transition-all duration-500" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
