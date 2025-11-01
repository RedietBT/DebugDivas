# 🧪 Complete Test Errors List

Copy and paste these errors to test both the **Web App** and **VS Code Extension**!

---

## 🐍 PYTHON ERRORS (11 types)

### 1. ZeroDivisionError
```
Traceback (most recent call last):
  File "app.py", line 4, in <module>
    z = y / x
ZeroDivisionError: division by zero
```

### 2. ModuleNotFoundError
```
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    import pandas as pd
ModuleNotFoundError: No module named 'pandas'
```

### 3. IndexError
```
Traceback (most recent call last):
  File "app.py", line 3, in <module>
    value = my_list[10]
IndexError: list index out of range
```

### 4. KeyError
```
Traceback (most recent call last):
  File "app.py", line 5, in <module>
    email = user_dict['email']
KeyError: 'email'
```

### 5. ValueError
```
Traceback (most recent call last):
  File "app.py", line 2, in <module>
    number = int("abc")
ValueError: invalid literal for int() with base 10: 'abc'
```

### 6. SyntaxError
```
  File "app.py", line 3
    if condition
               ^
SyntaxError: invalid syntax
```

### 7. IndentationError
```
  File "app.py", line 5
    print("Hello")
    ^
IndentationError: expected an indented block
```

### 8. AttributeError
```
Traceback (most recent call last):
  File "app.py", line 7, in <module>
    result = obj.nonexistent_method()
AttributeError: 'NoneType' object has no attribute 'nonexistent_method'
```

### 9. FileNotFoundError
```
Traceback (most recent call last):
  File "app.py", line 2, in <module>
    f = open('data.txt', 'r')
FileNotFoundError: [Errno 2] No such file or directory: 'data.txt'
```

### 10. ImportError
```
Traceback (most recent call last):
  File "app.py", line 1, in <module>
    from package import NonExistentClass
ImportError: cannot import name 'NonExistentClass' from 'package'
```

### 11. NameError
```
Traceback (most recent call last):
  File "app.py", line 3, in <module>
    print(undefined_variable)
NameError: name 'undefined_variable' is not defined
```

---

## 🟢 NODE.JS ERRORS (5 types)

### 1. TypeError - Cannot read property
```
TypeError: Cannot read property 'name' of undefined
    at getUserName (/app/server.js:45:23)
    at processRequest (/app/server.js:89:15)
    at Server.<anonymous> (/app/server.js:120:5)
```

### 2. ReferenceError
```
ReferenceError: myVariable is not defined
    at Object.<anonymous> (/app/index.js:10:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
```

### 3. SyntaxError
```
SyntaxError: Unexpected token '{'
    at Object.compileFunction (node:vm:352:18)
    at wrapSafe (node:internal/modules/cjs/loader:1031:15)
```

### 4. Module not found
```
Error: Cannot find module 'express'
Require stack:
- /app/server.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:902:15)
```

### 5. CORS Error
```
Access to XMLHttpRequest at 'https://api.example.com' from origin 'http://localhost:3000' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## 🐳 DOCKER ERRORS (6 types)

### 1. Build Failure
```
ERROR [3/5] RUN apt-get update && apt-get install -y python3
#7 2.847 E: Failed to fetch http://archive.ubuntu.com/ubuntu/dists/focal/InRelease
failed to solve: executor failed running [/bin/sh -c apt-get update && apt-get install -y python3]: exit code: 100
```

### 2. Port Already in Use
```
Error starting userland proxy: listen tcp4 0.0.0.0:3000: bind: address already in use
Error: failed to start containers: myapp
```

### 3. Permission Denied
```
Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock
```

### 4. No Space Left
```
ERROR: failed to solve: write /var/lib/docker/tmp/buildkit: no space left on device
```

### 5. Build Context Too Large
```
Sending build context to Docker daemon  2.5GB
ERROR: build context is too large
```

### 6. Container Exits
```
> docker ps -a
CONTAINER ID   STATUS
abc123         Exited (1) 3 seconds ago
```

---

## 🌐 NETWORK ERRORS (3 types)

### 1. ECONNREFUSED
```
Error: connect ECONNREFUSED 127.0.0.1:3000
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1144:16)
```

### 2. 404 Not Found
```
GET http://localhost:3000/api/users 404 (Not Found)
Failed to load resource: the server responded with a status of 404
```

### 3. 502 Bad Gateway
```
nginx: [error] 1234#0: *1 connect() failed (111: Connection refused) while connecting to upstream
502 Bad Gateway
```

---

## 🔨 GIT ERRORS (2 types)

### 1. Not a git repository
```
fatal: not a git repository (or any of the parent directories): .git
```

### 2. Merge conflict
```
error: Your local changes to the following files would be overwritten by merge:
	app.js
Please commit your changes or stash them before you merge.
```

---

## 💾 MEMORY ERRORS

### Out of Memory
```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory
 1: 0x10081bc50 node::Abort() [/usr/local/bin/node]
```

---

## 🧪 TESTING WORKFLOW

### Test 1: Basic Functionality
```
1. Copy: ZeroDivisionError: division by zero
2. Paste in app
3. Click "Analyze"
4. ✅ See Python-specific fix
```

### Test 2: Similar Errors
```
1. Analyze: ZeroDivisionError: division by zero
2. Analyze: ZeroDivisionError: float division by zero
3. ✅ See "Found 1 Similar Past Error!"
4. ✅ Expand to see details
```

### Test 3: Amharic Translation
```
1. Analyze any error
2. Click "🇪🇹 አማርኛ" button
3. ✅ See Amharic translations
4. Click "🇺🇸 English"
5. ✅ Switch back
```

### Test 4: Category Filtering
```
1. Analyze 3 different error types
2. Go to Log History
3. Use "Filter by Category" dropdown
4. ✅ See filtered results
```

### Test 5: VS Code Extension
```
1. Open extension folder in VS Code
2. Press F5
3. In Extension Host, paste error
4. Ctrl+Shift+P → "DevFix: Analyze Terminal Error"
5. ✅ See analysis panel
```

---

## 🎯 Quick Copy-Paste for Demo

**Fastest test sequence (30 seconds):**

```
# Error 1
ZeroDivisionError: division by zero

# Error 2  
ModuleNotFoundError: No module named 'pandas'

# Error 3
TypeError: Cannot read property 'name' of undefined
```

**Paste all 3, then:**
1. ✅ Check Log History (3 logs)
2. ✅ See different categories
3. ✅ Toggle Amharic
4. ✅ Refresh page - logs persist!

---

## 📊 Coverage Summary

| Category | Count | Supported |
|----------|-------|-----------|
| Python Errors | 11 | ✅ |
| Docker Errors | 6 | ✅ |
| Node.js Errors | 5 | ✅ |
| Network Errors | 3 | ✅ |
| Git Errors | 2 | ✅ |
| Memory Errors | 1 | ✅ |
| Build Errors | 2 | ✅ |
| **TOTAL** | **30+** | ✅ |

---

## 🎉 Success Metrics

Your project is successful if:
- [ ] Can analyze 10+ different error types
- [ ] Amharic translation works
- [ ] Similar errors detection works
- [ ] Log history persists
- [ ] Category filtering works
- [ ] VS Code extension runs
- [ ] Both products work together

---

**All test errors are ready to use!** 🚀

Copy any error above and test in:
1. **Web App:** http://localhost:5173
2. **VS Code Extension:** Press F5 → Command Palette

Good luck! 💪

