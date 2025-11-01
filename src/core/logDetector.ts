// Team Member 2: Core Logic
// Log type detection system

import { LogType, DetectionResult } from '@/types'

/**
 * Detects the type of log based on content patterns
 * Returns the log type with confidence score
 */
export function detectLogType(log: string): DetectionResult {
  // TODO: Implement full detection logic
  // See src/core/README.md for requirements
  
  const patterns: Record<LogType, RegExp[]> = {
    node: [
      /TypeError/,
      /ReferenceError/,
      /at\s+.*\(.*:\d+:\d+\)/,
      /SyntaxError/,
      /RangeError/
    ],
    python: [
      /Traceback \(most recent call last\)/,
      /File ".*", line \d+/,
      /ModuleNotFoundError/,
      /ImportError/,
      /IndentationError/
    ],
    docker: [
      /failed to solve/,
      /Dockerfile/,
      /ERROR \[/,
      /docker build/,
      /COPY failed/
    ],
    github_actions: [
      /Error: Process completed with exit code/,
      /##\[error\]/,
      /github\.com\/actions/,
      /workflow/i
    ],
    vercel: [
      /Build failed/,
      /Command ".*" exited with/,
      /vercel/i,
      /deployment/i
    ],
    nginx: [
      /nginx/i,
      /\d{3}\s+(Bad Gateway|Internal Server Error)/,
      /upstream/
    ],
    general: []
  }

  let bestMatch: LogType = 'general'
  let highestConfidence = 0
  let matchedPatterns: string[] = []

  // Check each log type
  for (const [type, regexList] of Object.entries(patterns) as [LogType, RegExp[]][]) {
    if (type === 'general') continue
    
    let matches = 0
    const currentMatches: string[] = []
    
    for (const regex of regexList) {
      if (regex.test(log)) {
        matches++
        currentMatches.push(regex.source)
      }
    }

    const confidence = regexList.length > 0 
      ? (matches / regexList.length) * 100 
      : 0

    if (confidence > highestConfidence) {
      highestConfidence = confidence
      bestMatch = type
      matchedPatterns = currentMatches
    }
  }

  return {
    logType: bestMatch,
    confidence: Math.round(highestConfidence),
    patterns: matchedPatterns
  }
}

