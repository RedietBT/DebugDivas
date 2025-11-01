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
    console.log('🤖 Using OpenRouter AI for analysis...')
    
    // Call OpenRouter API
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions', 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'http://localhost:5173', // Your site URL
          'X-Title': 'DevFix.AI' // Your app name
        },
        body: JSON.stringify({
          model: 'openai/gpt-3.5-turbo', // OpenAI GPT-3.5 through OpenRouter
          messages: [
            {
              role: 'user',
              content: request.prompt
            }
          ],
          temperature: 0.7,
          max_tokens: request.maxTokens || 2000
        })
      }
    )

    if (!response.ok) {
      const error = await response.text()
      console.error('❌ OpenRouter API error:', error)
      console.warn('⚠️ Falling back to mock mode')
      return mockAIResponse(request.prompt)
    }

    const data = await response.json()
    
    // Extract text from OpenRouter response (OpenAI format)
    const aiText = data.choices[0]?.message?.content || ''
    
    console.log('✅ OpenRouter AI response received!')
    
    return {
      text: aiText,
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0
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
  
  // Python RecursionError
  if (prompt.includes('RecursionError') || prompt.includes('maximum recursion depth')) {
    return `## Root Cause
Maximum recursion depth exceeded - function calls itself too many times without stopping.

## Explanation
Python has a default recursion limit of 1000 calls. Your function is calling itself infinitely because it's missing a base case to stop the recursion. Every recursive function needs a condition that stops the recursion.

## Fix Code
\`\`\`python
# Add a base case to stop recursion
def factorial(n):
    # Base case - stops recursion
    if n <= 1:
        return 1
    # Recursive case
    return n * factorial(n - 1)

# Or increase recursion limit (not recommended)
import sys
sys.setrecursionlimit(2000)  # Use with caution
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
The function completes without RecursionError and returns the expected result.`
  }

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

  // IndexError (Python)
  if (prompt.includes('IndexError')) {
    return `## Root Cause
Attempting to access a list index that doesn't exist.

## Explanation
In Python, this error occurs when you try to access an index position that is beyond the length of the list. For example, accessing index 5 in a list that only has 3 elements.

## Fix Code
\`\`\`python
my_list = [1, 2, 3]

# Fix: Check list length before accessing
if len(my_list) > index:
    value = my_list[index]
else:
    print(f"Index {index} is out of range")

# Or use try-except
try:
    value = my_list[index]
except IndexError:
    print("Index out of range")
    value = None
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
The script handles list access safely without IndexError.`
  }

  // KeyError (Python)
  if (prompt.includes('KeyError')) {
    return `## Root Cause
Attempting to access a dictionary key that doesn't exist.

## Explanation
This error happens when you try to access a key in a Python dictionary that hasn't been defined. Always check if a key exists before accessing it.

## Fix Code
\`\`\`python
my_dict = {'name': 'John', 'age': 30}

# Fix: Use .get() method
value = my_dict.get('email', 'Not found')

# Or check if key exists
if 'email' in my_dict:
    value = my_dict['email']
else:
    value = 'Default value'
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
Dictionary access is handled safely without KeyError.`
  }

  // SyntaxError (Python/JavaScript)
  if (prompt.includes('SyntaxError')) {
    return `## Root Cause
Invalid syntax in the code - Python/JavaScript cannot parse the code.

## Explanation
This error means there's a mistake in how you've written the code. Common causes include missing colons, parentheses, brackets, or incorrect indentation in Python.

## Fix Code
\`\`\`python
# Common fixes:
# 1. Check for missing colons
if condition:  # Don't forget the colon
    do_something()

# 2. Match parentheses
result = function(arg1, arg2)  # Close all parentheses

# 3. Proper indentation (Python)
def my_function():
    print("Properly indented")  # 4 spaces or 1 tab
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
# or
node your_script.js
\`\`\`

## Success Criteria
Code runs without syntax errors.`
  }

  // CORS Error
  if (prompt.includes('CORS') || prompt.includes('Cross-Origin')) {
    return `## Root Cause
Cross-Origin Resource Sharing (CORS) policy blocking the request.

## Explanation
The browser is blocking your request because the server hasn't allowed cross-origin requests from your domain. This is a security feature.

## Fix Code
\`\`\`javascript
// Frontend: Use a proxy or CORS-enabled endpoint
fetch('https://api.example.com/data', {
  mode: 'cors',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Backend (Express): Enable CORS
const cors = require('cors');
app.use(cors());
\`\`\`

## Commands to Run
\`\`\`bash
npm install cors
npm start
\`\`\`

## Success Criteria
API requests work without CORS errors.`
  }

  // Network/Connection Errors
  if (prompt.includes('ECONNREFUSED') || prompt.includes('Connection refused')) {
    return `## Root Cause
Cannot connect to the server - connection refused.

## Explanation
The application is trying to connect to a server/database that isn't running or is refusing connections. Make sure the server is running on the correct port.

## Fix Code
\`\`\`javascript
// Check if server is running
// Verify correct port and host
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`Server running on port \${PORT}\`);
});
\`\`\`

## Commands to Run
\`\`\`bash
# Start the server first
npm start
# or
python manage.py runserver
\`\`\`

## Success Criteria
Application successfully connects to the server.`
  }

  // 404 Not Found
  if (prompt.includes('404') || prompt.includes('Not Found')) {
    return `## Root Cause
The requested resource or endpoint was not found.

## Explanation
The URL/endpoint you're trying to access doesn't exist on the server. Check the URL spelling and make sure the route is properly defined.

## Fix Code
\`\`\`javascript
// Backend: Define the route
app.get('/api/users', (req, res) => {
  res.json({ users: [] });
});

// Frontend: Check URL spelling
fetch('/api/users')  // Correct spelling
\`\`\`

## Commands to Run
\`\`\`bash
# Restart server
npm start
\`\`\`

## Success Criteria
Request returns 200 status instead of 404.`
  }

  // Git Errors
  if (prompt.includes('git') && prompt.includes('fatal')) {
    return `## Root Cause
Git command failed - repository or configuration issue.

## Explanation
Common git errors include: not being in a git repository, merge conflicts, or authentication issues.

## Fix Code
\`\`\`bash
# Initialize git if needed
git init

# Fix merge conflicts
git status
# Edit conflicted files
git add .
git commit -m "Resolved conflicts"

# Update remote URL
git remote set-url origin https://github.com/user/repo.git
\`\`\`

## Commands to Run
\`\`\`bash
git status
git log --oneline
\`\`\`

## Success Criteria
Git commands work without errors.`
  }

  // Memory/Heap Errors
  if (prompt.includes('heap') || prompt.includes('memory')) {
    return `## Root Cause
Out of memory error - application using too much RAM.

## Explanation
Your application is trying to use more memory than available. This often happens with large data processing, memory leaks, or infinite loops.

## Fix Code
\`\`\`javascript
// Increase Node.js memory limit
// Or optimize memory usage
const data = [];
// Process in chunks instead of all at once
for (let i = 0; i < total; i += CHUNK_SIZE) {
  processChunk(data.slice(i, i + CHUNK_SIZE));
}
\`\`\`

## Commands to Run
\`\`\`bash
# Increase Node.js memory
node --max-old-space-size=4096 app.js
\`\`\`

## Success Criteria
Application runs without memory errors.`
  }

  // Python IndentationError
  if (prompt.includes('IndentationError')) {
    return `## Root Cause
Incorrect indentation in Python code.

## Explanation
Python uses indentation to define code blocks. This error occurs when you mix tabs and spaces, or have inconsistent indentation levels.

## Fix Code
\`\`\`python
# Use consistent indentation (4 spaces recommended)
def my_function():
    if condition:
        do_something()  # 4 spaces
        do_more()       # 4 spaces
    else:
        do_else()       # 4 spaces
\`\`\`

## Commands to Run
\`\`\`bash
# Use autopep8 to fix indentation
pip install autopep8
autopep8 --in-place --aggressive your_file.py
python your_file.py
\`\`\`

## Success Criteria
Code runs without indentation errors.`
  }

  // Python AttributeError
  if (prompt.includes('AttributeError')) {
    return `## Root Cause
Attempting to access an attribute that doesn't exist on an object.

## Explanation
You're trying to access a method or property that the object doesn't have. This often happens with None values or when using the wrong object type.

## Fix Code
\`\`\`python
# Check if attribute exists
if hasattr(obj, 'attribute_name'):
    value = obj.attribute_name
else:
    value = default_value

# Or use getattr with default
value = getattr(obj, 'attribute_name', default_value)

# Check for None
if obj is not None:
    value = obj.attribute_name
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
Attribute access is handled safely without AttributeError.`
  }

  // Python FileNotFoundError
  if (prompt.includes('FileNotFoundError') || prompt.includes('No such file or directory')) {
    return `## Root Cause
Python cannot find the specified file.

## Explanation
The file path is incorrect, the file doesn't exist, or you're in the wrong directory. Always check file paths are correct and relative to your script location.

## Fix Code
\`\`\`python
import os

# Check if file exists before opening
file_path = 'data.txt'
if os.path.exists(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
else:
    print(f"File not found: {file_path}")
    # Create file or use absolute path
    file_path = os.path.abspath(file_path)
\`\`\`

## Commands to Run
\`\`\`bash
# Check current directory
pwd
# List files
ls -la
# Run script
python your_script.py
\`\`\`

## Success Criteria
File is found and opened successfully.`
  }

  // Python ValueError
  if (prompt.includes('ValueError')) {
    return `## Root Cause
Function received an argument with the right type but inappropriate value.

## Explanation
This occurs when you pass a value that's the correct type but not in the valid range or format, like trying to convert "abc" to an integer.

## Fix Code
\`\`\`python
# Use try-except to handle conversion errors
try:
    number = int(user_input)
except ValueError:
    print("Invalid number format")
    number = 0  # default value

# Validate before conversion
if user_input.isdigit():
    number = int(user_input)
else:
    print("Please enter a valid number")
\`\`\`

## Commands to Run
\`\`\`bash
python your_script.py
\`\`\`

## Success Criteria
Value conversions are handled with proper validation.`
  }

  // Python ImportError
  if (prompt.includes('ImportError') && !prompt.includes('ModuleNotFoundError')) {
    return `## Root Cause
Cannot import a specific name from a module.

## Explanation
The module exists but the specific function/class you're trying to import doesn't exist or has been renamed in newer versions.

## Fix Code
\`\`\`python
# Check what's available in the module
import module_name
print(dir(module_name))

# Use alternative import
try:
    from module import new_function as old_function
except ImportError:
    from module import alternative_function as old_function
\`\`\`

## Commands to Run
\`\`\`bash
# Check module version
pip show module_name
# Update if needed
pip install --upgrade module_name
\`\`\`

## Success Criteria
Import works correctly with the right module version.`
  }

  // Docker - Port Already in Use
  if (prompt.includes('port is already allocated') || prompt.includes('address already in use')) {
    return `## Root Cause
Docker cannot bind to the port because it's already in use.

## Explanation
Another process or container is using the same port. You need to either stop that process or use a different port.

## Fix Code
\`\`\`bash
# Find what's using the port
lsof -i :3000
# Or on Windows
netstat -ano | findstr :3000

# Stop the container using the port
docker ps
docker stop <container_id>

# Or change your port mapping
docker run -p 3001:3000 myapp
\`\`\`

## Commands to Run
\`\`\`bash
# Stop all containers
docker stop $(docker ps -q)
# Remove stopped containers
docker rm $(docker ps -a -q)
# Run with different port
docker run -p 3001:3000 myapp
\`\`\`

## Success Criteria
Docker container starts successfully on the port.`
  }

  // Docker - Permission Denied
  if (prompt.includes('permission denied') && prompt.includes('docker')) {
    return `## Root Cause
Docker permission denied - user not in docker group.

## Explanation
Your user doesn't have permission to access the Docker daemon. You need to either use sudo or add your user to the docker group.

## Fix Code
\`\`\`bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER

# Apply group changes
newgrp docker

# Or run with sudo (not recommended for regular use)
sudo docker run myapp
\`\`\`

## Commands to Run
\`\`\`bash
# Add to docker group
sudo usermod -aG docker $USER
# Log out and back in, then test
docker ps
\`\`\`

## Success Criteria
Can run docker commands without sudo.`
  }

  // Docker - No Space Left
  if (prompt.includes('no space left') || prompt.includes('disk quota exceeded')) {
    return `## Root Cause
Docker ran out of disk space.

## Explanation
Docker images, containers, and volumes have filled up your disk. You need to clean up unused Docker resources.

## Fix Code
\`\`\`bash
# Clean up everything unused
docker system prune -a --volumes

# Remove specific items
docker image prune -a
docker container prune
docker volume prune
docker network prune
\`\`\`

## Commands to Run
\`\`\`bash
# Check disk usage
docker system df
# Clean up (WARNING: removes unused data)
docker system prune -a --volumes
# Rebuild your image
docker build -t myapp .
\`\`\`

## Success Criteria
Docker has enough space to build and run containers.`
  }

  // Docker - Build Context Too Large
  if (prompt.includes('build context') || prompt.includes('Sending build context')) {
    return `## Root Cause
Docker build context is too large.

## Explanation
Docker is trying to send too many files to the build context. Use .dockerignore to exclude unnecessary files.

## Fix Configuration
\`\`\`.dockerignore
# Add this .dockerignore file to your project
node_modules
npm-debug.log
.git
.gitignore
*.md
.env
dist
build
coverage
.vscode
.idea
*.log
\`\`\`

## Commands to Run
\`\`\`bash
# Create .dockerignore file
# Then rebuild
docker build -t myapp .
\`\`\`

## Success Criteria
Docker build completes faster with smaller context.`
  }

  // Docker - Container Exits Immediately
  if (prompt.includes('Exited (0)') || prompt.includes('Exited (1)')) {
    return `## Root Cause
Docker container starts but exits immediately.

## Explanation
The container has no long-running process to keep it alive, or the main command failed. Docker containers need a foreground process.

## Fix Configuration
\`\`\`dockerfile
# Keep container running with a long-lived process
FROM node:18
WORKDIR /app
COPY . .
RUN npm install

# Use a process that doesn't exit
CMD ["npm", "start"]
# Or for debugging
CMD ["tail", "-f", "/dev/null"]
\`\`\`

## Commands to Run
\`\`\`bash
# Check container logs
docker logs <container_id>
# Run interactively for debugging
docker run -it myapp /bin/bash
# Keep container running
docker run -d myapp
\`\`\`

## Success Criteria
Container stays running and logs show no errors.`
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

