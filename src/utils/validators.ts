// Team Member 5: Utilities
// Input validation functions

import { ExportData, ErrorLog } from '@/types'

/**
 * Validate log input
 */
export function validateLogInput(log: string): { valid: boolean; error?: string } {
  if (!log || log.trim().length === 0) {
    return { valid: false, error: 'Log input cannot be empty' }
  }

  if (log.length < 10) {
    return { valid: false, error: 'Log input is too short' }
  }

  if (log.length > 100000) {
    return { valid: false, error: 'Log input is too large (max 100KB)' }
  }

  return { valid: true }
}

/**
 * Validate export data structure
 */
export function validateExportData(data: any): { valid: boolean; error?: string } {
  if (!data) {
    return { valid: false, error: 'Export data is empty' }
  }

  if (!data.version) {
    return { valid: false, error: 'Missing version field' }
  }

  if (!data.logs || !Array.isArray(data.logs)) {
    return { valid: false, error: 'Invalid logs array' }
  }

  // Validate each log
  for (const log of data.logs) {
    const logValidation = validateErrorLog(log)
    if (!logValidation.valid) {
      return logValidation
    }
  }

  return { valid: true }
}

/**
 * Validate error log object
 */
export function validateErrorLog(log: any): { valid: boolean; error?: string } {
  if (!log.id) {
    return { valid: false, error: 'Log missing ID' }
  }

  if (!log.timestamp) {
    return { valid: false, error: 'Log missing timestamp' }
  }

  if (!log.logType) {
    return { valid: false, error: 'Log missing type' }
  }

  if (!log.rawLog) {
    return { valid: false, error: 'Log missing raw content' }
  }

  return { valid: true }
}

/**
 * Sanitize log input (remove dangerous content)
 */
export function sanitizeLogInput(log: string): string {
  // Remove any potential XSS attempts
  return log
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/javascript:/gi, '')
}

