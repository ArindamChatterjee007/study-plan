/**
 * Google Sheets Service
 * 
 * Fetches and transforms data from a Google Sheet (published as web).
 * This acts as the backend for the study plan data.
 * 
 * Sheet ID: 1K0Hs23qhII18wDNUFylDuTzhdkV25YAZbRXNSLGunQo
 */

// Google Sheet configuration
const SHEET_ID = '1K0Hs23qhII18wDNUFylDuTzhdkV25YAZbRXNSLGunQo';
const SHEET_GID = '0'; // First sheet (default)

// Build the Google Sheets JSON endpoint URL
// Using the Google Visualization API query endpoint
const SHEETS_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;

/**
 * Column mapping for the Google Sheet
 * Based on actual sheet structure:
 * A: Day, B: Date, C: C++ Topic, D: C++ Output, E: Platform, 
 * F: LeetCode Problems, G: Problems Solved, H: Time Spent, 
 * I: Confidence, J: Status, K: Remarks
 */
const COLUMN_MAP = {
  DAY: 0,           // Column A: Day name (Monday, Tuesday, etc.)
  DATE: 1,          // Column B: Date
  CPP_TOPIC: 2,     // Column C: C++ Topic
  CPP_OUTPUT: 3,    // Column D: C++ Output (Notes/Code)
  PLATFORM: 4,      // Column E: DSA Platform
  LEETCODE: 5,      // Column F: LeetCode Problems
  PROBLEMS_SOLVED: 6,// Column G: Problems Solved (Count)
  TIME_SPENT: 7,    // Column H: Time Spent (hrs)
  CONFIDENCE: 8,    // Column I: Confidence (1-5)
  STATUS: 9,        // Column J: Status (Done/Pending)
  REMARKS: 10,      // Column K: Remarks
};

// Days of the week in order
const DAYS_ORDER = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

/**
 * Parse the Google Visualization API response
 * The response is JSONP-like: google.visualization.Query.setResponse({...})
 */
const parseGoogleSheetsResponse = (responseText) => {
  try {
    // Extract JSON from the JSONP-style response
    const jsonMatch = responseText.match(/google\.visualization\.Query\.setResponse\(([\s\S]*)\);?$/);
    if (!jsonMatch) {
      throw new Error('Invalid Google Sheets response format');
    }
    return JSON.parse(jsonMatch[1]);
  } catch (error) {
    console.error('Error parsing Google Sheets response:', error);
    throw new Error('Failed to parse Google Sheets data');
  }
};

/**
 * Extract cell value from Google Sheets row
 */
const getCellValue = (row, index) => {
  const cell = row.c?.[index];
  if (!cell) return null;
  // Prefer formatted value (f) over raw value (v) for display
  return cell.f || cell.v || null;
};

/**
 * Transform raw Google Sheets data into structured study plan data
 */
const transformSheetsData = (rawData) => {
  const { table } = rawData;
  if (!table || !table.rows) {
    throw new Error('No data found in Google Sheet');
  }

  const days = [];
  
  // Process each row
  table.rows.forEach((row, rowIndex) => {
    const dayName = getCellValue(row, COLUMN_MAP.DAY);
    
    // Skip empty rows or header rows
    if (!dayName || dayName === 'Day') return;
    
    const cppTopic = getCellValue(row, COLUMN_MAP.CPP_TOPIC) || 'TBA';
    const date = getCellValue(row, COLUMN_MAP.DATE) || 'TBA';
    const problemsSolved = getCellValue(row, COLUMN_MAP.PROBLEMS_SOLVED);
    const timeSpent = getCellValue(row, COLUMN_MAP.TIME_SPENT);
    const confidence = getCellValue(row, COLUMN_MAP.CONFIDENCE);
    const status = getCellValue(row, COLUMN_MAP.STATUS) || 'Pending';
    
    const dayEntry = {
      id: dayName.toLowerCase().substring(0, 3),
      day: dayName,
      date: date,
      cppTopic: cppTopic,
      cppOutput: getCellValue(row, COLUMN_MAP.CPP_OUTPUT) || 'TBA',
      platform: getCellValue(row, COLUMN_MAP.PLATFORM) || 'TBA',
      leetcodeProblems: getCellValue(row, COLUMN_MAP.LEETCODE) || 'TBA',
      problemsSolved: parseNumberOrTBA(problemsSolved),
      timeSpent: parseNumberOrTBA(timeSpent),
      confidence: parseNumberOrTBA(confidence),
      status: status,
      remarks: getCellValue(row, COLUMN_MAP.REMARKS) || 'TBA',
    };
    
    days.push(dayEntry);
  });
  
  // Group days into weeks (7 days per week)
  const weeks = [];
  const DAYS_PER_WEEK = 7;
  
  for (let i = 0; i < days.length; i += DAYS_PER_WEEK) {
    const weekNum = Math.floor(i / DAYS_PER_WEEK) + 1;
    const weekDays = days.slice(i, i + DAYS_PER_WEEK);
    
    // Add rowId to each day for scrolling/highlighting
    weekDays.forEach((day) => {
      day.rowId = `week-${weekNum}-${day.id}`;
    });
    
    weeks.push({
      id: `week-${weekNum}`,
      title: `Week ${weekNum}`,
      subtitle: getWeekSubtitle(weekNum),
      isExpanded: weekNum === 1,
      days: weekDays,
    });
  }
  
  return {
    title: 'Interview Preparation Study Plan',
    description: 'A comprehensive daily tracking system for mastering C++ and Data Structures',
    weeks,
    lastFetched: new Date().toISOString(),
  };
};

/**
 * Parse a value as number or return 'TBA' string
 */
const parseNumberOrTBA = (value) => {
  if (value === null || value === undefined || value === '' || value === 'TBA') {
    return 'TBA';
  }
  const num = parseFloat(value);
  return isNaN(num) ? value : num;
};

/**
 * Get week subtitle based on week number
 * Can be enhanced to fetch from sheet if needed
 */
const getWeekSubtitle = (weekNum) => {
  const subtitles = {
    1: 'Foundations – Arrays & HashMap',
    2: 'Intermediate – Stacks & Queues',
    3: 'Advanced – Trees & Graphs',
    4: 'System Design Basics',
    5: 'Dynamic Programming',
    6: 'Final Revision & Mock',
  };
  return subtitles[weekNum] || `Week ${weekNum} Topics`;
};

/**
 * Fetch study plan data from Google Sheets
 * @returns {Promise<Object>} Transformed study plan data
 */
export const fetchStudyPlanFromSheets = async () => {
  try {
    const response = await fetch(SHEETS_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const text = await response.text();
    const rawData = parseGoogleSheetsResponse(text);
    const transformedData = transformSheetsData(rawData);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching from Google Sheets:', error);
    throw error;
  }
};

/**
 * Build curriculum data structure for sidebar
 * Groups days by week with day name and topic
 */
export const buildCurriculumFromData = (studyPlanData) => {
  if (!studyPlanData?.weeks) return [];
  
  return studyPlanData.weeks.map((week) => ({
    id: week.id,
    title: week.title,
    subtitle: week.subtitle,
    isExpanded: week.isExpanded,
    days: week.days.map((day) => ({
      id: day.rowId,
      dayName: day.day,
      topic: day.cppTopic,
      date: day.date,
      status: day.status === 'Done' ? 'completed' : (day.status === 'Pending' && day.date !== 'TBA' ? 'current' : 'upcoming'),
    })),
  }));
};

/**
 * Calculate statistics from study plan data
 */
export const calculateStats = (studyPlanData) => {
  if (!studyPlanData?.weeks) {
    return {
      totalWeeks: 0,
      totalDays: 0,
      completedDays: 0,
      problemsSolved: 0,
      hoursSpent: 0,
      progressPercentage: 0,
    };
  }
  
  let totalDays = 0;
  let completedDays = 0;
  let problemsSolved = 0;
  let hoursSpent = 0;
  
  studyPlanData.weeks.forEach((week) => {
    week.days.forEach((day) => {
      totalDays++;
      if (day.status === 'Done') completedDays++;
      if (typeof day.problemsSolved === 'number') problemsSolved += day.problemsSolved;
      if (typeof day.timeSpent === 'number') hoursSpent += day.timeSpent;
    });
  });
  
  return {
    totalWeeks: studyPlanData.weeks.length,
    totalDays,
    completedDays,
    problemsSolved,
    hoursSpent,
    progressPercentage: totalDays > 0 ? Math.round((completedDays / totalDays) * 100) : 0,
  };
};

/**
 * Get progress for a specific week
 */
export const getWeekProgressFromData = (studyPlanData, weekId) => {
  if (!studyPlanData?.weeks) return { completed: 0, total: 0 };
  
  const week = studyPlanData.weeks.find(w => w.id === weekId);
  if (!week) return { completed: 0, total: 0 };
  
  const total = week.days.length;
  const completed = week.days.filter(d => d.status === 'Done').length;
  
  return { completed, total };
};

export default {
  fetchStudyPlanFromSheets,
  buildCurriculumFromData,
  calculateStats,
  getWeekProgressFromData,
};
