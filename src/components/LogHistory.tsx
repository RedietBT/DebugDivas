// Team Member 1: UI Components
// TODO: Implement log history display
// See TEAM_TASKS.md for requirements

import React, { useState, useMemo } from 'react'
import { ErrorLog, SearchFilters, LogType } from '@/types'
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
  const [filterType, setFilterType] = useState<LogType | 'all'>('all')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  // Get unique categories and types
  const categories = useMemo(() => {
    const cats = new Set<string>()
    logs.forEach(log => {
      log.tags.forEach(tag => cats.add(tag))
    })
    return Array.from(cats)
  }, [logs])

  const types = useMemo(() => {
    const typeSet = new Set<LogType>()
    logs.forEach(log => typeSet.add(log.logType))
    return Array.from(typeSet)
  }, [logs])

  // Filter logs
  const filteredLogs = useMemo(() => {
    let filtered = logs

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(log => log.logType === filterType)
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(log => log.tags.includes(filterCategory))
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(log => 
        log.rawLog.toLowerCase().includes(term) ||
        log.analysis?.rootCause?.toLowerCase().includes(term)
      )
    }

    return filtered
  }, [logs, filterType, filterCategory, searchTerm])

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ searchTerm })
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="flex-1 bg-cursor-bg border border-cursor-border rounded px-4 py-2 text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-cursor-accent"
            />
            {onReload && (
              <button
                onClick={onReload}
                className="text-sm text-cursor-text hover:text-white px-4 py-2"
              >
                ↻ Reload
              </button>
            )}
          </div>
          
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="text-xs text-cursor-text mb-1 block">Filter by Language:</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as LogType | 'all')}
                className="w-full bg-cursor-bg border border-cursor-border rounded px-3 py-2 text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-cursor-accent"
              >
                <option value="all">All Languages</option>
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div className="flex-1">
              <label className="text-xs text-cursor-text mb-1 block">Filter by Category:</label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full bg-cursor-bg border border-cursor-border rounded px-3 py-2 text-sm text-cursor-text focus:outline-none focus:ring-2 focus:ring-cursor-accent"
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            {(filterType !== 'all' || filterCategory !== 'all' || searchTerm) && (
              <button
                onClick={() => {
                  setFilterType('all')
                  setFilterCategory('all')
                  setSearchTerm('')
                }}
                className="text-xs text-red-400 hover:text-red-300 mt-5"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{logs.length}</div>
            <div className="text-xs text-cursor-text">Total Logs</div>
          </div>
        </Card>
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{filteredLogs.length}</div>
            <div className="text-xs text-cursor-text">Filtered</div>
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
            <div className="text-2xl font-bold text-white">{categories.length}</div>
            <div className="text-xs text-cursor-text">Categories</div>
          </div>
        </Card>
      </div>

      {/* Log List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card>
            <p className="text-center text-cursor-text py-8">
              No logs saved yet. Analyze an error to get started!
            </p>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card key={log.id} className="hover:border-cursor-accent cursor-pointer transition-colors">
              <div onClick={() => setSelectedLog(log)}>
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <span className="text-xs px-2 py-1 bg-cursor-accent rounded text-white">
                        {log.logType}
                      </span>
                      {log.tags.map((tag, idx) => (
                        <span key={idx} className="text-xs px-2 py-1 bg-blue-600 rounded text-white">
                          📂 {tag}
                        </span>
                      ))}
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

