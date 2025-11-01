import React, { useState, useMemo } from 'react'
import { ErrorLog, SearchFilters, LogType } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { RefreshCw, Star, Trash2, X } from 'lucide-react'

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

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search logs..."
              className="flex-1"
            />
            {onReload && (
              <Button
                onClick={onReload}
                variant="outline"
                size="icon"
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Language:</label>
              <Select value={filterType} onValueChange={(v) => setFilterType(v as LogType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Languages</SelectItem>
                  {types.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Filter by Category:</label>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {(filterType !== 'all' || filterCategory !== 'all' || searchTerm) && (
            <Button
              onClick={() => {
                setFilterType('all')
                setFilterCategory('all')
                setSearchTerm('')
              }}
              variant="ghost"
              size="sm"
            >
              Clear Filters
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{logs.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Total Logs</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{filteredLogs.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Filtered</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">
              {logs.filter(l => l.isFavorite).length}
            </div>
            <div className="text-xs text-muted-foreground mt-1">Favorites</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold">{categories.length}</div>
            <div className="text-xs text-muted-foreground mt-1">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Log List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No logs saved yet. Analyze an error to get started!
            </CardContent>
          </Card>
        ) : (
          filteredLogs.map((log) => (
            <Card 
              key={log.id} 
              className="hover:border-primary cursor-pointer transition-colors"
              onClick={() => setSelectedLog(log)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center flex-wrap gap-2 mb-2">
                      <Badge>{log.logType}</Badge>
                      {log.tags.map((tag, idx) => (
                        <Badge key={idx} variant="secondary">{tag}</Badge>
                      ))}
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm line-clamp-2">
                      {log.analysis?.rootCause || 'Analyzing...'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {onToggleFavorite && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          onToggleFavorite(log.id)
                        }}
                      >
                        <Star className={`h-4 w-4 ${log.isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation()
                          if (confirm('Delete this log?')) {
                            onDelete(log.id)
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 font-mono">
                  {log.rawLog}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Selected Log Detail Modal */}
      {selectedLog && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedLog(null)}
        >
          <Card
            className="max-w-3xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Log Details</CardTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedLog(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Type</p>
                <Badge>{selectedLog.logType}</Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Raw Log</p>
                <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                  <code className="font-mono">{selectedLog.rawLog}</code>
                </pre>
              </div>
              {selectedLog.analysis && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Root Cause</p>
                    <p>{selectedLog.analysis.rootCause}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Explanation</p>
                    <p className="text-muted-foreground">{selectedLog.analysis.explanation}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
