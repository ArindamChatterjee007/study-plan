import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  fetchStudyPlanFromSheets, 
  buildCurriculumFromData, 
  calculateStats,
  getWeekProgressFromData 
} from '../services/googleSheetsService';

// Create context
const StudyPlanContext = createContext(null);

/**
 * Study Plan Provider
 * 
 * Provides study plan data to all child components.
 * Data is fetched from Google Sheets on mount.
 */
export const StudyPlanProvider = ({ children }) => {
  const [studyPlanData, setStudyPlanData] = useState(null);
  const [curriculum, setCurriculum] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetched, setLastFetched] = useState(null);
  
  // Selected day for highlighting
  const [selectedDayId, setSelectedDayId] = useState(null);

  /**
   * Fetch data from Google Sheets
   */
  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await fetchStudyPlanFromSheets();
      setStudyPlanData(data);
      setCurriculum(buildCurriculumFromData(data));
      setStats(calculateStats(data));
      setLastFetched(new Date());
      console.log('✅ Study plan data loaded from Google Sheets');
    } catch (err) {
      console.error('❌ Failed to fetch study plan data:', err);
      setError(err.message || 'Failed to load study plan data');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Refresh data from Google Sheets
   */
  const refreshData = useCallback(() => {
    return fetchData();
  }, [fetchData]);

  /**
   * Get progress for a specific week
   */
  const getWeekProgress = useCallback((weekId) => {
    return getWeekProgressFromData(studyPlanData, weekId);
  }, [studyPlanData]);

  /**
   * Select a day (for highlighting in table)
   */
  const selectDay = useCallback((dayId) => {
    setSelectedDayId(dayId);
    
    // Auto-clear selection after 3 seconds
    if (dayId) {
      setTimeout(() => {
        setSelectedDayId((current) => current === dayId ? null : current);
      }, 3000);
    }
  }, []);

  /**
   * Scroll to and highlight a specific day row
   */
  const scrollToDay = useCallback((dayId) => {
    setSelectedDayId(dayId);
    
    // Small delay to allow DOM update
    setTimeout(() => {
      const element = document.getElementById(dayId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('highlight-flash');
        
        // Remove highlight class after animation
        setTimeout(() => {
          element.classList.remove('highlight-flash');
        }, 2000);
      }
    }, 100);
    
    // Clear selection after 3 seconds
    setTimeout(() => {
      setSelectedDayId((current) => current === dayId ? null : current);
    }, 3000);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = {
    // Data
    studyPlanData,
    curriculum,
    stats,
    
    // State
    loading,
    error,
    lastFetched,
    selectedDayId,
    
    // Actions
    refreshData,
    getWeekProgress,
    selectDay,
    scrollToDay,
  };

  return (
    <StudyPlanContext.Provider value={value}>
      {children}
    </StudyPlanContext.Provider>
  );
};

/**
 * Hook to use study plan context
 */
export const useStudyPlan = () => {
  const context = useContext(StudyPlanContext);
  if (!context) {
    throw new Error('useStudyPlan must be used within a StudyPlanProvider');
  }
  return context;
};

/**
 * Hook to use curriculum data
 */
export const useCurriculum = () => {
  const { curriculum, loading, error } = useStudyPlan();
  return { curriculum, loading, error };
};

/**
 * Hook to use statistics
 */
export const useStats = () => {
  const { stats, loading } = useStudyPlan();
  return { stats, loading };
};

export default StudyPlanContext;
