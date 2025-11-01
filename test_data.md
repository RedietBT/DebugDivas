Below is a clean **markdown block** you can paste into your `test.md` file.
It contains **two ready-to-copy errors** (Python syntax error + Docker build error).

---

## 🧪 Test Errors for AI Debugging

### ✅ **1. Python Syntax Error**

```python
# Intentional SyntaxError for testing AI debugging
def greet(name)
    print("Hello, " + name)

greet("Sam")
```

**Expected Error Output**

```
  File "test.py", line 2
    def greet(name)
                   ^
SyntaxError: expected ':'
```

---

### ✅ **2. Docker Build Error**

**Dockerfile**

```dockerfile
# Intentional Docker build error for testing AI debugging
FROM python:3.10

# Missing apt-get update and package name is wrong
RUN apt install -y python3-pippp

WORKDIR /app
COPY . .

CMD ["python", "app.py"]
```

**Expected Docker Error**

```
E: Unable to locate package python3-pippp
The command '/bin/sh -c apt install -y python3-pippp' returned a non-zero exit code: 100
```

---

Copy & paste these whenever you need to test your AI error-analysis system ✅
