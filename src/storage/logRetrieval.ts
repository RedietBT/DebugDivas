// Team Member 4: Log Storage
// Log retrieval functions

import { ErrorLog } from '@/types'

const STORAGE_KEY = 'devfix_logs'

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
 * Get a single log by ID
 */
export async function getLogById(id: string): Promise<ErrorLog | null> {
  const logs = await getAllLogs()
  return logs.find(log => log.id === id) || null
}

/**
 * Get recent logs (limited)
 */
export async function getRecentLogs(limit: number = 10): Promise<ErrorLog[]> {
  const logs = await getAllLogs()
  return logs.slice(0, limit)
}

/**
 * Get logs by type
 */
export async function getLogsByType(logType: string): Promise<ErrorLog[]> {
  const logs = await getAllLogs()
  return logs.filter(log => log.logType === logType)
}

/**
 * Get favorite logs
 */
export async function getFavoriteLogs(): Promise<ErrorLog[]> {
  const logs = await getAllLogs()
  return logs.filter(log => log.isFavorite)
}

