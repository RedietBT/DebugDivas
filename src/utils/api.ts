// Team Member 5: Utilities
// AI API integration

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
 * Currently uses mock mode for development
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  // Mock mode for development and testing
  return mockAIResponse(request.prompt)
  
  // TODO: Integrate with actual AI API (Cursor API, OpenAI, etc.)
  // Uncomment and configure when ready:
  /*
  const apiKey = getAPIKey()
  
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [{ role: 'user', content: request.prompt }],
      max_tokens: request.maxTokens || 1000
    })
  })
  
  if (!response.ok) {
    throw new Error(`AI API error: ${response.statusText}`)
  }
  
  const data = await response.json()
  
  return {
    text: data.choices[0].message.content,
    usage: {
      promptTokens: data.usage.prompt_tokens,
      completionTokens: data.usage.completion_tokens
    }
  }
  */
}

/**
 * Mock AI response for development
 */
function mockAIResponse(prompt: string): Promise<AIResponse> {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      resolve({
        text: generateMockResponse(prompt)
      })
    }, 1500) // 1.5 second delay
  })
}

/**
 * Generate mock response based on prompt content
 */
function generateMockResponse(prompt: string): string {
  // Detect error type from prompt
  if (prompt.includes('TypeError') || prompt.includes('undefined')) {
    return `## Root Cause
Attempting to access a property on an undefined or null object.

## Explanation
This error occurs when trying to read a property from a variable that hasn't been initialized or is undefined. This commonly happens when dealing with asynchronous data or missing null checks.

## Fix Code
\`\`\`javascript
// Add null check before accessing property
const name = user?.name || 'Unknown'
// Or use conditional check
if (user && user.name) {
  console.log(user.name)
}
\`\`\`

## Commands to Run
\`\`\`bash
# No commands needed - this is a code logic fix
node app.js
\`\`\`

## Success Criteria
The application runs without TypeError and handles undefined values gracefully.`
  }
  
  if (prompt.includes('ModuleNotFoundError') || prompt.includes('Cannot find module')) {
    return `## Root Cause
Required dependency is not installed in the project.

## Explanation
The application is trying to import a package that doesn't exist in node_modules. This typically means you need to install the package using npm or yarn.

## Fix Code
\`\`\`javascript
// Make sure package is listed in package.json
// Then run npm install
\`\`\`

## Commands to Run
\`\`\`bash
npm install
# Or install specific package
npm install <package-name>
\`\`\`

## Success Criteria
The application starts successfully and all imports resolve without errors.`
  }
  
  if (prompt.includes('docker') || prompt.includes('Docker')) {
    return `## Root Cause
Docker build failed due to missing dependencies or network issues.

## Explanation
The Docker build process encountered an error, likely due to package installation failure or network connectivity issues in the container.

## Fix Configuration
\`\`\`dockerfile
# Add network retry and update cache
FROM ubuntu:20.04
RUN apt-get update --fix-missing && \\
    apt-get install -y --no-install-recommends python3
\`\`\`

## Commands to Run
\`\`\`bash
docker build --no-cache -t myapp .
docker run myapp
\`\`\`

## Success Criteria
Docker image builds successfully without errors.`
  }
  
  // Default generic response
  return `## Root Cause
Error detected in the application code or configuration.

## Explanation
Based on the error log, there appears to be an issue that needs investigation. Review the stack trace and error message for specific details about what went wrong.

## Fix Code
\`\`\`javascript
// Review the error message and fix the specific issue
// Common fixes:
// 1. Check variable initialization
// 2. Verify imports and dependencies
// 3. Validate configuration files
\`\`\`

## Commands to Run
\`\`\`bash
# Restart the application
npm start
\`\`\`

## Success Criteria
The error no longer appears and the application runs successfully.`
}

