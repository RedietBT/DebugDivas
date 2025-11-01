import * as vscode from 'vscode';

export interface VibeAssistConfig {
    openrouterApiKey: string;
    enableAutoMonitoring: boolean;
    supportedLanguages: string[];
    autoApplyFixes: boolean;
    modelName: string;
}

export class ConfigurationManager {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration('vibeassist');
        
        // Listen for configuration changes
        vscode.workspace.onDidChangeConfiguration(e => {
            if (e.affectsConfiguration('vibeassist')) {
                this.config = vscode.workspace.getConfiguration('vibeassist');
            }
        });
    }

    getConfig(): VibeAssistConfig {
        return {
            openrouterApiKey: this.config.get<string>('openrouterApiKey', ''),
            enableAutoMonitoring: this.config.get<boolean>('enableAutoMonitoring', true),
            supportedLanguages: this.config.get<string[]>('supportedLanguages', ['python', 'javascript', 'typescript']),
            autoApplyFixes: this.config.get<boolean>('autoApplyFixes', false),
            modelName: this.config.get<string>('modelName', 'anthropic/claude-3.5-sonnet')
        };
    }

    getApiKey(): string {
        const apiKey = this.config.get<string>('openrouterApiKey', '');
        if (!apiKey) {
            vscode.window.showWarningMessage(
                'VibeAssist: OpenRouter API key not set. Please configure it in settings.',
                'Open Settings'
            ).then(selection => {
                if (selection === 'Open Settings') {
                    vscode.commands.executeCommand('vibeassist.showSettings');
                }
            });
        }
        return apiKey;
    }

    isLanguageSupported(language: string): boolean {
        const supportedLanguages = this.config.get<string[]>('supportedLanguages', ['python']);
        return supportedLanguages.includes(language.toLowerCase());
    }

    shouldAutoApplyFixes(): boolean {
        return this.config.get<boolean>('autoApplyFixes', false);
    }

    getModelName(): string {
        return this.config.get<string>('modelName', 'anthropic/claude-3.5-sonnet');
    }
}

