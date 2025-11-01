// Team Member 4: Log Storage
// Core storage operations

import { ErrorLog } from '@/types'
import { getAllLogs } from './logRetrieval'

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
 * Update an existing log
 */
export async function updateLog(id: string, updates: Partial<ErrorLog>): Promise<void> {
  const logs = await getAllLogs()
  const updatedLogs = logs.map(log => 
    log.id === id ? { ...log, ...updates } : log
  )
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLogs))
  console.log('Log updated:', id)
}

/**
 * Delete a log by ID
 */
export async function deleteLog(id: string): Promise<void> {
  const logs = await getAllLogs()
  const filteredLogs = logs.filter(log => log.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredLogs))
  console.log('Log deleted:', id)
}

/**
 * Clear all logs
 */
export async function clearAllLogs(): Promise<void> {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  console.log('All logs cleared')
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(id: string): Promise<void> {
  const logs = await getAllLogs()
  const log = logs.find(l => l.id === id)
  if (log) {
    await updateLog(id, { isFavorite: !log.isFavorite })
  }
}

