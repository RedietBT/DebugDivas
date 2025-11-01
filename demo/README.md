# VibeAssist Demo

This demo folder contains intentional errors for testing VibeAssist's error detection and fixing capabilities.

## Setup

1. Make sure you have the VibeAssist extension installed
2. Open this folder in VS Code
3. Set your OpenRouter API key in VS Code settings:
   - Press `Ctrl+,` (or `Cmd+,` on Mac)
   - Search for "VibeAssist"
   - Enter your OpenRouter API key

## Testing the Extension

### Method 1: Analyze from Clipboard (Easiest for Demo)

1. Run the Python file: `python python_errors.py`
2. Copy the error output from the terminal
3. Open Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
4. Run: `VibeAssist: Analyze Error from Clipboard`
5. The extension will detect the error, analyze it with AI, and show a fix!

### Method 2: Analyze from Selection

1. Run the Python file and copy the error output
2. Paste it into any file in VS Code
3. Select the error text
4. Open Command Palette
5. Run: `VibeAssist: Analyze Error from Selection`

### Method 3: Generate Context First (Recommended)

1. Open Command Palette
2. Run: `VibeAssist: Generate Project Context`
3. This creates a `.vibeassist-context.json` file with your project info
4. Now when you analyze errors, VibeAssist will have better context!

## Example Errors to Test

The `python_errors.py` file contains 7 different types of errors:

1. **NameError**: Undefined variable
2. **TypeError**: Type mismatch in operations
3. **IndexError**: List index out of range
4. **AttributeError**: Non-existent method
5. **ImportError**: Missing module
6. **ZeroDivisionError**: Division by zero
7. **KeyError**: Missing dictionary key

## Expected Flow

1. **Error Detection**: Run Python script with error
2. **Copy Error**: Copy the traceback from terminal
3. **Analyze**: Use "Analyze Error from Clipboard" command
4. **AI Processing**: VibeAssist sends error to AI (shows progress)
5. **Solution Display**: Beautiful formatted solution appears
6. **Apply Fix**: Click "Apply Fix" to automatically correct the code!

## Demo Script for Hackathon

```
1. Open demo folder in VS Code
2. Show the python_errors.py file (has intentional errors)
3. Run: "VibeAssist: Generate Project Context" 
   - Show the generated .vibeassist-context.json
4. Run: python python_errors.py (will error)
5. Copy the error from terminal
6. Run: "VibeAssist: Analyze Error from Clipboard"
7. Watch the magic happen:
   - Error detected ✓
   - AI analyzing... (progress bar)
   - Solution appears with confidence score
8. Click "View Solution" - beautiful formatted output
9. Click "Apply Fix" - code auto-corrected!
10. Run python script again - it works! 🎉
```

## Troubleshooting

- **No API Key**: Make sure to set your OpenRouter API key in settings
- **No Context File**: Run "Generate Project Context" command first
- **Error Not Detected**: Make sure you copied the full error traceback

