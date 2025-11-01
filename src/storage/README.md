# Log Storage - Team Member 4

## Your Mission
Implement persistent storage for error logs with search, filter, and export capabilities.

## Files to Create
- `logStorage.ts` - Save/update/delete logs
- `database.ts` - Storage initialization
- `logRetrieval.ts` - Retrieve logs
- `logSearch.ts` - Search and filter
- `exportImport.ts` - Export/import functionality
- `index.ts` - Barrel exports

## Getting Started

```bash
# Make sure you're on your branch
git checkout -b feature/log-storage
```

## Storage Strategy

You'll use **localStorage** as the primary storage mechanism (simple and works in browser).

### Data Structure
```typescript
// localStorage key: 'devfix_logs'
// Value: JSON stringified array of ErrorLog[]

// localStorage key: 'devfix_config'
// Value: StorageConfig
```

## Example Implementation

```typescript
import { ErrorLog, SearchFilters } from '@/types'

const STORAGE_KEY = 'devfix_logs'
const MAX_LOGS = 1000

/**
 * Save a new error log to storage
 */
export async function saveLog(log: ErrorLog): Promise<void> {
  try {
    const existingLogs = await getAllLogs()
    
    // Add new log at the beginning
    const updatedLogs = [log, ...existingLogs]
    
    // Limit to MAX_LOGS
    if (updatedLogs.length > MAX_LOGS) {
      updatedLogs.splice(MAX_LOGS)
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs))
    
    console.log('Log saved successfully:', log.id)
  } catch (error) {
    console.error('Failed to save log:', error)
    throw new Error('Storage quota exceeded or localStorage unavailable')
  }
}

/**
 * Get all logs from storage
 */
export async function getAllLogs(): Promise<ErrorLog[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) return []
    
    const logs = JSON.parse(data)
    
    // Convert timestamp strings back to Date objects
    return logs.map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp)
    }))
  } catch (error) {
    console.error('Failed to retrieve logs:', error)
    return []
  }
}

/**
 * Delete a log by ID
 */
export async function deleteLog(id: string): Promise<void> {
  const logs = await getAllLogs()
  const filteredLogs = logs.filter(log => log.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLogs))
}

/**
 * Update an existing log
 */
export async function updateLog(id: string, updates: Partial<ErrorLog>): Promise<void> {
  const logs = await getAllLogs()
  const updatedLogs = logs.map(log => 
    log.id === id ? { ...log, ...updates } : log
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs))
}
```

## Search Example

```typescript
export async function searchLogs(filters: SearchFilters): Promise<ErrorLog[]> {
  let logs = await getAllLogs()
  
  // Filter by log type
  if (filters.logType) {
    logs = logs.filter(log => log.logType === filters.logType)
  }
  
  // Filter by date range
  if (filters.dateFrom) {
    logs = logs.filter(log => log.timestamp >= filters.dateFrom!)
  }
  
  if (filters.dateTo) {
    logs = logs.filter(log => log.timestamp <= filters.dateTo!)
  }
  
  // Filter by search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    logs = logs.filter(log => 
      log.rawLog.toLowerCase().includes(term) ||
      log.analysis?.rootCause.toLowerCase().includes(term)
    )
  }
  
  // Filter by favorites
  if (filters.isFavorite !== undefined) {
    logs = logs.filter(log => log.isFavorite === filters.isFavorite)
  }
  
  return logs
}
```

## Export Example

```typescript
import { ExportData, ErrorLog } from '@/types'

export function exportLogs(logs: ErrorLog[]): ExportData {
  return {
    version: '1.0.0',
    exportDate: new Date(),
    logs: logs
  }
}

export function downloadAsJSON(data: ExportData, filename: string = 'devfix-logs.json') {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  URL.revokeObjectURL(url)
}
```

Good luck! 💾

