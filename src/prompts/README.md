# AI Prompts - Team Member 3

## Your Mission
Create the AI prompts and response parsing logic that turns errors into fixes.

## Files to Create
- `systemPrompts.ts` - System prompts for each log type
- `promptTemplates.ts` - Prompt template builders
- `responseParser.ts` - Parse AI responses
- `fixGenerator.ts` - Generate fix suggestions
- `sampleLogs.ts` - Demo error logs
- `index.ts` - Barrel exports

## Getting Started

```bash
# Make sure you're on your branch
git checkout -b feature/ai-prompts
```

## Example System Prompt

```typescript
import { LogType, PromptTemplate } from '@/types'

export const SYSTEM_PROMPTS: Record<LogType, string> = {
  node: `You are DevFix.AI, an expert Node.js debugging assistant.

When given a Node.js error log, you must:
1. Identify the root cause
2. Explain what went wrong in simple terms
3. Provide a code fix
4. Suggest commands to resolve the issue
5. Define success criteria

Format your response EXACTLY as:

## Root Cause
[One sentence summary]

## Explanation
[2-3 sentences explaining what happened and why]

## Fix Code
\`\`\`javascript
// Fixed code here
\`\`\`

## Commands to Run
\`\`\`bash
# Command 1
# Command 2
\`\`\`

## Success Criteria
[How to verify the fix worked]

Be concise and actionable.`,

  python: `You are DevFix.AI, an expert Python debugging assistant...`,
  
  docker: `You are DevFix.AI, an expert Docker troubleshooting assistant...`,
  
  // ... other types
}

export const buildPrompt = (logType: LogType, errorLog: string): string => {
  const systemPrompt = SYSTEM_PROMPTS[logType] || SYSTEM_PROMPTS.general
  
  return `${systemPrompt}

Here is the error log to analyze:

\`\`\`
${errorLog}
\`\`\`

Provide your analysis:`
}
```

## Sample Logs Example

```typescript
export const SAMPLE_LOGS = {
  node: {
    error: `TypeError: Cannot read property 'name' of undefined
    at getUserName (/app/server.js:45:23)
    at processRequest (/app/server.js:89:15)
    at Server.<anonymous> (/app/server.js:120:5)`,
    
    expectedFix: {
      rootCause: "Accessing property on undefined object",
      // ... expected analysis
    }
  },
  
  python: {
    error: `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    import pandas
ModuleNotFoundError: No module named 'pandas'`,
    
    expectedFix: {
      rootCause: "Missing Python package",
      // ...
    }
  },
  // ... more samples
}
```

Good luck! 🤖

