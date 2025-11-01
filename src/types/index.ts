// Shared TypeScript types for the entire project

export type LogType = 
  | 'node' 
  | 'python' 
  | 'docker' 
  | 'github_actions' 
  | 'vercel' 
  | 'nginx'
  | 'general';

export interface ErrorLog {
  id: string;
  timestamp: Date;
  logType: LogType;
  rawLog: string;
  analysis?: Analysis;
  tags: string[];
  isFavorite: boolean;
}

export interface Analysis {
  rootCause: string;
  explanation: string;
  fixCode?: string;
  fixConfig?: string;
  commands: string[];
  successCriteria: string;
  confidence: number; // 0-100
}

export interface DetectionResult {
  logType: LogType;
  confidence: number;
  patterns: string[];
}

export interface PromptTemplate {
  system: string;
  user: string;
  examples?: Array<{
    input: string;
    output: string;
  }>;
}

export interface StorageConfig {
  maxLogs: number;
  storageType: 'localStorage' | 'file' | 'indexedDB';
  autoSave: boolean;
}

export interface SearchFilters {
  logType?: LogType;
  dateFrom?: Date;
  dateTo?: Date;
  searchTerm?: string;
  tags?: string[];
  isFavorite?: boolean;
}

export interface ExportData {
  version: string;
  exportDate: Date;
  logs: ErrorLog[];
}

