# Core Logic - Team Member 2

## Your Mission
Build the detection and parsing logic that identifies error types and extracts key information.

## Files to Create
- `logDetector.ts` - Detect log types
- `errorParser.ts` - Parse error details
- `analyzer.ts` - Main analysis orchestrator
- `patterns.ts` - Regex patterns for detection
- `categories.ts` - Error categorization
- `index.ts` - Barrel exports

## Getting Started

```bash
# Make sure you're on your branch
git checkout -b feature/core-logic

# Create test file
npm test
```

## Example Function

```typescript
import { LogType, DetectionResult } from '@/types'

/**
 * Detects the type of log based on content patterns
 */
export function detectLogType(log: string): DetectionResult {
  const patterns = {
    node: [/TypeError/, /ReferenceError/, /at\s+.*\(.*:\d+:\d+\)/],
    python: [/Traceback/, /File ".*", line \d+/, /Error:/],
    docker: [/failed to solve/, /Dockerfile/, /ERROR \[/],
    github_actions: [/Error: Process completed with exit code/, /##\[error\]/],
    vercel: [/Build failed/, /Command ".*" exited with/],
    nginx: [/nginx/, /\d{3}\s+(Bad Gateway|Internal Server Error)/]
  }

  let bestMatch: LogType = 'general'
  let highestConfidence = 0
  let matchedPatterns: string[] = []

  for (const [type, regexList] of Object.entries(patterns)) {
    let matches = 0
    const currentMatches: string[] = []
    
    for (const regex of regexList) {
      if (regex.test(log)) {
        matches++
        currentMatches.push(regex.source)
      }
    }

    const confidence = (matches / regexList.length) * 100

    if (confidence > highestConfidence) {
      highestConfidence = confidence
      bestMatch = type as LogType
      matchedPatterns = currentMatches
    }
  }

  return {
    logType: bestMatch,
    confidence: Math.round(highestConfidence),
    patterns: matchedPatterns
  }
}
```

Good luck! 🧠

