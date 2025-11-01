// Team Member 4: Log Storage
// Search and filter functionality

import { ErrorLog, SearchFilters } from '@/types'
import { getAllLogs } from './logRetrieval'

/**
 * Search logs with filters
 */
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
  
  // Filter by search term (searches in raw log and root cause)
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase()
    logs = logs.filter(log => 
      log.rawLog.toLowerCase().includes(term) ||
      log.analysis?.rootCause?.toLowerCase().includes(term) ||
      log.analysis?.explanation?.toLowerCase().includes(term)
    )
  }
  
  // Filter by tags
  if (filters.tags && filters.tags.length > 0) {
    logs = logs.filter(log => 
      filters.tags!.some(tag => log.tags.includes(tag))
    )
  }
  
  // Filter by favorites
  if (filters.isFavorite !== undefined) {
    logs = logs.filter(log => log.isFavorite === filters.isFavorite)
  }
  
  return logs
}

