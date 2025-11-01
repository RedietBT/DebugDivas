// Team Member 1: UI Components
// Reusable card wrapper component

import React from 'react'

interface CardProps {
  children: React.ReactNode
  title?: string
  className?: string
}

export const Card: React.FC<CardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-cursor-panel border border-cursor-border rounded-lg p-6 ${className}`}>
      {title && <h3 className="text-lg font-semibold mb-4 text-white">{title}</h3>}
      {children}
    </div>
  )
}

