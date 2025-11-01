// Team Member 4: Log Storage
// Export and import functionality

import { ErrorLog, ExportData } from '@/types'
import { getAllLogs } from './logRetrieval'
import { saveLog } from './logStorage'

/**
 * Export selected logs
 */
export function exportLogs(logs: ErrorLog[]): ExportData {
  return {
    version: '1.0.0',
    exportDate: new Date(),
    logs: logs
  }
}

/**
 * Export all logs
 */
export async function exportAllLogs(): ExportData {
  const logs = await getAllLogs()
  return exportLogs(logs)
}

/**
 * Download export data as JSON file
 */
export function downloadLogsAsJSON(data: ExportData, filename: string = 'devfix-logs.json') {
  const jsonStr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  
  URL.revokeObjectURL(url)
}

/**
 * Import logs from export data
 */
export async function importLogs(data: ExportData): Promise<void> {
  // Validate data
  if (!data.version || !data.logs || !Array.isArray(data.logs)) {
    throw new Error('Invalid export data format')
  }

  // TODO: Check version compatibility
  
  // Import each log
  for (const log of data.logs) {
    try {
      // Convert timestamp back to Date if needed
      const logWithDate = {
        ...log,
        timestamp: new Date(log.timestamp)
      }
      await saveLog(logWithDate)
    } catch (error) {
      console.error('Failed to import log:', log.id, error)
    }
  }
  
  console.log(`Imported ${data.logs.length} logs`)
}

/**
 * Parse JSON file from upload
 */
export async function parseImportFile(file: File): Promise<ExportData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data)
      } catch (error) {
        reject(new Error('Invalid JSON file'))
      }
    }
    
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file)
  })
}

