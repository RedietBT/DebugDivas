import * as vscode from 'vscode';
import { ParsedError, ErrorAnalysis } from '../types/error';
import { AnalysisService } from '../ai/analysisService';
import { FixApplicator } from '../fixes/fixApplicator';

export class NotificationManager {
    private analysisService: AnalysisService | null = null;
    private fixApplicator: FixApplicator;
    private isAnalyzing: boolean = false;

    constructor(private context: vscode.ExtensionContext) {
        this.fixApplicator = new FixApplicator();
    }

    setAnalysisService(service: AnalysisService): void {
        this.analysisService = service;
    }

    async handleError(error: ParsedError): Promise<void> {
        if (this.isAnalyzing) {
            console.log('VibeAssist: Already analyzing an error, skipping...');
            return;
        }

        // Show initial notification
        const message = `🔍 ${error.language} error detected: ${error.errorType}`;
        
        vscode.window.showInformationMessage(message, 'Analyze with AI', 'Show Details', 'Dismiss')
            .then(async selection => {
                if (selection === 'Analyze with AI') {
                    await this.analyzeAndShowSolution(error);
                } else if (selection === 'Show Details') {
                    this.showErrorDetails(error);
                }
            });
    }

    private async analyzeAndShowSolution(error: ParsedError): Promise<void> {
        if (!this.analysisService) {
            vscode.window.showErrorMessage('VibeAssist: Analysis service not initialized');
            return;
        }

        this.isAnalyzing = true;

        // Show progress
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'VibeAssist',
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Analyzing error with AI...' });

            try {
                const analysis = await this.analysisService!.analyzeError(error);
                this.isAnalyzing = false;
                
                // Show the analysis result with fix options
                await this.showAnalysisResult(error, analysis);
            } catch (err) {
                this.isAnalyzing = false;
                const errorMsg = err instanceof Error ? err.message : 'Unknown error';
                vscode.window.showErrorMessage(`VibeAssist: Analysis failed - ${errorMsg}`);
            }
        });
    }

    private async showAnalysisResult(error: ParsedError, analysis: ErrorAnalysis): Promise<void> {
        // Create a formatted message for the notification
        const confidence = Math.round(analysis.confidence * 100);
        const notificationMessage = `✨ Solution found (${confidence}% confidence)`;

        // Show notification with actions
        const action = await vscode.window.showInformationMessage(
            notificationMessage,
            { modal: false },
            'View Solution',
            'Apply Fix',
            'Show Details',
            'Dismiss'
        );

        if (action === 'View Solution') {
            this.showSolutionPanel(error, analysis);
        } else if (action === 'Apply Fix') {
            await this.applyFix(error, analysis);
        } else if (action === 'Show Details') {
            this.showSolutionPanel(error, analysis);
        }
    }

    private showSolutionPanel(error: ParsedError, analysis: ErrorAnalysis): void {
        const panel = vscode.window.createOutputChannel('VibeAssist Solution');
        panel.clear();
        
        panel.appendLine('╔═══════════════════════════════════════╗');
        panel.appendLine('║     VibeAssist - AI Error Analysis    ║');
        panel.appendLine('╚═══════════════════════════════════════╝');
        panel.appendLine('');
        
        panel.appendLine('📍 ERROR INFORMATION');
        panel.appendLine('─'.repeat(50));
        panel.appendLine(`Type: ${error.errorType}`);
        panel.appendLine(`Message: ${error.message}`);
        if (error.filePath) {
            panel.appendLine(`File: ${error.filePath}${error.lineNumber ? `:${error.lineNumber}` : ''}`);
        }
        panel.appendLine('');
        
        panel.appendLine('🔍 ERROR CAUSE');
        panel.appendLine('─'.repeat(50));
        panel.appendLine(analysis.errorCause);
        panel.appendLine('');
        
        panel.appendLine('💡 SUGGESTED FIX');
        panel.appendLine('─'.repeat(50));
        panel.appendLine(analysis.suggestedFix);
        panel.appendLine('');
        
        if (analysis.codeChanges && analysis.codeChanges.length > 0) {
            panel.appendLine('📝 CODE CHANGES');
            panel.appendLine('─'.repeat(50));
            analysis.codeChanges.forEach((change, index) => {
                panel.appendLine(`\n[${index + 1}] ${change.description}`);
                panel.appendLine(`File: ${change.filePath}${change.lineNumber ? ` (line ${change.lineNumber})` : ''}`);
                if (change.oldCode) {
                    panel.appendLine('\nOld code:');
                    panel.appendLine(change.oldCode);
                }
                panel.appendLine('\nNew code:');
                panel.appendLine(change.newCode);
                panel.appendLine('');
            });
        }
        
        if (analysis.additionalInfo) {
            panel.appendLine('ℹ️  ADDITIONAL INFORMATION');
            panel.appendLine('─'.repeat(50));
            panel.appendLine(analysis.additionalInfo);
            panel.appendLine('');
        }
        
        panel.appendLine('─'.repeat(50));
        panel.appendLine(`Confidence: ${Math.round(analysis.confidence * 100)}%`);
        panel.appendLine('');
        
        panel.show();
    }

    private async applyFix(error: ParsedError, analysis: ErrorAnalysis): Promise<void> {
        if (!analysis.codeChanges || analysis.codeChanges.length === 0) {
            vscode.window.showWarningMessage(
                'VibeAssist: No automatic code changes available. Please review the suggested fix manually.',
                'View Solution'
            ).then(selection => {
                if (selection === 'View Solution') {
                    this.showSolutionPanel(error, analysis);
                }
            });
            return;
        }

        // Show confirmation dialog
        const confirmation = await vscode.window.showWarningMessage(
            `VibeAssist: Apply ${analysis.codeChanges.length} code change(s)?`,
            { modal: true },
            'Apply',
            'Show Diff',
            'Cancel'
        );

        if (confirmation === 'Apply') {
            const success = await this.fixApplicator.applyFixes(analysis);
            if (success) {
                vscode.window.showInformationMessage('VibeAssist: Fixes applied successfully! ✨');
            }
        } else if (confirmation === 'Show Diff' && analysis.codeChanges.length > 0) {
            // Show diff for the first code change
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (workspaceFolder) {
                await this.fixApplicator.showDiff(analysis.codeChanges[0], workspaceFolder.uri.fsPath);
            }
        }
    }

    private showErrorDetails(error: ParsedError): void {
        const panel = vscode.window.createOutputChannel('VibeAssist Error Details');
        panel.clear();
        panel.appendLine('=== VibeAssist Error Details ===');
        panel.appendLine(`Language: ${error.language}`);
        panel.appendLine(`Error Type: ${error.errorType}`);
        panel.appendLine(`Message: ${error.message}`);
        if (error.filePath) {
            panel.appendLine(`File: ${error.filePath}`);
        }
        if (error.lineNumber) {
            panel.appendLine(`Line: ${error.lineNumber}`);
        }
        if (error.stackTrace) {
            panel.appendLine('\nStack Trace:');
            panel.appendLine(error.stackTrace);
        }
        panel.appendLine('\nRaw Output:');
        panel.appendLine(error.rawOutput);
        panel.show();
    }

    async showErrorNotification(message: string): Promise<void> {
        vscode.window.showInformationMessage(message);
    }
}


