import * as vscode from 'vscode';
import { ParsedError, ErrorAnalysis } from '../types/error';

export interface ErrorItem {
    error: ParsedError;
    analysis?: ErrorAnalysis;
    id: string;
    timestamp: Date;
}

export class ErrorTreeItem extends vscode.TreeItem {
    constructor(
        public readonly errorItem: ErrorItem,
        public readonly collapsibleState: vscode.TreeItemCollapsibleState,
        public readonly isChild: boolean = false
    ) {
        super(
            isChild ? '' : `${errorItem.error.errorType}`,
            collapsibleState
        );

        if (!isChild) {
            this.tooltip = errorItem.error.message;
            this.description = errorItem.error.filePath 
                ? `${errorItem.error.filePath}:${errorItem.error.lineNumber || '?'}` 
                : errorItem.error.message.substring(0, 50);
            
            // Set context value based on analysis status
            this.contextValue = errorItem.analysis ? 'analyzedError' : 'error';
            
            // Icon based on state
            this.iconPath = new vscode.ThemeIcon(
                errorItem.analysis ? 'check-all' : 'warning',
                errorItem.analysis 
                    ? new vscode.ThemeColor('charts.green')
                    : new vscode.ThemeColor('charts.yellow')
            );
        }
    }
}

export class ErrorsTreeProvider implements vscode.TreeDataProvider<ErrorTreeItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ErrorTreeItem | undefined | null | void> = new vscode.EventEmitter<ErrorTreeItem | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<ErrorTreeItem | undefined | null | void> = this._onDidChangeTreeData.event;

    private errors: Map<string, ErrorItem> = new Map();

    constructor() {}

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }

    addError(error: ParsedError): void {
        const id = this.generateErrorId(error);
        if (!this.errors.has(id)) {
            this.errors.set(id, {
                error,
                id,
                timestamp: new Date()
            });
            this.refresh();
        }
    }

    updateErrorWithAnalysis(errorId: string, analysis: ErrorAnalysis): void {
        const errorItem = this.errors.get(errorId);
        if (errorItem) {
            errorItem.analysis = analysis;
            this.refresh();
        }
    }

    getErrorById(id: string): ErrorItem | undefined {
        return this.errors.get(id);
    }

    removeError(id: string): void {
        this.errors.delete(id);
        this.refresh();
    }

    clearAll(): void {
        this.errors.clear();
        this.refresh();
    }

    getTreeItem(element: ErrorTreeItem): vscode.TreeItem {
        return element;
    }

    getChildren(element?: ErrorTreeItem): Thenable<ErrorTreeItem[]> {
        if (!element) {
            // Root level - show all errors
            const items: ErrorTreeItem[] = [];
            this.errors.forEach(errorItem => {
                items.push(new ErrorTreeItem(
                    errorItem,
                    errorItem.analysis ? vscode.TreeItemCollapsibleState.Collapsed : vscode.TreeItemCollapsibleState.None,
                    false
                ));
            });
            
            // Sort by timestamp (newest first)
            items.sort((a, b) => b.errorItem.timestamp.getTime() - a.errorItem.timestamp.getTime());
            
            return Promise.resolve(items);
        } else {
            // Child level - show fix and details if analyzed
            if (element.errorItem.analysis) {
                return Promise.resolve(this.getAnalysisChildren(element.errorItem));
            }
            return Promise.resolve([]);
        }
    }

    private getAnalysisChildren(errorItem: ErrorItem): ErrorTreeItem[] {
        const children: ErrorTreeItem[] = [];
        const analysis = errorItem.analysis!;

        // Fix first (as requested)
        const fixItem = new ErrorTreeItem(
            errorItem,
            vscode.TreeItemCollapsibleState.None,
            true
        );
        fixItem.label = '✨ Suggested Fix';
        fixItem.tooltip = analysis.suggestedFix;
        fixItem.description = `${Math.round(analysis.confidence * 100)}% confidence`;
        fixItem.iconPath = new vscode.ThemeIcon('lightbulb', new vscode.ThemeColor('charts.yellow'));
        fixItem.command = {
            command: 'vibeassist.viewDetails',
            title: 'View Fix Details',
            arguments: [errorItem.id]
        };
        children.push(fixItem);

        // Error cause
        const causeItem = new ErrorTreeItem(
            errorItem,
            vscode.TreeItemCollapsibleState.None,
            true
        );
        causeItem.label = '🔍 Error Cause';
        causeItem.tooltip = analysis.errorCause;
        causeItem.description = analysis.errorCause.substring(0, 50) + (analysis.errorCause.length > 50 ? '...' : '');
        causeItem.iconPath = new vscode.ThemeIcon('search');
        children.push(causeItem);

        // Code changes count
        if (analysis.codeChanges && analysis.codeChanges.length > 0) {
            const changesItem = new ErrorTreeItem(
                errorItem,
                vscode.TreeItemCollapsibleState.None,
                true
            );
            changesItem.label = `📝 ${analysis.codeChanges.length} Code Change(s)`;
            changesItem.tooltip = 'Click "Apply Fix" to apply these changes';
            changesItem.iconPath = new vscode.ThemeIcon('edit');
            children.push(changesItem);
        }

        return children;
    }

    private generateErrorId(error: ParsedError): string {
        // Create a unique ID based on error details
        const parts = [
            error.language,
            error.errorType,
            error.message.substring(0, 50),
            error.filePath || 'unknown',
            error.lineNumber || 0
        ];
        return parts.join('|');
    }

    findErrorByTreeItem(item: ErrorTreeItem): string | undefined {
        return item.errorItem.id;
    }
}

