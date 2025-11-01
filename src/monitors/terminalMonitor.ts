import * as vscode from 'vscode';
import { NotificationManager } from '../ui/notificationManager';
import { ConfigurationManager } from '../config/configurationManager';
import { ErrorParserManager } from '../parsers/errorParser';
import { ParsedError } from '../types/error';

export class TerminalMonitor {
    private isMonitoring: boolean = false;
    private disposables: vscode.Disposable[] = [];
    private errorParser: ErrorParserManager;
    private terminalDataListeners: Map<vscode.Terminal, vscode.Disposable> = new Map();
    private errorBuffer: string = '';
    private errorQueue: ParsedError[] = [];
    private readonly MAX_BUFFER_SIZE = 10000; // Max characters to keep in buffer
    private readonly ERROR_DEBOUNCE_MS = 500; // Wait 500ms before processing error

    constructor(
        private notificationManager: NotificationManager,
        private configManager: ConfigurationManager
    ) {
        this.errorParser = new ErrorParserManager();
    }

    startMonitoring(): void {
        if (this.isMonitoring) {
            return;
        }

        this.isMonitoring = true;
        console.log('VibeAssist: Starting terminal monitoring');

        // Monitor existing terminals
        vscode.window.terminals.forEach(terminal => this.monitorTerminal(terminal));

        // Monitor new terminals
        const terminalOpenListener = vscode.window.onDidOpenTerminal(terminal => {
            if (this.isMonitoring) {
                this.monitorTerminal(terminal);
            }
        });

        const terminalCloseListener = vscode.window.onDidCloseTerminal(terminal => {
            this.cleanupTerminal(terminal);
        });

        this.disposables.push(terminalOpenListener, terminalCloseListener);
    }

    private monitorTerminal(terminal: vscode.Terminal): void {
        // Check if already monitoring this terminal
        if (this.terminalDataListeners.has(terminal)) {
            return;
        }

        console.log(`VibeAssist: Monitoring terminal: ${terminal.name}`);

        // Create a pseudo-terminal to capture output
        // Note: VS Code doesn't provide direct terminal output access, 
        // so we'll use tasks and output channels as an alternative approach
        // For now, we'll monitor the terminal through other means

        // Alternative: Monitor tasks instead
        const taskExecutionListener = vscode.tasks.onDidEndTaskProcess(e => {
            if (e.exitCode !== 0 && e.execution.task.execution) {
                // Task failed, likely has error output
                this.handleTaskError(e);
            }
        });

        this.disposables.push(taskExecutionListener);
    }

    private handleTaskError(event: vscode.TaskProcessEndEvent): void {
        console.log('VibeAssist: Task ended with error code:', event.exitCode);
        // We'll enhance this with actual output capture later
        // For now, users will need to manually trigger error analysis
    }

    private cleanupTerminal(terminal: vscode.Terminal): void {
        const listener = this.terminalDataListeners.get(terminal);
        if (listener) {
            listener.dispose();
            this.terminalDataListeners.delete(terminal);
        }
    }

    // Manual error detection from clipboard or selection
    async analyzeFromClipboard(): Promise<void> {
        const clipboardText = await vscode.env.clipboard.readText();
        if (clipboardText) {
            this.processOutput(clipboardText);
        }
    }

    async analyzeFromSelection(): Promise<void> {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            const selection = editor.document.getText(editor.selection);
            if (selection) {
                this.processOutput(selection);
            }
        }
    }

    private processOutput(output: string): void {
        // Add to buffer
        this.errorBuffer += output;
        
        // Trim buffer if too large
        if (this.errorBuffer.length > this.MAX_BUFFER_SIZE) {
            this.errorBuffer = this.errorBuffer.slice(-this.MAX_BUFFER_SIZE);
        }

        // Try to parse errors
        const parsedError = this.errorParser.parse(this.errorBuffer);
        
        if (parsedError) {
            console.log('VibeAssist: Error detected:', parsedError.errorType);
            
            // Check if this is a duplicate recent error
            const isDuplicate = this.errorQueue.some(e => 
                e.errorType === parsedError.errorType &&
                e.message === parsedError.message &&
                (Date.now() - e.timestamp.getTime()) < 5000 // Within 5 seconds
            );

            if (!isDuplicate) {
                this.errorQueue.push(parsedError);
                this.notificationManager.handleError(parsedError);
            }

            // Clear buffer after successful parse
            this.errorBuffer = '';
        }
    }

    toggleMonitoring(): boolean {
        this.isMonitoring = !this.isMonitoring;
        if (this.isMonitoring) {
            this.startMonitoring();
        } else {
            this.stopMonitoring();
        }
        return this.isMonitoring;
    }

    private stopMonitoring(): void {
        this.isMonitoring = false;
        console.log('VibeAssist: Stopping terminal monitoring');
        
        // Clean up all terminal listeners
        this.terminalDataListeners.forEach(listener => listener.dispose());
        this.terminalDataListeners.clear();
    }

    dispose(): void {
        this.stopMonitoring();
        this.disposables.forEach(d => d.dispose());
        this.disposables = [];
    }
}

