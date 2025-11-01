import * as vscode from 'vscode';
import { ParsedError } from '../types/error';
import { ErrorsTreeProvider } from '../ui/errorsTreeView';

/**
 * Monitors VS Code diagnostics (errors from language servers, linters, compilers)
 * This captures static analysis errors before code is run
 */
export class DiagnosticMonitor {
    private disposables: vscode.Disposable[] = [];
    private diagnosticCollection: vscode.DiagnosticCollection;
    private processedDiagnostics: Set<string> = new Set();

    constructor(
        private errorsTreeProvider: ErrorsTreeProvider
    ) {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('vibeassist');
    }

    startMonitoring(): void {
        console.log('VibeAssist: Starting diagnostic monitoring');

        // Listen for diagnostic changes
        const diagnosticListener = vscode.languages.onDidChangeDiagnostics(e => {
            this.handleDiagnosticChanges(e);
        });

        // Listen for active text editor changes
        const editorChangeListener = vscode.window.onDidChangeActiveTextEditor(editor => {
            if (editor) {
                this.checkEditorDiagnostics(editor.document);
            }
        });

        // Check current editor
        if (vscode.window.activeTextEditor) {
            this.checkEditorDiagnostics(vscode.window.activeTextEditor.document);
        }

        this.disposables.push(diagnosticListener, editorChangeListener);
    }

    private handleDiagnosticChanges(event: vscode.DiagnosticChangeEvent): void {
        event.uris.forEach(uri => {
            const diagnostics = vscode.languages.getDiagnostics(uri);
            this.processDiagnostics(uri, diagnostics);
        });
    }

    private checkEditorDiagnostics(document: vscode.TextDocument): void {
        const diagnostics = vscode.languages.getDiagnostics(document.uri);
        this.processDiagnostics(document.uri, diagnostics);
    }

    private processDiagnostics(uri: vscode.Uri, diagnostics: vscode.Diagnostic[]): void {
        // Filter for errors only (not warnings or info)
        const errors = diagnostics.filter(d => d.severity === vscode.DiagnosticSeverity.Error);

        errors.forEach(diagnostic => {
            const errorId = this.generateDiagnosticId(uri, diagnostic);
            
            // Skip if already processed
            if (this.processedDiagnostics.has(errorId)) {
                return;
            }

            this.processedDiagnostics.add(errorId);

            // Convert diagnostic to ParsedError
            const parsedError = this.diagnosticToParsedError(uri, diagnostic);
            
            // Add to tree view
            this.errorsTreeProvider.addError(parsedError);

            // Clean up old processed diagnostics (prevent memory leak)
            if (this.processedDiagnostics.size > 100) {
                const iterator = this.processedDiagnostics.values();
                this.processedDiagnostics.delete(iterator.next().value);
            }
        });
    }

    private diagnosticToParsedError(uri: vscode.Uri, diagnostic: vscode.Diagnostic): ParsedError {
        const language = this.getLanguageFromUri(uri);
        const errorType = this.extractErrorType(diagnostic);

        return {
            language,
            errorType,
            message: diagnostic.message,
            filePath: uri.fsPath,
            lineNumber: diagnostic.range.start.line + 1, // Convert to 1-based
            rawOutput: `${errorType}: ${diagnostic.message} at ${uri.fsPath}:${diagnostic.range.start.line + 1}`,
            timestamp: new Date(),
            stackTrace: diagnostic.relatedInformation?.map(info => 
                `  at ${info.location.uri.fsPath}:${info.location.range.start.line + 1}`
            ).join('\n')
        };
    }

    private getLanguageFromUri(uri: vscode.Uri): string {
        const extension = uri.fsPath.split('.').pop()?.toLowerCase() || '';
        
        const languageMap: Record<string, string> = {
            'py': 'python',
            'js': 'javascript',
            'ts': 'typescript',
            'jsx': 'javascript',
            'tsx': 'typescript',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'go': 'go',
            'rs': 'rust',
            'rb': 'ruby',
            'php': 'php'
        };

        return languageMap[extension] || 'unknown';
    }

    private extractErrorType(diagnostic: vscode.Diagnostic): string {
        // Try to extract error type from message
        const message = diagnostic.message;
        
        // Common patterns
        const patterns = [
            /^(\w+Error):/,  // PythonError:
            /^(TS\d+):/,     // TS2304:
            /^(\w+)\s+error/, // Syntax error
        ];

        for (const pattern of patterns) {
            const match = message.match(pattern);
            if (match) {
                return match[1];
            }
        }

        // Fallback to diagnostic source + code
        if (diagnostic.code) {
            return `${diagnostic.source || 'Error'}-${diagnostic.code}`;
        }

        return diagnostic.source || 'StaticError';
    }

    private generateDiagnosticId(uri: vscode.Uri, diagnostic: vscode.Diagnostic): string {
        return `${uri.fsPath}:${diagnostic.range.start.line}:${diagnostic.message}`;
    }

    clearProcessedDiagnostics(): void {
        this.processedDiagnostics.clear();
    }

    dispose(): void {
        this.disposables.forEach(d => d.dispose());
        this.diagnosticCollection.dispose();
        this.processedDiagnostics.clear();
    }
}

