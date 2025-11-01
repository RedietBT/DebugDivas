// Team Member 4: Log Storage
// Database initialization and management

import { StorageConfig } from '@/types'

const STORAGE_KEY = 'devfix_logs'
const CONFIG_KEY = 'devfix_config'

const DEFAULT_CONFIG: StorageConfig = {
  maxLogs: 1000,
  storageType: 'localStorage',
  autoSave: true
}

/**
 * Initialize storage system
 */
export function initializeStorage(): void {
  // Check if localStorage is available
  if (!isStorageAvailable()) {
    console.error('localStorage is not available')
    return
  }

  // Initialize config if not exists
  const config = localStorage.getItem(CONFIG_KEY)
  if (!config) {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG))
  }

  // Initialize logs array if not exists
  const logs = localStorage.getItem(STORAGE_KEY)
  if (!logs) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]))
  }

  console.log('DevFix.AI storage initialized')
}

/**
 * Check if localStorage is available
 */
export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch (e) {
    return false
  }
}

/**
 * Get storage configuration
 */
export function getStorageConfig(): StorageConfig {
  const config = localStorage.getItem(CONFIG_KEY)
  return config ? JSON.parse(config) : DEFAULT_CONFIG
}

/**
 * Get storage usage stats
 */
export function getStorageStats() {
  const logs = localStorage.getItem(STORAGE_KEY)
  const logCount = logs ? JSON.parse(logs).length : 0
  const storageSize = logs ? new Blob([logs]).size : 0

  return {
    logCount,
    storageSize,
    storageSizeFormatted: formatBytes(storageSize),
    maxLogs: DEFAULT_CONFIG.maxLogs
  }
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

