import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { StatusBadge, ConfidenceStars, TBACell, PlatformBadge } from './StatusComponents';
import { useStudyPlan } from '../../context/StudyPlanContext';

const DayTable = ({ days, weekId }) => {
  const navigate = useNavigate();
  const { selectedDayId } = useStudyPlan();

  const handleRowClick = (day) => {
    // Navigate to day detail page (can be implemented later)
    console.log('Navigate to:', weekId, day.id);
    // navigate(`/${weekId}/${day.id}`);
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
      <table className="w-full text-sm">
        {/* Sticky Header */}
        <thead className="sticky top-0 z-10">
          <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Day</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Date</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap min-w-[180px]">C++ Topic</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">C++ Output</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Platform</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap min-w-[200px]">LeetCode Problems</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Count</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Time (hrs)</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Confidence</th>
            <th className="text-center px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">Status</th>
            <th className="text-left px-4 py-3 font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap min-w-[200px]">Remarks</th>
          </tr>
        </thead>
        
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
          {days.map((day, index) => {
            const rowId = day.rowId || `${weekId}-${day.id}`;
            const isSelected = selectedDayId === rowId;
            
            return (
              <tr
                key={day.id}
                id={rowId}
                onClick={() => handleRowClick(day)}
                className={`
                  cursor-pointer transition-all duration-200
                  hover:bg-indigo-50 dark:hover:bg-indigo-900/20
                  ${isSelected ? 'row-selected bg-indigo-100 dark:bg-indigo-900/40' : ''}
                  ${!isSelected && day.status === 'Done' ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}
                  ${!isSelected && day.status !== 'Done' && index % 2 === 0 ? 'bg-white dark:bg-slate-800' : ''}
                  ${!isSelected && day.status !== 'Done' && index % 2 !== 0 ? 'bg-slate-50/50 dark:bg-slate-800/50' : ''}
                `}
              >
              {/* Day */}
              <td className="px-4 py-3.5">
                <span className="font-medium text-slate-800 dark:text-slate-200">{day.day}</span>
              </td>
              
              {/* Date */}
              <td className="px-4 py-3.5">
                <TBACell value={day.date} />
              </td>
              
              {/* C++ Topic */}
              <td className="px-4 py-3.5">
                <span className="text-slate-700 dark:text-slate-300">
                  <TBACell value={day.cppTopic} />
                </span>
              </td>
              
              {/* C++ Output */}
              <td className="px-4 py-3.5">
                <span className="text-slate-600 dark:text-slate-400">
                  <TBACell value={day.cppOutput} />
                </span>
              </td>
              
              {/* Platform */}
              <td className="px-4 py-3.5">
                <PlatformBadge platform={day.platform} />
              </td>
              
              {/* LeetCode Problems */}
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1">
                  <span className="text-slate-700 dark:text-slate-300">
                    <TBACell value={day.leetcodeProblems} />
                  </span>
                  {day.leetcodeProblems !== 'TBA' && (
                    <ExternalLink className="w-3 h-3 text-slate-400 hover:text-indigo-500 transition-colors" />
                  )}
                </div>
              </td>
              
              {/* Problems Solved Count */}
              <td className="px-4 py-3.5 text-center">
                <span className={`font-semibold ${
                  day.problemsSolved !== 'TBA' 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-400 dark:text-slate-500 font-normal italic'
                }`}>
                  {day.problemsSolved}
                </span>
              </td>
              
              {/* Time Spent */}
              <td className="px-4 py-3.5 text-center">
                <span className={`${
                  day.timeSpent !== 'TBA' 
                    ? 'text-slate-700 dark:text-slate-300' 
                    : 'text-slate-400 dark:text-slate-500 italic'
                }`}>
                  {day.timeSpent}
                </span>
              </td>
              
              {/* Confidence */}
              <td className="px-4 py-3.5">
                <div className="flex justify-center">
                  <ConfidenceStars level={day.confidence} />
                </div>
              </td>
              
              {/* Status */}
              <td className="px-4 py-3.5 text-center">
                <StatusBadge status={day.status} />
              </td>
              
              {/* Remarks */}
              <td className="px-4 py-3.5">
                <span className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                  <TBACell value={day.remarks} />
                </span>
              </td>
            </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DayTable;
