// Team Member 3: AI Prompts
// Sample error logs for testing and demo

export const SAMPLE_LOGS = {
  node: {
    error: `TypeError: Cannot read property 'name' of undefined
    at getUserName (/app/server.js:45:23)
    at processRequest (/app/server.js:89:15)
    at Server.<anonymous> (/app/server.js:120:5)
    at emitTwo (events.js:126:13)`,
    
    description: 'Node.js TypeError - accessing undefined property'
  },
  
  python: {
    error: `Traceback (most recent call last):
  File "app.py", line 12, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'`,
    
    description: 'Python missing module error'
  },
  
  docker: {
    error: `ERROR [3/5] RUN apt-get update && apt-get install -y python3
#7 2.847 E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/focal/InRelease
#7 2.847   Could not resolve 'archive.ubuntu.com'
failed to solve: executor failed running [/bin/sh -c apt-get update && apt-get install -y python3]: exit code: 100`,
    
    description: 'Docker build failure - network issue'
  },
  
  github_actions: {
    error: `Run npm test
  npm ERR! missing script: test

Error: Process completed with exit code 1.
##[error]Process completed with exit code 1.`,
    
    description: 'GitHub Actions - missing npm script'
  },
  
  vercel: {
    error: `[ERROR] Build failed with error:
Command "npm run build" exited with 1
> build
> next build

Error: Cannot find module 'next/dist/server/config'`,
    
    description: 'Vercel deployment failure'
  },
  
  nginx: {
    error: `2024/01/15 10:23:45 [error] 1234#0: *1 connect() failed (111: Connection refused) while connecting to upstream, client: 192.168.1.1, server: example.com, request: "GET / HTTP/1.1", upstream: "http://127.0.0.1:3000/", host: "example.com"
502 Bad Gateway`,
    
    description: 'Nginx 502 Bad Gateway error'
  }
}

