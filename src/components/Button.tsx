// Team Member 1: UI Components
// This is a starter file - implement according to TEAM_TASKS.md

import React from 'react'

interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'danger'
  isLoading?: boolean
  disabled?: boolean
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  className = ''
}) => {
  const baseClass = "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
  
  const variantClasses = {
    primary: "bg-cursor-accent hover:bg-blue-600 text-white",
    secondary: "bg-cursor-panel hover:bg-gray-700 text-cursor-text border border-cursor-border",
    danger: "bg-red-600 hover:bg-red-700 text-white"
  }

  return (
    <button
      onClick={onClick}
      disabled={isLoading || disabled}
      className={`${baseClass} ${variantClasses[variant]} ${className}`}
    >
      {isLoading ? (
        <span className="flex items-center">
          <span className="animate-spin mr-2">⏳</span>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  )
}

