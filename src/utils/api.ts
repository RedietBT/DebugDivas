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
 * Uses Google Gemini API for real AI responses
 */
export async function callAI(request: AIRequest): Promise<AIResponse> {
  // Get API key from environment
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  
  // If no API key, fall back to mock mode
  if (!apiKey || apiKey === 'your-api-key-here') {
    console.warn('⚠️ No Gemini API key found. Using mock mode.')
    console.warn('📝 See GEMINI_SETUP.md for setup instructions')
    return mockAIResponse(request.prompt)
  }

  try {
    console.log('🤖 Using Gemini AI for analysis...')
    
    // Call Google Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: request.prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: request.maxTokens || 2000,
          }
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ Gemini API error:', error)
      console.warn('⚠️ Falling back to mock mode')
      return mockAIResponse(request.prompt)
    }

    const data = await response.json()
    
    // Extract text from Gemini response
    const aiText = data.candidates[0]?.content?.parts[0]?.text || ''
    
    console.log('✅ Gemini AI response received!')
    
    return {
      text: aiText,
      usage: {
        promptTokens: data.usageMetadata?.promptTokenCount || 0,
        completionTokens: data.usageMetadata?.candidatesTokenCount || 0
      }
    }
    
  } catch (error) {
    console.error('❌ Error calling Gemini API:', error)
    console.warn('⚠️ Falling back to mock mode')
    return mockAIResponse(request.prompt)
  }
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
  
  // Python ZeroDivisionError
  if (prompt.includes('ZeroDivisionError')) {
    return `## Root Cause
Division by zero - attempting to divide a number by zero.

## Explanation
Python raises a ZeroDivisionError when you try to divide a number by zero. In your code, the variable 'x' is set to 0, and then you're trying to divide 'y' by 'x' (y/x), which causes this error. You need to add a check to ensure the divisor is not zero before performing the division.

## Fix Code
\`\`\`python
x = 0
y = 3

# Fix: Add a check before division
if x != 0:
    z = y / x
    print(z)
else:
    print("Error: Cannot divide by zero")
    # Or set a default value
    z = 0
    print(f"z set to default: {z}")
\`\`\`

## Commands to Run
\`\`\`bash
python rock_paper_scissor_game.py
\`\`\`

## Success Criteria
The script runs without ZeroDivisionError and handles the zero division case gracefully by either showing an error message or using a default value.`
  }
  
  // Python Traceback (general)
  if (prompt.includes('Traceback') && !prompt.includes('ZeroDivisionError')) {
    return `## Root Cause
Python runtime error detected in the code execution.

## Explanation
The Python interpreter encountered an error while running your script. Check the traceback to identify the exact line and error type. Common issues include undefined variables, incorrect indentation, type mismatches, or logic errors.

## Fix Code
\`\`\`python
# Review the specific line mentioned in the traceback
# Common fixes:
# 1. Check variable names and initialization
# 2. Verify correct indentation
# 3. Add try-except blocks for error handling

try:
    # Your code here
    pass
except Exception as e:
    print(f"Error occurred: {e}")
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
The script executes without errors and handles edge cases properly.`
  }
  
  // Node.js TypeError
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
  
  // Python ModuleNotFoundError
  if (prompt.includes('ModuleNotFoundError')) {
    return `## Root Cause
Required Python module is not installed in the environment.

## Explanation
The Python script is trying to import a module that isn't installed in your current Python environment. You need to install the missing package using pip.

## Fix Code
\`\`\`python
# No code changes needed
# Just install the missing package
\`\`\`

## Commands to Run
\`\`\`bash
# Install the missing package
pip install pandas
# Or if using requirements.txt
pip install -r requirements.txt
# Then run your script
python app.py
\`\`\`

## Success Criteria
The module imports successfully and the script runs without ModuleNotFoundError.`
  }
  
  // Node.js Cannot find module
  if (prompt.includes('Cannot find module')) {
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

