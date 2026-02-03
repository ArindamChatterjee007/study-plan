/**
 * Study Plan Data
 * Single source of truth for all weekly study tracking data
 */

// Week 1 - Fully populated data (DO NOT CHANGE)
const week1Data = {
  id: 'week-1',
  title: 'Week 1',
  subtitle: 'Foundations – Arrays & HashMap',
  isExpanded: true,
  days: [
    {
      id: 'mon',
      day: 'Monday',
      date: '2/2/2026',
      cppTopic: 'Array memory layout',
      cppOutput: 'Arrays',
      platform: 'LeetCode',
      leetcodeProblems: 'Two Sum, Contains Duplicate',
      problemsSolved: 2,
      timeSpent: 1,
      confidence: 3,
      status: 'Done',
      remarks: 'Need to solve more to get a good hold on arrays',
    },
    {
      id: 'tue',
      day: 'Tuesday',
      date: '3/2/2026',
      cppTopic: 'Stack vs Heap (array perspective)',
      cppOutput: 'HashMap basics',
      platform: 'LeetCode',
      leetcodeProblems: 'Valid Anagram, Group Anagrams',
      problemsSolved: 1,
      timeSpent: 0.5,
      confidence: 1,
      status: 'Pending',
      remarks: 'Valid Anagram – 49/54 TestCases',
    },
    {
      id: 'wed',
      day: 'Wednesday',
      date: 'TBA',
      cppTopic: 'Pointer arithmetic with arrays',
      cppOutput: 'HashMap depth',
      platform: 'LeetCode',
      leetcodeProblems: 'Valid Parentheses, Min Stack',
      problemsSolved: 'TBA',
      timeSpent: 'TBA',
      confidence: 'TBA',
      status: 'Pending',
      remarks: 'TBA',
    },
    {
      id: 'thu',
      day: 'Thursday',
      date: 'TBA',
      cppTopic: 'const with pointers (basic level)',
      cppOutput: 'HashMap patterns',
      platform: 'LeetCode',
      leetcodeProblems: 'Best Time Buy Sell Stock, Maximum Subarray',
      problemsSolved: 'TBA',
      timeSpent: 'TBA',
      confidence: 'TBA',
      status: 'Pending',
      remarks: 'TBA',
    },
    {
      id: 'fri',
      day: 'Friday',
      date: 'TBA',
      cppTopic: 'Revision: Arrays + HashMap + pointers',
      cppOutput: 'Revision',
      platform: 'LeetCode',
      leetcodeProblems: 'Product Except Self, Longest Substring',
      problemsSolved: 'TBA',
      timeSpent: 'TBA',
      confidence: 'TBA',
      status: 'Pending',
      remarks: 'TBA',
    },
    {
      id: 'sat',
      day: 'Saturday',
      date: 'TBA',
      cppTopic: 'HashMap internal working (high level)',
      cppOutput: 'Arrays + HashMap',
      platform: 'LeetCode',
      leetcodeProblems: '5 Mixed Array/String Problems',
      problemsSolved: 'TBA',
      timeSpent: 'TBA',
      confidence: 'TBA',
      status: 'Pending',
      remarks: 'TBA',
    },
    {
      id: 'sun',
      day: 'Sunday',
      date: 'TBA',
      cppTopic: 'Oral explanation practice',
      cppOutput: 'Mixed revision',
      platform: 'LeetCode',
      leetcodeProblems: '5 Weak Area Problems',
      problemsSolved: 'TBA',
      timeSpent: 'TBA',
      confidence: 'TBA',
      status: 'Pending',
      remarks: 'TBA',
    },
  ],
};

// Generate TBA week template
const generateTBAWeek = (weekNum, title, subtitle) => ({
  id: `week-${weekNum}`,
  title: title,
  subtitle: subtitle,
  isExpanded: false,
  days: [
    { id: 'mon', day: 'Monday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'tue', day: 'Tuesday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'wed', day: 'Wednesday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'thu', day: 'Thursday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'fri', day: 'Friday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'sat', day: 'Saturday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
    { id: 'sun', day: 'Sunday', date: 'TBA', cppTopic: 'TBA', cppOutput: 'TBA', platform: 'TBA', leetcodeProblems: 'TBA', problemsSolved: 'TBA', timeSpent: 'TBA', confidence: 'TBA', status: 'Pending', remarks: 'TBA' },
  ],
});

// All weeks data
export const studyPlanData = {
  title: 'Interview Preparation Study Plan',
  description: 'A comprehensive daily tracking system for mastering C++ and Data Structures',
  weeks: [
    week1Data,
    generateTBAWeek(2, 'Week 2', 'Intermediate – Stacks & Queues (TBA)'),
    generateTBAWeek(3, 'Week 3', 'Advanced – Trees & Graphs (TBA)'),
    generateTBAWeek(4, 'Week 4', 'System Design Basics (TBA)'),
    generateTBAWeek(5, 'Week 5', 'Dynamic Programming (TBA)'),
    generateTBAWeek(6, 'Week 6', 'Final Revision & Mock (TBA)'),
  ],
};

// Helper functions
export const getTotalDays = () => {
  return studyPlanData.weeks.reduce((total, week) => total + week.days.length, 0);
};

export const getCompletedDays = () => {
  return studyPlanData.weeks.reduce((total, week) => {
    return total + week.days.filter(day => day.status === 'Done').length;
  }, 0);
};

export const getWeekProgress = (weekId) => {
  const week = studyPlanData.weeks.find(w => w.id === weekId);
  if (!week) return { completed: 0, total: 0 };
  const completed = week.days.filter(day => day.status === 'Done').length;
  return { completed, total: week.days.length };
};

export default studyPlanData;
