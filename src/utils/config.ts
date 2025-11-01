// Team Member 5: Utilities
// Application configuration

import { StorageConfig } from '@/types'

export const APP_CONFIG = {
  name: 'DevFix.AI',
  version: '1.0.0',
  author: 'DebugDivas',
  
  storage: {
    maxLogs: 1000,
    storageType: 'localStorage' as const,
    autoSave: true
  } as StorageConfig,
  
  ai: {
    provider: 'mock' as 'openai' | 'cursor' | 'mock',
    maxTokens: 1000,
    temperature: 0.7,
    model: 'gpt-4'
  },
  
  ui: {
    theme: 'dark' as const,
    animationsEnabled: true,
    defaultTab: 'analyze' as 'analyze' | 'history'
  }
}

export function getConfig<K extends keyof typeof APP_CONFIG>(key: K): typeof APP_CONFIG[K] {
  return APP_CONFIG[key]
}

export function getAPIKey(): string {
  // TODO: Implement secure API key storage
  // For now, return empty string (using mock mode)
  return process.env.OPENAI_API_KEY || ''
}

