// Team Member 3: AI Prompts
// Parse AI responses into structured Analysis objects

import { Analysis } from '@/types'

/**
 * Parse AI text response into structured Analysis object
 */
export function parseResponse(responseText: string): Analysis {
  // Debug: Log the raw response
  console.log('📄 Parsing AI response:', responseText.substring(0, 200) + '...')
  
  // Extract sections: Root Cause, Explanation, Fix Code, Commands, Success Criteria
  const sections = {
    rootCause: extractSection(responseText, 'Root Cause'),
    explanation: extractSection(responseText, 'Explanation'),
    fixCode: extractCodeBlock(responseText, 'Fix Code'),
    fixConfig: extractCodeBlock(responseText, 'Fix Configuration'),
    commands: extractCommands(responseText),
    successCriteria: extractSection(responseText, 'Success Criteria')
  }

  console.log('📊 Extracted sections:', {
    rootCause: sections.rootCause ? '✅' : '❌',
    explanation: sections.explanation ? '✅' : '❌',
    fixCode: sections.fixCode ? '✅' : '❌',
    commands: sections.commands.length
  })

  return {
    rootCause: sections.rootCause || 'Unable to parse root cause',
    explanation: sections.explanation || 'Unable to parse explanation',
    fixCode: sections.fixCode,
    fixConfig: sections.fixConfig,
    commands: sections.commands.length > 0 ? sections.commands : ['No commands provided'],
    successCriteria: sections.successCriteria || 'Error should be resolved',
    confidence: sections.rootCause && sections.explanation ? 85 : 50
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

