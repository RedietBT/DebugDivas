// Team Member 1: UI Components
// Loading spinner component

import React from 'react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  text
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className={`${sizeClasses[size]} border-4 border-cursor-border border-t-cursor-accent rounded-full animate-spin`}></div>
      {text && <p className="mt-4 text-cursor-text">{text}</p>}
    </div>
  )
}

