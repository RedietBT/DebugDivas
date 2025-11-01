export interface ParsedError {
    language: string;
    errorType: string;
    message: string;
    stackTrace?: string;
    filePath?: string;
    lineNumber?: number;
    rawOutput: string;
    timestamp: Date;
}

export interface ErrorAnalysis {
    errorCause: string;
    suggestedFix: string;
    codeChanges?: CodeChange[];
    confidence: number;
    additionalInfo?: string;
}

export interface CodeChange {
    filePath: string;
    lineNumber?: number;
    oldCode?: string;
    newCode: string;
    description: string;
}

export interface ErrorContext {
    projectType?: string;
    dependencies?: Record<string, string>;
    framework?: string;
    configurations?: Record<string, unknown>;
    customContext?: string;
}

