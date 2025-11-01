# VibeAssist - AI-Powered Error Assistant

VibeAssist is a VS Code extension that automatically detects errors in your terminal output, analyzes them using AI, and provides intelligent fix suggestions with one-click application.

## Features

- **Automatic Error Detection**: Monitors terminal output for errors in real-time
- **AI-Powered Analysis**: Uses OpenRouter API to analyze errors and suggest fixes
- **Smart Context**: Generates project context for faster and more accurate solutions
- **Pop-up Notifications**: Get instant alerts with error analysis, even when working in other files
- **One-Click Fixes**: Accept or dismiss suggested fixes with a single click
- **Multi-Language Support**: Currently supports Python (more languages coming soon)

## Setup

1. Install the extension
2. Open VS Code settings (`Ctrl+,` or `Cmd+,`)
3. Search for "VibeAssist"
4. Add your OpenRouter API key in the `vibeassist.openrouterApiKey` setting
5. That's it! VibeAssist will start monitoring your terminal automatically

## Commands

- `VibeAssist: Generate Project Context` - Creates a context file for your project
- `VibeAssist: Toggle Error Monitoring` - Enable/disable automatic error monitoring
- `VibeAssist: Open Settings` - Quick access to VibeAssist settings

## Configuration

| Setting | Description | Default |
|---------|-------------|---------|
| `vibeassist.openrouterApiKey` | Your OpenRouter API key | (empty) |
| `vibeassist.enableAutoMonitoring` | Auto-monitor terminal errors | `true` |
| `vibeassist.supportedLanguages` | Languages to monitor | `["python", "javascript", "typescript"]` |
| `vibeassist.autoApplyFixes` | Auto-apply fixes without confirmation | `false` |
| `vibeassist.modelName` | OpenRouter model to use | `anthropic/claude-3.5-sonnet` |

## How It Works

1. **Detection**: VibeAssist monitors your terminal output for error patterns
2. **Context**: Reads your project's `.vibeassist-context.json` file (or generates one)
3. **Analysis**: Sends the error and context to OpenRouter AI for analysis
4. **Notification**: Shows a pop-up with the error cause and suggested fix
5. **Application**: You can accept the fix with one click or dismiss it

## Requirements

- VS Code 1.85.0 or higher
- OpenRouter API key ([Get one here](https://openrouter.ai/))

## Development & Building

```bash
# Install dependencies
npm install

# Compile TypeScript
npm run compile

# Watch mode for development
npm run watch

# Package the extension
npx vsce package
```

## License

MIT

## Support

For issues and feature requests, please visit our [GitHub repository](https://github.com/vibeassist/vibeassist).

