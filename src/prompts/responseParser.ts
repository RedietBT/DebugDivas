// Team Member 3: AI Prompts
// Parse AI responses into structured Analysis objects

import { Analysis } from '@/types'

/**
 * Parse AI text response into structured Analysis object
 */
export function parseResponse(responseText: string): Analysis {
  // TODO: Implement robust parsing
  // Extract sections: Root Cause, Explanation, Fix Code, Commands, Success Criteria
  
  const sections = {
    rootCause: extractSection(responseText, 'Root Cause'),
    explanation: extractSection(responseText, 'Explanation'),
    fixCode: extractCodeBlock(responseText, 'Fix Code'),
    fixConfig: extractCodeBlock(responseText, 'Fix Configuration'),
    commands: extractCommands(responseText),
    successCriteria: extractSection(responseText, 'Success Criteria')
  }

  return {
    rootCause: sections.rootCause || 'Unknown error',
    explanation: sections.explanation || 'Unable to determine explanation',
    fixCode: sections.fixCode,
    fixConfig: sections.fixConfig,
    commands: sections.commands,
    successCriteria: sections.successCriteria || 'Error should be resolved',
    confidence: 75 // TODO: Calculate confidence based on response quality
  }
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`##\\s*${sectionName}\\s*\\n([\\s\\S]*?)(?=##|$)`, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : ''
}

function extractCodeBlock(text: string, precedingText: string): string | undefined {
  const regex = new RegExp(`${precedingText}[\\s\\S]*?\`\`\`[\\w]*\\n([\\s\\S]*?)\`\`\``, 'i')
  const match = text.match(regex)
  return match ? match[1].trim() : undefined
}

function extractCommands(text: string): string[] {
  const commandSection = extractSection(text, 'Commands to Run')
  if (!commandSection) return []
  
  // Extract from code block
  const codeBlockMatch = commandSection.match(/```[\w]*\n([\s\S]*?)```/)
  const commandText = codeBlockMatch ? codeBlockMatch[1] : commandSection
  
  // Split by newlines and filter out comments/empty lines
  return commandText
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'))
}

