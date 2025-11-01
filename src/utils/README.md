# Utilities & Integration - Team Member 5

## Your Mission
Build helper utilities and integrate all components together.

## Files to Create
- `api.ts` - AI API integration
- `config.ts` - App configuration
- `clipboard.ts` - Clipboard operations
- `fileSystem.ts` - File operations (optional)
- `helpers.ts` - General helper functions
- `validators.ts` - Input validation
- `index.ts` - Barrel exports

## Getting Started

```bash
# Make sure you're on your branch
git checkout -b feature/utilities
```

## Example Implementations

### API Integration (api.ts)

```typescript
import { Analysis, LogType } from '@/types'

interface AIRequest {
  prompt: string
  maxTokens?: number
}

interface AIResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

/**
 * Call AI API to analyze error log
 * Note: This is a mock implementation. In production, integrate with Cursor API or OpenAI
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  // Mock mode for development
  if (process.env.NODE_ENV === 'development') {
    return mockAIResponse(request.prompt)
  }

  // TODO: Integrate with actual AI API
  // Example with OpenAI:
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAPIKey()}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: request.prompt }],
      max_tokens: request.maxTokens || 1000
    })
  })
  
  const data = await response.json()
  return {
    text: data.choices[0].message.content,
    usage: data.usage
  }
  */
  
  throw new Error('AI API not configured')
}

function mockAIResponse(prompt: string): Promise<AIResponse> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        text: `## Root Cause
Missing dependency or configuration error

## Explanation
The error indicates that a required module or package is not installed or properly configured in your project.

## Fix Code
\`\`\`bash
npm install <package-name>
\`\`\`

## Commands to Run
\`\`\`bash
npm install
npm start
\`\`\`

## Success Criteria
The application starts without errors and all imports resolve correctly.`
      })
    }, 1000) // Simulate network delay
  })
}
```

### Clipboard Utilities (clipboard.ts)

```typescript
/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textarea = document.createElement('textarea')
      textarea.value = text
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const success = document.execCommand('copy')
      document.body.removeChild(textarea)
      return success
    }
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

/**
 * Read from clipboard
 */
export async function pasteFromClipboard(): Promise<string | null> {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      return await navigator.clipboard.readText()
    }
    return null
  } catch (error) {
    console.error('Failed to read from clipboard:', error)
    return null
  }
}
```

### Helper Functions (helpers.ts)

```typescript
/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

/**
 * Truncate text with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength - 3) + '...'
}

/**
 * Debounce function calls
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

/**
 * Sleep/delay function
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

### Configuration (config.ts)

```typescript
import { StorageConfig } from '@/types'

export const APP_CONFIG = {
  name: 'DevFix.AI',
  version: '1.0.0',
  author: 'DebugDivas',
  
  storage: {
    maxLogs: 1000,
    storageType: 'localStorage',
    autoSave: true
  } as StorageConfig,
  
  ai: {
    provider: 'mock', // 'openai' | 'cursor' | 'mock'
    maxTokens: 1000,
    temperature: 0.7
  },
  
  ui: {
    theme: 'dark',
    animationsEnabled: true,
    defaultTab: 'analyze'
  }
}

export function getConfig<K extends keyof typeof APP_CONFIG>(key: K): typeof APP_CONFIG[K] {
  return APP_CONFIG[key]
}
```

## Integration Task

You'll also need to integrate everything in `src/App.tsx`. Here's a skeleton:

```typescript
import { useState } from 'react'
import { LogInputPanel, AnalysisResult, LogHistory } from '@/components'
import { detectLogType } from '@/core'
import { buildPrompt, parseResponse } from '@/prompts'
import { saveLog, getAllLogs } from '@/storage'
import { callAI, generateId } from '@/utils'
import { ErrorLog, Analysis } from '@/types'

function App() {
  const [currentLog, setCurrentLog] = useState('')
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleAnalyze = async () => {
    setIsAnalyzing(true)
    
    try {
      // 1. Detect log type
      const detection = detectLogType(currentLog)
      
      // 2. Build prompt
      const prompt = buildPrompt(detection.logType, currentLog)
      
      // 3. Call AI
      const response = await callAI({ prompt })
      
      // 4. Parse response
      const parsedAnalysis = parseResponse(response.text)
      
      // 5. Save to storage
      const errorLog: ErrorLog = {
        id: generateId(),
        timestamp: new Date(),
        logType: detection.logType,
        rawLog: currentLog,
        analysis: parsedAnalysis,
        tags: [],
        isFavorite: false
      }
      
      await saveLog(errorLog)
      
      // 6. Update UI
      setAnalysis(parsedAnalysis)
    } catch (error) {
      console.error('Analysis failed:', error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    // ... UI components
  )
}
```

Good luck! 🔧

