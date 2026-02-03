import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import StudyPlanPage from './pages/StudyPlanPage';
import Week1Day1 from './pages/week1/Day1';
import PlaceholderDay from './pages/PlaceholderDay';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Home page */}
        <Route index element={<Home />} />
        
        {/* Study Plan Table View - Main tracking dashboard */}
        <Route path="study-plan" element={<StudyPlanPage />} />
        
        {/* Week 1 Routes - Detailed Day Views */}
        <Route path="week-1/day-1" element={<Week1Day1 />} />
        <Route path="week-1/day-2" element={<PlaceholderDay />} />
        <Route path="week-1/day-3" element={<PlaceholderDay />} />
        <Route path="week-1/day-4" element={<PlaceholderDay />} />
        <Route path="week-1/day-5" element={<PlaceholderDay />} />
        
        {/* Week 2 Routes */}
        <Route path="week-2/day-1" element={<PlaceholderDay />} />
        <Route path="week-2/day-2" element={<PlaceholderDay />} />
        <Route path="week-2/day-3" element={<PlaceholderDay />} />
        <Route path="week-2/day-4" element={<PlaceholderDay />} />
        <Route path="week-2/day-5" element={<PlaceholderDay />} />
        
        {/* Week 3 Routes */}
        <Route path="week-3/day-1" element={<PlaceholderDay />} />
        <Route path="week-3/day-2" element={<PlaceholderDay />} />
        <Route path="week-3/day-3" element={<PlaceholderDay />} />
        <Route path="week-3/day-4" element={<PlaceholderDay />} />
        <Route path="week-3/day-5" element={<PlaceholderDay />} />
        
        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
