import * as vscode from 'vscode';
import * as path from 'path';
import { CodeChange, ErrorAnalysis } from '../types/error';

export class FixApplicator {
    async applyFixes(analysis: ErrorAnalysis): Promise<boolean> {
        if (!analysis.codeChanges || analysis.codeChanges.length === 0) {
            vscode.window.showWarningMessage('No code changes to apply');
            return false;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder open');
            return false;
        }

        try {
            // Apply each code change
            for (const change of analysis.codeChanges) {
                await this.applyCodeChange(change, workspaceFolder.uri.fsPath);
            }

            vscode.window.showInformationMessage(
                `VibeAssist: Successfully applied ${analysis.codeChanges.length} fix(es)!`
            );
            return true;
        } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            vscode.window.showErrorMessage(`VibeAssist: Failed to apply fix - ${errorMsg}`);
            return false;
        }
    }

    private async applyCodeChange(change: CodeChange, workspacePath: string): Promise<void> {
        // Resolve the file path
        let filePath = change.filePath;
        if (!path.isAbsolute(filePath)) {
            filePath = path.join(workspacePath, filePath);
        }

        const fileUri = vscode.Uri.file(filePath);

        try {
            // Open the document
            const document = await vscode.workspace.openTextDocument(fileUri);
            const editor = await vscode.window.showTextDocument(document);

            // Create a workspace edit
            const edit = new vscode.WorkspaceEdit();

            if (change.lineNumber && change.oldCode) {
                // Replace specific line(s)
                await this.replaceCode(document, edit, change);
            } else if (change.lineNumber) {
                // Insert at specific line
                const line = change.lineNumber - 1; // Convert to 0-based
                const position = new vscode.Position(line, 0);
                edit.insert(fileUri, position, change.newCode + '\n');
            } else {
                // Append to end of file
                const lastLine = document.lineCount - 1;
                const lastLineText = document.lineAt(lastLine).text;
                const position = new vscode.Position(lastLine, lastLineText.length);
                edit.insert(fileUri, position, '\n' + change.newCode);
            }

            // Apply the edit
            const success = await vscode.workspace.applyEdit(edit);
            
            if (success) {
                // Save the document
                await document.save();
                console.log(`VibeAssist: Applied fix to ${change.filePath}`);
            } else {
                throw new Error(`Failed to apply edit to ${change.filePath}`);
            }
        } catch (error) {
            console.error('VibeAssist: Error applying code change:', error);
            throw error;
        }
    }

    private async replaceCode(
        document: vscode.TextDocument,
        edit: vscode.WorkspaceEdit,
        change: CodeChange
    ): Promise<void> {
        const fileUri = document.uri;
        
        if (!change.oldCode) {
            return;
        }

        // Try to find the old code in the document
        const text = document.getText();
        const oldCodeNormalized = change.oldCode.trim();
        
        // Search for the old code
        let startLine = -1;
        let endLine = -1;

        if (change.lineNumber) {
            // Search near the specified line number
            const searchStart = Math.max(0, change.lineNumber - 5);
            const searchEnd = Math.min(document.lineCount, change.lineNumber + 5);
            
            for (let i = searchStart; i < searchEnd; i++) {
                const lineText = document.lineAt(i).text;
                if (lineText.includes(oldCodeNormalized) || oldCodeNormalized.includes(lineText.trim())) {
                    startLine = i;
                    endLine = i;
                    break;
                }
            }
        }

        if (startLine === -1) {
            // Fallback: search the entire document
            const lines = text.split('\n');
            for (let i = 0; i < lines.length; i++) {
                if (lines[i].includes(oldCodeNormalized) || oldCodeNormalized.includes(lines[i].trim())) {
                    startLine = i;
                    endLine = i;
                    break;
                }
            }
        }

        if (startLine !== -1) {
            // Replace the found code
            const range = new vscode.Range(
                new vscode.Position(startLine, 0),
                new vscode.Position(endLine, document.lineAt(endLine).text.length)
            );
            edit.replace(fileUri, range, change.newCode);
        } else {
            // If old code not found, insert at the specified line or at the end
            const line = change.lineNumber ? change.lineNumber - 1 : document.lineCount - 1;
            const position = new vscode.Position(line, 0);
            edit.insert(fileUri, position, change.newCode + '\n');
        }
    }

    async showDiff(change: CodeChange, workspacePath: string): Promise<void> {
        if (!change.oldCode) {
            vscode.window.showInformationMessage('No old code to compare');
            return;
        }

        // Create temporary documents to show the diff
        const oldContent = change.oldCode;
        const newContent = change.newCode;

        const oldUri = vscode.Uri.parse(`untitled:${change.filePath}.old`);
        const newUri = vscode.Uri.parse(`untitled:${change.filePath}.new`);

        const oldDoc = await vscode.workspace.openTextDocument(oldUri);
        const newDoc = await vscode.workspace.openTextDocument(newUri);

        const oldEdit = new vscode.WorkspaceEdit();
        oldEdit.insert(oldUri, new vscode.Position(0, 0), oldContent);
        await vscode.workspace.applyEdit(oldEdit);

        const newEdit = new vscode.WorkspaceEdit();
        newEdit.insert(newUri, new vscode.Position(0, 0), newContent);
        await vscode.workspace.applyEdit(newEdit);

        // Show diff
        await vscode.commands.executeCommand(
            'vscode.diff',
            oldUri,
            newUri,
            `VibeAssist: ${path.basename(change.filePath)} - Proposed Changes`
        );
    }
}

