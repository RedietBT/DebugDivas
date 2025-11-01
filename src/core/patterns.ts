// Team Member 2: Core Logic
// Error pattern definitions

export const ERROR_PATTERNS = {
  node: {
    typeError: /TypeError:\s*(.+)/,
    referenceError: /ReferenceError:\s*(.+)/,
    syntaxError: /SyntaxError:\s*(.+)/,
    stackTrace: /at\s+(.+)\s+\((.+):(\d+):(\d+)\)/
  },
  
  python: {
    traceback: /Traceback \(most recent call last\):/,
    file: /File "(.+)", line (\d+)/,
    moduleNotFound: /ModuleNotFoundError:\s*No module named '(.+)'/,
    importError: /ImportError:\s*(.+)/
  },
  
  docker: {
    buildFailed: /failed to solve/,
    copyFailed: /COPY failed/,
    runFailed: /RUN .+ returned a non-zero code/
  },
  
  // Add more patterns as needed
}

