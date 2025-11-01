import { OpenRouterClient } from './openRouterClient';
import { ParsedError, ErrorAnalysis, ErrorContext } from '../types/error';
import { ContextGenerator } from '../context/contextGenerator';
import { ConfigurationManager } from '../config/configurationManager';

export class AnalysisService {
    private openRouterClient: OpenRouterClient | null = null;
    
    constructor(
        private configManager: ConfigurationManager,
        private contextGenerator: ContextGenerator
    ) {
        this.initializeClient();
    }

    private initializeClient(): void {
        const apiKey = this.configManager.getApiKey();
        if (apiKey) {
            const modelName = this.configManager.getModelName();
            this.openRouterClient = new OpenRouterClient(apiKey, modelName);
        }
    }

    async analyzeError(error: ParsedError): Promise<ErrorAnalysis> {
        // Reinitialize client in case API key was updated
        this.initializeClient();

        if (!this.openRouterClient) {
            throw new Error('OpenRouter API key not configured. Please set it in settings.');
        }

        // Load or auto-generate context
        let context = await this.contextGenerator.loadContextFile();
        
        if (!context) {
            console.log('VibeAssist: No context file found, analyzing without context');
            context = {
                customContext: 'No project context available. Consider running "VibeAssist: Generate Project Context" command.'
            };
        }

        // Analyze the error with context
        try {
            const analysis = await this.openRouterClient.analyzeError(error, context);
            console.log('VibeAssist: Error analysis completed', analysis);
            return analysis;
        } catch (error) {
            console.error('VibeAssist: Analysis failed', error);
            throw new Error(`Failed to analyze error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async testConnection(): Promise<boolean> {
        this.initializeClient();
        
        if (!this.openRouterClient) {
            return false;
        }

        try {
            return await this.openRouterClient.testConnection();
        } catch {
            return false;
        }
    }
}

