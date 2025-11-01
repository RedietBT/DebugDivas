// Team Member 1: UI Components
// TODO: Implement log history display
// See TEAM_TASKS.md for requirements

import React, { useState } from 'react'
import { ErrorLog, SearchFilters } from '@/types'
import { Card } from './Card'
import { Button } from './Button'

interface LogHistoryProps {
  logs: ErrorLog[]
  onSearch?: (filters: SearchFilters) => void
  onReload?: () => void
  onDelete?: (id: string) => void
  onToggleFavorite?: (id: string) => void
}

export const LogHistory: React.FC<LogHistoryProps> = ({
  logs,
  onSearch,
  onReload,
  onDelete,
  onToggleFavorite
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null)

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ searchTerm })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search logs..."
            className="flex-1 bg-cursor-bg border border-cursor-border rounded px-4 py-2 text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-cursor-accent"
          />
          <Button onClick={handleSearch}>Search</Button>
          {onReload && (
            <button
              onClick={onReload}
              className="text-sm text-cursor-text hover:text-white"
            >
              ↻ Reload
            </button>
          )}
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{logs.length}</div>
            <div className="text-xs text-cursor-text">Total Logs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {logs.filter(l => l.isFavorite).length}
            </div>
            <div className="text-xs text-cursor-text">Favorites</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">
              {new Set(logs.map(l => l.logType)).size}
            </div>
            <div className="text-xs text-cursor-text">Log Types</div>
          </div>
        </Card>
      </div>

      {/* Log List */}
      <div className="space-y-3">
        {logs.length === 0 ? (
          <Card>
            <p className="text-center text-cursor-text py-8">
              No logs saved yet. Analyze an error to get started!
            </p>
          </Card>
        ) : (
          logs.map((log) => (
            <Card key={log.id} className="hover:border-cursor-accent cursor-pointer transition-colors">
              <div onClick={() => setSelectedLog(log)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs px-2 py-1 bg-cursor-accent rounded text-white">
                        {log.logType}
                      </span>
                      <span className="text-xs text-cursor-text">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-white line-clamp-2">
                      {log.analysis?.rootCause || 'Analyzing...'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(log.id)
                        }}
                        className="text-lg"
                      >
                        {log.isFavorite ? '⭐' : '☆'}
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this log?')) {
                            onDelete(log.id)
                          }
                        }}
                        className="text-red-500 text-sm hover:text-red-400"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-cursor-text line-clamp-1 font-mono">
                  {log.rawLog}
                </p>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Selected Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLog(null)}
        >
          <div
            className="bg-cursor-panel border border-cursor-border rounded-lg p-6 max-w-3xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Log Details</h3>
              <button
                onClick={() => setSelectedLog(null)}
                className="text-cursor-text hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-cursor-text mb-1">Type</p>
                <span className="text-xs px-2 py-1 bg-cursor-accent rounded text-white">
                  {selectedLog.logType}
                </span>
              </div>
              <div>
                <p className="text-xs text-cursor-text mb-1">Raw Log</p>
                <pre className="bg-cursor-bg p-3 rounded text-xs overflow-x-auto">
                  {selectedLog.rawLog}
                </pre>
              </div>
              {selectedLog.analysis && (
                <>
                  <div>
                    <p className="text-xs text-cursor-text mb-1">Root Cause</p>
                    <p className="text-white">{selectedLog.analysis.rootCause}</p>
                  </div>
                  <div>
                    <p className="text-xs text-cursor-text mb-1">Explanation</p>
                    <p className="text-cursor-text">{selectedLog.analysis.explanation}</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

