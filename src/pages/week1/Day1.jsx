import React from 'react';
import { Calendar } from 'lucide-react';
import { Tabs, Tab } from '../../components/Tabs';
import { DayHeader, DayFooter } from '../../components/ui';
import { ConceptsContent, VisualsContent, LeetCodeContent, NotesContent } from '../../content/week1/day1';
import { getDay } from '../../config/studyPlanConfig';

const Week1Day1 = () => {
  const dayConfig = getDay('week-1', 'day-1');

  const handleComplete = () => {
    alert('Day 1 marked as complete! Great job! 🎉');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <DayHeader 
        date={dayConfig?.date || "Monday, February 2, 2026"}
        title="Interview Prep: Day 1"
        subtitle="Focus: C++ Arrays & Hashing Basics"
        goals={dayConfig?.goals || "3 Topics"}
        estimatedTime={dayConfig?.estimatedTime || "90 Min"}
      />

      <Tabs tabs={['concepts', 'visuals', 'leetcode', 'notes']} defaultTab="concepts">
        <Tab tabId="concepts">
          <ConceptsContent />
        </Tab>
        <Tab tabId="visuals">
          <VisualsContent />
        </Tab>
        <Tab tabId="leetcode">
          <LeetCodeContent />
        </Tab>
        <Tab tabId="notes">
          <NotesContent />
        </Tab>
      </Tabs>

      <DayFooter 
        nextDayPreview="Strings: Pattern matching, string manipulation & anagram problems."
        onComplete={handleComplete}
      />
    </div>
  );
};

export default Week1Day1;
