import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { 
  ChevronDown, 
  ChevronRight, 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  PlayCircle,
  Calendar,
  X,
  Table2,
  RefreshCw,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { useStudyPlan } from '../context/StudyPlanContext';

// Status icon component
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

// Week dropdown component - now uses curriculum from context
const WeekDropdown = ({ week, isOpen, onToggle, onDayClick }) => {
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
            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
              {week.subtitle}
            </div>
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
            <button
              key={day.id}
              onClick={() => onDayClick(day.id)}
              className="w-full sidebar-item sidebar-item-inactive text-left"
            >
              <StatusIcon status={day.status} />
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate text-xs">
                  {day.dayName} – {day.topic}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Loading skeleton for sidebar
const SidebarSkeleton = () => (
  <div className="space-y-3 px-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="animate-pulse">
        <div className="flex items-center gap-3 p-2">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20 mb-1"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Error display for sidebar
const SidebarError = ({ error, onRetry }) => (
  <div className="px-4 py-6 text-center">
    <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
      Failed to load curriculum
    </p>
    <button
      onClick={onRetry}
      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
    >
      <RefreshCw className="w-3 h-3" />
      Retry
    </button>
  </div>
);

const Sidebar = ({ isMobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const { curriculum, loading, error, refreshData, scrollToDay, stats } = useStudyPlan();
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Track expanded weeks
  const [expandedWeeks, setExpandedWeeks] = useState({});

  // Initialize expanded weeks when curriculum loads
  useEffect(() => {
    if (curriculum.length > 0) {
      const initialExpanded = curriculum.reduce((acc, week) => {
        acc[week.id] = week.isExpanded;
        return acc;
      }, {});
      setExpandedWeeks(initialExpanded);
    }
  }, [curriculum]);

  const toggleWeek = (weekId) => {
    setExpandedWeeks(prev => ({
      ...prev,
      [weekId]: !prev[weekId]
    }));
  };

  // Handle day click - navigate to study plan and scroll to row
  const handleDayClick = (dayId) => {
    // Navigate to study plan page
    navigate('/study-plan');
    
    // Scroll to the day row after navigation
    setTimeout(() => {
      scrollToDay(dayId);
    }, 300);
    
    // Close mobile sidebar
    if (isMobileOpen) {
      onMobileClose();
    }
  };

  // Handle refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshData();
    setIsRefreshing(false);
  };

  // Calculate progress for footer
  const progressPercentage = stats ? stats.progressPercentage : 0;
  const completedDays = stats ? stats.completedDays : 0;
  const totalDays = stats ? stats.totalDays : 0;

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
            <div className="flex items-center gap-1">
              {/* Refresh button */}
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing || loading}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh from Google Sheets"
              >
                {isRefreshing ? (
                  <Loader2 className="w-4 h-4 text-slate-500 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4 text-slate-500" />
                )}
              </button>
              {/* Mobile close button */}
              <button 
                onClick={onMobileClose}
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 overflow-y-auto h-[calc(100%-80px)]">
          {/* Quick Links */}
          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
            Quick Links
          </div>
          
          <NavLink
            to="/study-plan"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg mb-4 transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300' 
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800'
              }`
            }
          >
            <div className="p-1.5 rounded-md bg-indigo-100 dark:bg-indigo-800">
              <Table2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <div className="font-semibold text-sm">Weekly Tracker</div>
              <div className="text-xs text-slate-500 dark:text-slate-400">Table View</div>
            </div>
          </NavLink>

          <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3 px-3">
            Curriculum
          </div>
          
          {/* Loading State */}
          {loading && <SidebarSkeleton />}
          
          {/* Error State */}
          {error && !loading && <SidebarError error={error} onRetry={handleRefresh} />}
          
          {/* Curriculum List - fetched from Google Sheets */}
          {!loading && !error && curriculum.map((week) => (
            <WeekDropdown
              key={week.id}
              week={week}
              isOpen={expandedWeeks[week.id]}
              onToggle={() => toggleWeek(week.id)}
              onDayClick={handleDayClick}
            />
          ))}
          
          {/* Data source indicator */}
          {!loading && !error && curriculum.length > 0 && (
            <div className="mt-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <p className="text-xs text-emerald-600 dark:text-emerald-400">
                ✓ Synced from Google Sheets
              </p>
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Progress</span>
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {completedDays}/{totalDays} Days
            </span>
          </div>
          <div className="mt-2 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
