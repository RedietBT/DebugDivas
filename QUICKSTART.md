# VibeAssist - Quick Start (5 Minutes)

## Step 1: Install Dependencies (1 minute)

```bash
npm install
```

## Step 2: Compile the Extension (30 seconds)

```bash
npm run compile
```

## Step 3: Launch the Extension (10 seconds)

Press `F5` in VS Code

This opens a new window called "Extension Development Host"

## Step 4: Configure Your API Key (1 minute)

In the Extension Development Host window:

1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type: `VibeAssist: Open Settings`
3. Find `vibeassist.openrouterApiKey`
4. Paste your OpenRouter API key
5. Close settings

**Don't have an API key?** Get one at [openrouter.ai](https://openrouter.ai/)

## Step 5: Open the Demo Folder (10 seconds)

1. File → Open Folder
2. Navigate to the `demo` folder in this project
3. Click "Open"

## Step 6: Generate Context (Optional, 20 seconds)

1. Press `Ctrl+Shift+P`
2. Type: `VibeAssist: Generate Project Context`
3. Press Enter
4. Check that `.vibeassist-context.json` appears in the demo folder

## Step 7: Run the Error Demo (30 seconds)

Open terminal in VS Code (`Ctrl+`` or Terminal → New Terminal)

```bash
cd demo
python python_errors.py
```

You'll see an error like:
```
NameError: name 'username' is not defined
```

## Step 8: Analyze the Error (1 minute)

1. Select and copy the error from the terminal (including the traceback)
2. Press `Ctrl+Shift+P`
3. Type: `VibeAssist: Analyze Error from Clipboard`
4. Wait for the notification: "Analyzing error with AI..."
5. After a few seconds, you'll see: "✨ Solution found (95% confidence)"

## Step 9: View the Solution (30 seconds)

Click "View Solution" in the notification

You'll see a beautiful formatted output:
```
🔍 ERROR CAUSE
Variable 'username' is not defined in the function scope

💡 SUGGESTED FIX
Define the username variable before using it

📝 CODE CHANGES
[Shows the exact code fix]
```

## Step 10: Apply the Fix (30 seconds)

1. In the notification, click "Apply Fix"
2. Confirm the changes when prompted
3. Open `python_errors.py` - the code is now fixed!
4. Run the script again: `python python_errors.py`
5. It works! 🎉

## 🎬 You're Done!

You just:
- ✅ Detected an error
- ✅ Analyzed it with AI
- ✅ Got a context-aware solution
- ✅ Applied the fix automatically
- ✅ Verified it works

## What's Next?

### Try Other Errors

Edit `demo/python_errors.py` and uncomment different errors:

```python
if __name__ == "__main__":
    # greet_user()  # NameError
    # print(calculate_age(1990))  # TypeError
    # print(get_first_item())  # IndexError
    # print(process_text("hello"))  # AttributeError
```

### Try Different Languages

Create a JavaScript error:

```javascript
// test.js
console.log(myVariable); // ReferenceError
```

Run it, copy the error, analyze with VibeAssist!

### Customize Settings

- `vibeassist.modelName`: Try different AI models
- `vibeassist.autoApplyFixes`: Auto-apply without confirmation
- `vibeassist.supportedLanguages`: Add/remove languages

## Troubleshooting

### "No API key" error
→ Make sure you set the API key in settings and restarted the extension

### Extension not showing up
→ Check that you pressed F5 to launch it in Extension Development Host

### Error not detected
→ Make sure you copied the full error traceback (not just one line)

### AI analysis fails
→ Check your internet connection and API key validity

## Need Help?

- Check `TESTING.md` for detailed testing instructions
- Check `HACKATHON_GUIDE.md` for presentation tips
- Check `PROJECT_SUMMARY.md` for technical details

---

**Enjoy using VibeAssist! 🚀**

Found a bug? Have a suggestion? Let us know!

