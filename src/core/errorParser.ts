// Team Member 2: Core Logic
// Error parsing and extraction

/**
 * Parses error log to extract key information
 */
export function parseError(log: string) {
  // TODO: Implement full parsing logic
  // Extract: file paths, line numbers, error messages, stack traces
  
  return {
    errorMessage: extractErrorMessage(log),
    stackTrace: extractStackTrace(log),
    filePath: extractFilePath(log),
    lineNumber: extractLineNumber(log)
  }
}

function extractErrorMessage(log: string): string {
  // Try to find error message patterns
  const patterns = [
    /Error:\s*(.+)/,
    /Exception:\s*(.+)/,
    /Failed:\s*(.+)/,
  ]
  
  for (const pattern of patterns) {
    const match = log.match(pattern)
    if (match) return match[1].trim()
  }
  
  return log.split('\n')[0].trim()
}

function extractStackTrace(log: string): string[] {
  const lines = log.split('\n')
  const stackLines: string[] = []
  
  for (const line of lines) {
    if (line.includes('at ') || line.includes('File "')) {
      stackLines.push(line.trim())
    }
  }
  
  return stackLines
}

function extractFilePath(log: string): string | null {
  const patterns = [
    /at\s+.*\((.*?):\d+:\d+\)/,  // Node.js
    /File "(.*?)",\s*line/,       // Python
    /in\s+(\/.*?):\d+/            // General
  ]
  
  for (const pattern of patterns) {
    const match = log.match(pattern)
    if (match) return match[1]
  }
  
  return null
}

function extractLineNumber(log: string): number | null {
  const match = log.match(/:(\d+):\d+/)
  return match ? parseInt(match[1]) : null
}

