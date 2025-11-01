import axios, { AxiosInstance } from 'axios';
import { ParsedError, ErrorAnalysis, ErrorContext } from '../types/error';

export interface OpenRouterMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface OpenRouterResponse {
    id: string;
    choices: Array<{
        message: {
            role: string;
            content: string;
        };
        finish_reason: string;
    }>;
    usage?: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}

export class OpenRouterClient {
    private client: AxiosInstance;
    private readonly baseURL = 'https://openrouter.ai/api/v1';
    
    constructor(private apiKey: string, private modelName: string = 'anthropic/claude-3.5-sonnet') {
        this.client = axios.create({
            baseURL: this.baseURL,
            headers: {
                'Authorization': `Bearer ${this.apiKey}`,
                'HTTP-Referer': 'https://github.com/vibeassist/vibeassist',
                'X-Title': 'VibeAssist',
                'Content-Type': 'application/json'
            },
            timeout: 60000 // 60 second timeout
        });
    }

    async analyzeError(
        error: ParsedError,
        context?: ErrorContext
    ): Promise<ErrorAnalysis> {
        const prompt = this.buildPrompt(error, context);
        
        try {
            const response = await this.makeRequest(prompt);
            return this.parseAnalysisResponse(response);
        } catch (error) {
            console.error('OpenRouter API error:', error);
            throw new Error(`Failed to analyze error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private buildPrompt(error: ParsedError, context?: ErrorContext): string {
        let prompt = `You are an expert software engineer helping to debug and fix code errors. Analyze the following error and provide a solution.

**Error Information:**
- Language: ${error.language}
- Error Type: ${error.errorType}
- Error Message: ${error.message}`;

        if (error.filePath) {
            prompt += `\n- File: ${error.filePath}`;
        }
        if (error.lineNumber) {
            prompt += `\n- Line Number: ${error.lineNumber}`;
        }
        if (error.stackTrace) {
            prompt += `\n\n**Stack Trace:**\n\`\`\`\n${error.stackTrace}\n\`\`\``;
        }

        prompt += `\n\n**Raw Output:**\n\`\`\`\n${error.rawOutput}\n\`\`\``;

        if (context) {
            prompt += '\n\n**Project Context:**';
            if (context.projectType) {
                prompt += `\n- Project Type: ${context.projectType}`;
            }
            if (context.framework) {
                prompt += `\n- Framework: ${context.framework}`;
            }
            if (context.dependencies && Object.keys(context.dependencies).length > 0) {
                prompt += `\n- Dependencies: ${JSON.stringify(context.dependencies, null, 2)}`;
            }
            if (context.customContext) {
                prompt += `\n- Additional Context: ${context.customContext}`;
            }
        }

        prompt += `\n\n**Instructions:**
Please provide a comprehensive analysis in the following JSON format:

{
  "errorCause": "Brief explanation of what caused the error",
  "suggestedFix": "Step-by-step instructions on how to fix it",
  "codeChanges": [
    {
      "filePath": "path/to/file.py",
      "lineNumber": 10,
      "oldCode": "problematic code (if applicable)",
      "newCode": "corrected code",
      "description": "what this change does"
    }
  ],
  "confidence": 0.95,
  "additionalInfo": "Any additional notes or considerations"
}

If you cannot determine specific code changes, provide detailed instructions in the "suggestedFix" field. Be concise but thorough. Only respond with valid JSON, no additional text.`;

        return prompt;
    }

    private async makeRequest(userMessage: string, retries: number = 2): Promise<string> {
        const messages: OpenRouterMessage[] = [
            {
                role: 'user',
                content: userMessage
            }
        ];

        for (let attempt = 0; attempt <= retries; attempt++) {
            try {
                const response = await this.client.post<OpenRouterResponse>('/chat/completions', {
                    model: this.modelName,
                    messages: messages,
                    temperature: 0.3, // Lower temperature for more consistent, focused responses
                    max_tokens: 2000
                });

                if (response.data.choices && response.data.choices.length > 0) {
                    return response.data.choices[0].message.content;
                } else {
                    throw new Error('No response from OpenRouter');
                }
            } catch (error) {
                if (attempt === retries) {
                    throw error;
                }
                // Wait before retrying (exponential backoff)
                await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
            }
        }

        throw new Error('Max retries exceeded');
    }

    private parseAnalysisResponse(response: string): ErrorAnalysis {
        try {
            // Try to extract JSON from the response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No JSON found in response');
            }

            const parsed = JSON.parse(jsonMatch[0]);
            
            return {
                errorCause: parsed.errorCause || 'Unknown cause',
                suggestedFix: parsed.suggestedFix || 'No fix suggestion available',
                codeChanges: parsed.codeChanges || [],
                confidence: parsed.confidence || 0.5,
                additionalInfo: parsed.additionalInfo
            };
        } catch (error) {
            console.error('Failed to parse OpenRouter response:', error);
            // Fallback: return the raw response as suggestedFix
            return {
                errorCause: 'Analysis parsing failed',
                suggestedFix: response,
                codeChanges: [],
                confidence: 0.3
            };
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.makeRequest('Test connection. Respond with "OK".');
            return true;
        } catch {
            return false;
        }
    }
}

