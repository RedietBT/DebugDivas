import { ParsedError } from '../types/error';

export interface ErrorParser {
    canParse(output: string): boolean;
    parse(output: string): ParsedError | null;
}

export class PythonErrorParser implements ErrorParser {
    private readonly pythonErrorPatterns = [
        // Standard Python traceback
        /Traceback \(most recent call last\):/,
        // Direct error messages
        /^(\w+Error|Exception):/m,
        // File reference in traceback
        /File "([^"]+)", line (\d+)/
    ];

    canParse(output: string): boolean {
        return this.pythonErrorPatterns.some(pattern => pattern.test(output));
    }

    parse(output: string): ParsedError | null {
        if (!this.canParse(output)) {
            return null;
        }

        try {
            // Extract the error type and message
            const errorMatch = output.match(/(\w+(?:Error|Exception)):\s*(.+?)(?:\n|$)/);
            const errorType = errorMatch ? errorMatch[1] : 'PythonError';
            const message = errorMatch ? errorMatch[2].trim() : 'Unknown error';

            // Extract file path and line number
            const fileMatches = Array.from(output.matchAll(/File "([^"]+)", line (\d+)/g));
            const lastFileMatch = fileMatches.length > 0 ? fileMatches[fileMatches.length - 1] : null;
            const filePath = lastFileMatch ? lastFileMatch[1] : undefined;
            const lineNumber = lastFileMatch ? parseInt(lastFileMatch[2], 10) : undefined;

            // Extract stack trace
            const tracebackMatch = output.match(/Traceback \(most recent call last\):([\s\S]*?)(?=\n\w+(?:Error|Exception):)/);
            const stackTrace = tracebackMatch ? tracebackMatch[1].trim() : undefined;

            return {
                language: 'python',
                errorType,
                message,
                stackTrace,
                filePath,
                lineNumber,
                rawOutput: output,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Failed to parse Python error:', error);
            return null;
        }
    }
}

export class JavaScriptErrorParser implements ErrorParser {
    private readonly jsErrorPatterns = [
        /Error:/,
        /TypeError:/,
        /ReferenceError:/,
        /SyntaxError:/,
        /at .+ \(.+:\d+:\d+\)/
    ];

    canParse(output: string): boolean {
        return this.jsErrorPatterns.some(pattern => pattern.test(output));
    }

    parse(output: string): ParsedError | null {
        if (!this.canParse(output)) {
            return null;
        }

        try {
            const errorMatch = output.match(/(\w+Error):\s*(.+?)(?:\n|$)/);
            const errorType = errorMatch ? errorMatch[1] : 'JavaScriptError';
            const message = errorMatch ? errorMatch[2].trim() : 'Unknown error';

            // Extract file path and line number from stack trace
            const fileMatch = output.match(/at .+ \((.+):(\d+):(\d+)\)/);
            const filePath = fileMatch ? fileMatch[1] : undefined;
            const lineNumber = fileMatch ? parseInt(fileMatch[2], 10) : undefined;

            return {
                language: 'javascript',
                errorType,
                message,
                filePath,
                lineNumber,
                rawOutput: output,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Failed to parse JavaScript error:', error);
            return null;
        }
    }
}

export class TypeScriptErrorParser implements ErrorParser {
    private readonly tsErrorPatterns = [
        /error TS\d+:/,
        /\.ts\(\d+,\d+\):/
    ];

    canParse(output: string): boolean {
        return this.tsErrorPatterns.some(pattern => pattern.test(output));
    }

    parse(output: string): ParsedError | null {
        if (!this.canParse(output)) {
            return null;
        }

        try {
            const errorMatch = output.match(/error (TS\d+):\s*(.+?)(?:\n|$)/);
            const errorType = errorMatch ? errorMatch[1] : 'TypeScriptError';
            const message = errorMatch ? errorMatch[2].trim() : 'Unknown error';

            const fileMatch = output.match(/(.+\.ts)\((\d+),(\d+)\):/);
            const filePath = fileMatch ? fileMatch[1] : undefined;
            const lineNumber = fileMatch ? parseInt(fileMatch[2], 10) : undefined;

            return {
                language: 'typescript',
                errorType,
                message,
                filePath,
                lineNumber,
                rawOutput: output,
                timestamp: new Date()
            };
        } catch (error) {
            console.error('Failed to parse TypeScript error:', error);
            return null;
        }
    }
}

export class ErrorParserManager {
    private parsers: ErrorParser[] = [
        new PythonErrorParser(),
        new JavaScriptErrorParser(),
        new TypeScriptErrorParser()
    ];

    parse(output: string): ParsedError | null {
        for (const parser of this.parsers) {
            if (parser.canParse(output)) {
                const parsed = parser.parse(output);
                if (parsed) {
                    return parsed;
                }
            }
        }
        return null;
    }

    addParser(parser: ErrorParser): void {
        this.parsers.push(parser);
    }
}

