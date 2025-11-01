// Team Member 5: Utilities
// Find similar logs based on error patterns

import { ErrorLog, LogType } from '@/types'

/**
 * Find similar logs from history
 */
export function findSimilarLogs(
  currentLog: string,
  logType: LogType,
  allLogs: ErrorLog[]
): ErrorLog[] {
  if (allLogs.length === 0) return []

  const similarLogs: Array<{ log: ErrorLog; similarity: number }> = []

  // Extract key error patterns from current log
  const currentPatterns = extractErrorPatterns(currentLog)

  for (const log of allLogs) {
    // Skip if different log type
    if (log.logType !== logType && logType !== 'general') continue

    // Calculate similarity score
    const logPatterns = extractErrorPatterns(log.rawLog)
    const similarity = calculateSimilarity(currentPatterns, logPatterns)

    if (similarity > 0.3) {
      // 30% threshold
      similarLogs.push({ log, similarity })
    }
  }

  // Sort by similarity (highest first)
  similarLogs.sort((a, b) => b.similarity - a.similarity)

  // Return top 3 similar logs
  return similarLogs.slice(0, 3).map(item => item.log)
}

/**
 * Extract error patterns from log text
 */
function extractErrorPatterns(log: string): string[] {
  const patterns: string[] = []

  // Extract error types
  const errorTypes = [
    'TypeError',
    'ReferenceError',
    'SyntaxError',
    'ZeroDivisionError',
    'ModuleNotFoundError',
    'IndexError',
    'NameError',
    'ImportError',
    'KeyError',
    'ValueError',
    'RuntimeError',
    'docker',
    'failed to solve',
    'ENOENT',
    'ECONNREFUSED',
    '404',
    '500',
    '502',
  ]

  for (const errorType of errorTypes) {
    if (log.toLowerCase().includes(errorType.toLowerCase())) {
      patterns.push(errorType.toLowerCase())
    }
  }

  // Extract file extensions
  const fileExtensions = log.match(/\.(js|ts|py|jsx|tsx|java|cpp|go|rb)(\b|:)/gi)
  if (fileExtensions) {
    patterns.push(...fileExtensions.map(ext => ext.toLowerCase()))
  }

  // Extract common error keywords
  const keywords = [
    'undefined',
    'null',
    'cannot read',
    'not found',
    'failed',
    'error',
    'exception',
    'traceback',
    'at line',
    'division by zero',
  ]

  for (const keyword of keywords) {
    if (log.toLowerCase().includes(keyword)) {
      patterns.push(keyword)
    }
  }

  return [...new Set(patterns)] // Remove duplicates
}

/**
 * Calculate similarity between two sets of patterns
 */
function calculateSimilarity(patterns1: string[], patterns2: string[]): number {
  if (patterns1.length === 0 || patterns2.length === 0) return 0

  const set1 = new Set(patterns1)
  const set2 = new Set(patterns2)

  // Count common patterns
  let common = 0
  for (const pattern of set1) {
    if (set2.has(pattern)) {
      common++
    }
  }

  // Jaccard similarity
  const union = new Set([...set1, ...set2])
  return common / union.size
}

/**
 * Categorize error by type
 */
export function categorizeError(log: string): string {
  const categories: Record<string, RegExp[]> = {
    'Syntax Error': [/SyntaxError/, /IndentationError/, /ParseError/],
    'Reference Error': [/ReferenceError/, /NameError/, /undefined/],
    'Type Error': [/TypeError/, /AttributeError/],
    'Import/Module Error': [/ModuleNotFoundError/, /ImportError/, /Cannot find module/],
    'Runtime Error': [/RuntimeError/, /ZeroDivisionError/, /IndexError/],
    'Network Error': [/ECONNREFUSED/, /ETIMEDOUT/, /404/, /502/, /fetch failed/],
    'Configuration Error': [/ENOENT/, /config/, /permission denied/],
    'Build Error': [/failed to solve/, /docker/, /build failed/],
  }

  for (const [category, patterns] of Object.entries(categories)) {
    for (const pattern of patterns) {
      if (pattern.test(log)) {
        return category
      }
    }
  }

  return 'Other'
}

