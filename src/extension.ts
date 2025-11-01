import * as vscode from 'vscode';
import { TerminalMonitor } from './monitors/terminalMonitor';
import { ContextGenerator } from './context/contextGenerator';
import { NotificationManager } from './ui/notificationManager';
import { ConfigurationManager } from './config/configurationManager';
import { AnalysisService } from './ai/analysisService';

let terminalMonitor: TerminalMonitor | undefined;
let contextGenerator: ContextGenerator | undefined;
let notificationManager: NotificationManager | undefined;
let configManager: ConfigurationManager | undefined;
let analysisService: AnalysisService | undefined;

export function activate(context: vscode.ExtensionContext) {
    console.log('VibeAssist is now active!');

    // Initialize managers
    configManager = new ConfigurationManager();
    contextGenerator = new ContextGenerator();
    analysisService = new AnalysisService(configManager, contextGenerator);
    notificationManager = new NotificationManager(context);
    notificationManager.setAnalysisService(analysisService);
    terminalMonitor = new TerminalMonitor(notificationManager, configManager);

    // Register commands
    const generateContextCommand = vscode.commands.registerCommand(
        'vibeassist.generateContext',
        async () => {
            try {
                await contextGenerator!.generateContextFile();
                vscode.window.showInformationMessage('VibeAssist: Context file generated successfully!');
            } catch (error) {
                vscode.window.showErrorMessage(`VibeAssist: Failed to generate context - ${error}`);
            }
        }
    );

    const toggleMonitoringCommand = vscode.commands.registerCommand(
        'vibeassist.toggleMonitoring',
        () => {
            if (terminalMonitor) {
                const isEnabled = terminalMonitor.toggleMonitoring();
                vscode.window.showInformationMessage(
                    `VibeAssist: Error monitoring ${isEnabled ? 'enabled' : 'disabled'}`
                );
            }
        }
    );

    const showSettingsCommand = vscode.commands.registerCommand(
        'vibeassist.showSettings',
        () => {
            vscode.commands.executeCommand('workbench.action.openSettings', 'vibeassist');
        }
    );

    const analyzeFromClipboardCommand = vscode.commands.registerCommand(
        'vibeassist.analyzeFromClipboard',
        async () => {
            if (terminalMonitor) {
                await terminalMonitor.analyzeFromClipboard();
            }
        }
    );

    const analyzeFromSelectionCommand = vscode.commands.registerCommand(
        'vibeassist.analyzeFromSelection',
        async () => {
            if (terminalMonitor) {
                await terminalMonitor.analyzeFromSelection();
            }
        }
    );

    // Add to subscriptions
    context.subscriptions.push(
        generateContextCommand,
        toggleMonitoringCommand,
        showSettingsCommand,
        analyzeFromClipboardCommand,
        analyzeFromSelectionCommand
    );

    // Start monitoring if enabled
    const config = vscode.workspace.getConfiguration('vibeassist');
    if (config.get<boolean>('enableAutoMonitoring', true)) {
        terminalMonitor.startMonitoring();
        vscode.window.showInformationMessage('VibeAssist: Error monitoring started');
    }

    // Show welcome message on first activation
    const hasShownWelcome = context.globalState.get<boolean>('hasShownWelcome', false);
    if (!hasShownWelcome) {
        showWelcomeMessage(context);
        context.globalState.update('hasShownWelcome', true);
    }
}

function showWelcomeMessage(context: vscode.ExtensionContext) {
    const message = 'Welcome to VibeAssist! Set your OpenRouter API key in settings to get started.';
    vscode.window.showInformationMessage(message, 'Open Settings', 'Dismiss').then(selection => {
        if (selection === 'Open Settings') {
            vscode.commands.executeCommand('vibeassist.showSettings');
        }
    });
}

export function deactivate() {
    if (terminalMonitor) {
        terminalMonitor.dispose();
    }
    console.log('VibeAssist deactivated');
}

