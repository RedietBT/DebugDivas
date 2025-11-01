// Team Member 1: UI Components
// TODO: Implement log input panel
// See TEAM_TASKS.md and src/components/README.md for requirements

import React from 'react'
import { LogType } from '@/types'
import { Button } from './Button'

interface LogInputPanelProps {
  value: string
  onChange: (value: string) => void
  selectedType: LogType | 'auto'
  onTypeChange: (type: LogType | 'auto') => void
  onAnalyze: () => void
  onLoadSample?: (sampleKey: string) => void
  isAnalyzing: boolean
}

export const LogInputPanel: React.FC<LogInputPanelProps> = ({
  value,
  onChange,
  selectedType,
  onTypeChange,
  onAnalyze,
  onLoadSample,
  isAnalyzing
}) => {
  return (
    <div className="bg-cursor-panel border border-cursor-border rounded-lg p-6 mb-6">
      <h2 className="text-lg font-semibold mb-4 text-white">
        Paste Your Error Logs
      </h2>
      
      <p className="text-sm text-cursor-text mb-4">
        Paste stack traces, CI/CD logs, Docker errors, or deployment failures below.
        DevFix.AI will analyze and suggest fixes.
      </p>
      
      {/* Textarea */}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-64 bg-cursor-bg border border-cursor-border rounded p-4 text-cursor-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cursor-accent resize-y"
        placeholder="Paste your error logs here..."
      />
      
      {/* Character count */}
      <div className="text-xs text-cursor-text mt-2">
        {value.length} characters
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center space-x-4">
          {/* Log type dropdown */}
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as LogType | 'auto')}
            className="bg-cursor-bg border border-cursor-border rounded px-4 py-2 text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-cursor-accent"
          >
            <option value="auto">Auto-detect log type</option>
            <option value="node">Node.js</option>
            <option value="python">Python</option>
            <option value="docker">Docker</option>
            <option value="github_actions">GitHub Actions</option>
            <option value="vercel">Vercel</option>
            <option value="nginx">Nginx</option>
            <option value="general">General</option>
          </select>
          
          {/* Clear button */}
          <button
            onClick={() => onChange('')}
            className="text-sm text-cursor-text hover:text-white"
            disabled={!value}
          >
            Clear
          </button>
        </div>
        
        {/* Analyze button */}
        <Button
          onClick={onAnalyze}
          variant="primary"
          isLoading={isAnalyzing}
          disabled={!value.trim()}
        >
          Analyze Log 🚀
        </Button>
      </div>
      
      {/* Sample logs */}
      {onLoadSample && (
        <div className="mt-4 pt-4 border-t border-cursor-border">
          <p className="text-xs text-cursor-text mb-2">Quick Test:</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onLoadSample('node')}
              className="text-xs px-3 py-1 bg-cursor-bg hover:bg-gray-700 rounded"
            >
              Node.js Error
            </button>
            <button
              onClick={() => onLoadSample('python')}
              className="text-xs px-3 py-1 bg-cursor-bg hover:bg-gray-700 rounded"
            >
              Python Error
            </button>
            <button
              onClick={() => onLoadSample('docker')}
              className="text-xs px-3 py-1 bg-cursor-bg hover:bg-gray-700 rounded"
            >
              Docker Error
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

