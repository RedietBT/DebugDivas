# VibeAssist Testing Guide

## Quick Test (5 minutes)

### Prerequisites
- VS Code installed
- Node.js 20.x or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/))

### Steps

1. **Build the extension**
```bash
npm install
npm run compile
```

2. **Launch the extension**
- Press `F5` in VS Code (or Run → Start Debugging)
- This opens a new "Extension Development Host" window

3. **Configure API key**
- In the new window: `Ctrl+Shift+P` (or `Cmd+Shift+P`)
- Type: `VibeAssist: Open Settings`
- Set your OpenRouter API key

4. **Open demo folder**
- File → Open Folder → Select the `demo` folder

5. **Generate context (optional)**
- `Ctrl+Shift+P` → `VibeAssist: Generate Project Context`
- Check that `.vibeassist-context.json` is created

6. **Test error analysis**
```bash
# In terminal
cd demo
python python_errors.py
```

7. **Analyze the error**
- Copy the error from terminal (Ctrl+C)
- `Ctrl+Shift+P` → `VibeAssist: Analyze Error from Clipboard`
- Wait for AI analysis
- Click "View Solution" to see the formatted output

8. **Apply the fix**
- When solution appears, click "Apply Fix"
- Confirm the changes
- Check that the code is updated
- Run the Python script again to verify the fix works

## Test Cases

### Test 1: Python NameError

**File**: `demo/python_errors.py` (line 6)

**Expected Error**:
```
NameError: name 'username' is not defined
```

**Expected Fix**: Define username variable or add as parameter

**How to Test**:
1. Uncomment line `greet_user()` at the bottom
2. Run: `python python_errors.py`
3. Copy error, analyze with VibeAssist
4. Apply fix
5. Run again - should work

### Test 2: Python TypeError

**File**: `demo/python_errors.py` (line 10)

**Expected Error**:
```
TypeError: unsupported operand type(s) for -: 'str' and 'int'
```

**Expected Fix**: Convert string to int before subtraction

### Test 3: Context Generation

**How to Test**:
1. Open demo folder
2. Run: `VibeAssist: Generate Project Context`
3. Check `.vibeassist-context.json` exists
4. Verify it contains:
   - `projectType: "python"`
   - Dependencies from `requirements.txt`
   - Framework detection (if applicable)

### Test 4: Multiple Language Support

**Create a JavaScript error**:
```javascript
// test.js
function greet() {
    console.log(username); // ReferenceError
}
greet();
```

**Run**: `node test.js`
**Copy error → Analyze → Verify it's detected as JavaScript error**

## Manual Testing Checklist

- [ ] Extension activates without errors
- [ ] Welcome message appears on first activation
- [ ] Settings command opens VS Code settings
- [ ] Generate Context creates `.vibeassist-context.json`
- [ ] Context file has correct project info
- [ ] Error parser detects Python errors
- [ ] Error parser detects JavaScript errors
- [ ] Error parser detects TypeScript errors
- [ ] Analyze from Clipboard works
- [ ] Analyze from Selection works
- [ ] AI analysis shows progress notification
- [ ] Solution display is formatted correctly
- [ ] "View Solution" button opens output panel
- [ ] "Apply Fix" button shows confirmation
- [ ] Code changes are applied correctly
- [ ] Files are saved after applying fix
- [ ] "Show Diff" works for code changes
- [ ] Error handling works (no API key, bad error format, etc.)

## Known Limitations (To Be Fixed Later)

1. **Terminal Monitoring**: Currently manual (clipboard/selection). Real-time monitoring requires VS Code API limitations workaround.

2. **Multi-line Errors**: Some complex stack traces might need better parsing.

3. **File Path Resolution**: Relative paths work best; absolute paths may vary by OS.

4. **Concurrent Analysis**: Only one error can be analyzed at a time (by design for now).

## Troubleshooting

### Extension doesn't activate
- Check Output panel (`Ctrl+Shift+U`) → "Extension Host"
- Look for errors in `npm run compile`

### "No API key" error
- Make sure to set `vibeassist.openrouterApiKey` in settings
- Restart the extension after setting the key

### Error not detected
- Make sure you copied the full error traceback
- Check console (`Help` → `Toggle Developer Tools` → `Console`)
- Verify the error format matches supported parsers

### Fix not applied
- Check if file is read-only
- Verify the file path in error message exists
- Check Output panel for detailed error messages

### AI analysis fails
- Verify API key is correct
- Check internet connection
- Try with a simpler error message first
- Check OpenRouter API status

## Performance Benchmarks

| Operation | Expected Time |
|-----------|--------------|
| Extension Activation | < 1 second |
| Context Generation | < 2 seconds |
| Error Parsing | < 100ms |
| AI Analysis | 2-10 seconds (depends on API) |
| Fix Application | < 500ms |

## Debug Mode

To see detailed logs:

1. Open Developer Tools: `Help` → `Toggle Developer Tools`
2. Go to Console tab
3. Filter for "VibeAssist"
4. All debug logs will appear here

## Testing with Different AI Models

You can test with different OpenRouter models:

1. Open Settings → `vibeassist.modelName`
2. Try:
   - `anthropic/claude-3.5-sonnet` (default, best quality)
   - `openai/gpt-4`
   - `google/gemini-pro`
   - `meta-llama/llama-3-70b-instruct`

## Automated Testing (Future)

Currently, testing is manual. Future work:
- Unit tests for error parsers
- Integration tests for AI analysis
- E2E tests with mock API responses
- CI/CD pipeline with automated testing

## Feedback

When testing, please note:
- What worked well
- What didn't work
- Error messages that were confusing
- Suggested improvements
- Missing features you'd want

This helps us improve VibeAssist! 🚀

