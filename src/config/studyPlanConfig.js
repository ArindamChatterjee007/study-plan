/**
 * Study Plan Configuration
 * 
 * This is the single source of truth for all study content.
 * Add new weeks, days, and topics here to dynamically generate the UI.
 */

export const studyPlanConfig = {
  title: "Interview Prep Study Plan",
  description: "A comprehensive guide to mastering Data Structures & Algorithms",
  
  weeks: [
    {
      id: "week-1",
      title: "Week 1",
      subtitle: "Foundations",
      description: "Arrays, Hashing, Strings & Sliding Window",
      isExpanded: true,
      days: [
        {
          id: "day-1",
          title: "Day 1",
          topic: "Arrays & Hashing",
          date: "Monday, February 2, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-1/day-1",
          status: "current", // 'completed', 'current', 'upcoming'
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-2",
          title: "Day 2",
          topic: "Strings",
          date: "Tuesday, February 3, 2026",
          estimatedTime: "75 Min",
          goals: "2 Topics",
          path: "/week-1/day-2",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-3",
          title: "Day 3",
          topic: "Sliding Window",
          date: "Wednesday, February 4, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-1/day-3",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-4",
          title: "Day 4",
          topic: "Two Pointers",
          date: "Thursday, February 5, 2026",
          estimatedTime: "60 Min",
          goals: "2 Topics",
          path: "/week-1/day-4",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-5",
          title: "Day 5",
          topic: "Review & Practice",
          date: "Friday, February 6, 2026",
          estimatedTime: "120 Min",
          goals: "5 Problems",
          path: "/week-1/day-5",
          status: "upcoming",
          tabs: ["concepts", "leetcode", "notes"],
        },
      ],
    },
    {
      id: "week-2",
      title: "Week 2",
      subtitle: "Intermediate",
      description: "Stacks, Queues, Linked Lists & Binary Search",
      isExpanded: false,
      days: [
        {
          id: "day-1",
          title: "Day 1",
          topic: "Stacks",
          date: "Monday, February 9, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-2/day-1",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-2",
          title: "Day 2",
          topic: "Queues",
          date: "Tuesday, February 10, 2026",
          estimatedTime: "75 Min",
          goals: "2 Topics",
          path: "/week-2/day-2",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-3",
          title: "Day 3",
          topic: "Linked Lists",
          date: "Wednesday, February 11, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-2/day-3",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-4",
          title: "Day 4",
          topic: "Binary Search",
          date: "Thursday, February 12, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-2/day-4",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-5",
          title: "Day 5",
          topic: "Review & Practice",
          date: "Friday, February 13, 2026",
          estimatedTime: "120 Min",
          goals: "5 Problems",
          path: "/week-2/day-5",
          status: "upcoming",
          tabs: ["concepts", "leetcode", "notes"],
        },
      ],
    },
    {
      id: "week-3",
      title: "Week 3",
      subtitle: "Advanced",
      description: "Trees, Graphs & Dynamic Programming",
      isExpanded: false,
      days: [
        {
          id: "day-1",
          title: "Day 1",
          topic: "Binary Trees",
          date: "Monday, February 16, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-3/day-1",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-2",
          title: "Day 2",
          topic: "BST & Heaps",
          date: "Tuesday, February 17, 2026",
          estimatedTime: "90 Min",
          goals: "3 Topics",
          path: "/week-3/day-2",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-3",
          title: "Day 3",
          topic: "Graphs - BFS/DFS",
          date: "Wednesday, February 18, 2026",
          estimatedTime: "120 Min",
          goals: "4 Topics",
          path: "/week-3/day-3",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-4",
          title: "Day 4",
          topic: "Dynamic Programming",
          date: "Thursday, February 19, 2026",
          estimatedTime: "120 Min",
          goals: "4 Topics",
          path: "/week-3/day-4",
          status: "upcoming",
          tabs: ["concepts", "visuals", "leetcode", "notes"],
        },
        {
          id: "day-5",
          title: "Day 5",
          topic: "Final Review",
          date: "Friday, February 20, 2026",
          estimatedTime: "150 Min",
          goals: "Mock Interview",
          path: "/week-3/day-5",
          status: "upcoming",
          tabs: ["concepts", "leetcode", "notes"],
        },
      ],
    },
  ],
};

// Helper function to get a specific week
export const getWeek = (weekId) => {
  return studyPlanConfig.weeks.find(w => w.id === weekId);
};

// Helper function to get a specific day
export const getDay = (weekId, dayId) => {
  const week = getWeek(weekId);
  if (!week) return null;
  return week.days.find(d => d.id === dayId);
};

// Helper function to get current day info
export const getCurrentDay = () => {
  for (const week of studyPlanConfig.weeks) {
    for (const day of week.days) {
      if (day.status === 'current') {
        return { week, day };
      }
    }
  }
  return null;
};

export default studyPlanConfig;
