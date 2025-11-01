// Team Member 1: UI Components
// TODO: Implement tab component
// See TEAM_TASKS.md for requirements

import React from 'react'

interface Tab {
  id: string
  label: string
  icon?: string
}

interface TabsProps {
  tabs: Tab[]
  activeTab: string
  onChange: (tabId: string) => void
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  return (
    <div className="flex border-b border-cursor-border">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === tab.id
              ? 'border-cursor-accent text-cursor-accent'
              : 'border-transparent text-cursor-text hover:text-white'
          }`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </button>
      ))}
    </div>
  )
}

