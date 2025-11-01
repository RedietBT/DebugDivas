// Team Member 2: Core Logic
// Error categorization

export type ErrorCategory = 
  | 'syntax'
  | 'runtime'
  | 'dependency'
  | 'configuration'
  | 'network'
  | 'permission'
  | 'other'

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical'

export function categorizeError(errorMessage: string): ErrorCategory {
  const categories: Record<ErrorCategory, RegExp[]> = {
    syntax: [/SyntaxError/, /IndentationError/, /ParseError/],
    runtime: [/TypeError/, /ReferenceError/, /RangeError/, /NullPointerException/],
    dependency: [/ModuleNotFoundError/, /Cannot find module/, /ImportError/],
    configuration: [/ENOENT/, /EACCES/, /config/, /environment/i],
    network: [/ECONNREFUSED/, /ETIMEDOUT/, /network/, /fetch failed/],
    permission: [/EACCES/, /permission denied/, /unauthorized/i],
    other: []
  }
  
  for (const [category, patterns] of Object.entries(categories) as [ErrorCategory, RegExp[]][]) {
    for (const pattern of patterns) {
      if (pattern.test(errorMessage)) {
        return category
      }
    }
  }
  
  return 'other'
}

