import React, { useState } from 'react';
import { BookOpen, Eye, Code2, FileText } from 'lucide-react';

const tabConfig = {
  concepts: { label: 'Concepts', icon: BookOpen },
  visuals: { label: 'Visuals', icon: Eye },
  leetcode: { label: 'LeetCode', icon: Code2 },
  notes: { label: 'Notes', icon: FileText },
};

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-slate-100 dark:bg-slate-800 p-1.5 rounded-xl inline-flex gap-1 mb-6">
      {tabs.map((tabId) => {
        const tab = tabConfig[tabId];
        if (!tab) return null;
        
        const Icon = tab.icon;
        const isActive = activeTab === tabId;
        
        return (
          <button
            key={tabId}
            onClick={() => onTabChange(tabId)}
            className={`tab-button flex items-center gap-2 ${
              isActive ? 'tab-button-active' : 'tab-button-inactive'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

const TabPanel = ({ children, isActive }) => {
  if (!isActive) return null;
  
  return (
    <div className="animate-fade-in">
      {children}
    </div>
  );
};

const Tabs = ({ tabs, children, defaultTab }) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]);
  
  // Convert children to array and filter by tab
  const childrenArray = React.Children.toArray(children);
  
  return (
    <div>
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      {childrenArray.map((child) => {
        if (!React.isValidElement(child)) return null;
        
        return (
          <TabPanel 
            key={child.props.tabId} 
            isActive={activeTab === child.props.tabId}
          >
            {child}
          </TabPanel>
        );
      })}
    </div>
  );
};

// Tab content wrapper component
const Tab = ({ tabId, children }) => {
  return <>{children}</>;
};

export { Tabs, Tab, TabNavigation };
export default Tabs;
