// Amharic Translation Utility
// Translates error analysis to Amharic (አማርኛ)

import { Analysis } from '@/types'

interface AmharicAnalysis {
  rootCause: string
  explanation: string
  fixCode?: string
  fixConfig?: string
  commands: string[]
  successCriteria: string
  confidence: number
}

/**
 * Translate analysis to Amharic
 */
export function translateToAmharic(analysis: Analysis): AmharicAnalysis {
  return {
    rootCause: translateRootCause(analysis.rootCause),
    explanation: translateExplanation(analysis.explanation),
    fixCode: analysis.fixCode, // Code stays in English
    fixConfig: analysis.fixConfig, // Config stays in English
    commands: analysis.commands, // Commands stay in English
    successCriteria: translateSuccessCriteria(analysis.successCriteria),
    confidence: analysis.confidence
  }
}

/**
 * Common error translations
 */
const translations: Record<string, string> = {
  // Root causes
  'Division by zero': 'በዜሮ መከፋፈል',
  'Attempting to access a property on an undefined or null object': 'ባልተገለፀ ወይም ባዶ ነገር ላይ ንብረትን ማግኘት መሞከር',
  'Required dependency is not installed': 'የሚያስፈልግ ጥገኝነት አልተጫነም',
  'Required Python module is not installed': 'የሚያስፈልግ የፓይዘን ሞዱል አልተጫነም',
  'Docker build failed': 'የዶከር ግንባታ ተከስቷል',
  'The requested resource or endpoint was not found': 'የተጠየቀው ግብአት ወይም መንገድ አልተገኘም',
  'Cannot connect to the server': 'ከሰርቨሩ ጋር መገናኘት አልተቻለም',
  'Out of memory error': 'የማህደረ ትውስታ እጥረት ስህተት',
  'Invalid syntax in the code': 'በኮዱ ውስጥ ልክ ያልሆነ አገባብ',
  'Attempting to access a list index that doesn\'t exist': 'የማይኖር የዝርዝር ቁጥር ማግኘት መሞከር',
  'Attempting to access a dictionary key that doesn\'t exist': 'የማይኖር የመዝገበ-ቃላት ቁልፍ ማግኘት መሞከር',
  'Cross-Origin Resource Sharing (CORS) policy blocking the request': 'የ CORS ፖሊሲ ጥያቄውን እየገደበ ነው',
  'Git command failed': 'የ Git ትዕዛዝ ተሳክቷል',
  'Error detected in the application code or configuration': 'በመተግበሪያው ኮድ ወይም ውቅረት ውስጥ ስህተት ተገኝቷል',
  
  // Common phrases
  'attempting to divide a number by zero': 'አንድ ቁጥርን በዜሮ ለመከፋፈል መሞከር',
  'variable': 'ተለዋዋጭ',
  'function': 'ተግባር',
  'error': 'ስህተት',
  'code': 'ኮድ',
  'file': 'ፋይል',
  'line': 'መስመር',
  'undefined': 'ያልተገለፀ',
  'null': 'ባዶ',
  'missing': 'የጎደለ',
  'install': 'ይጫኑ',
  'package': 'ጥቅል',
  'module': 'ሞዱል',
  'dependency': 'ጥገኝነት',
  'configuration': 'ውቅረት',
  'syntax': 'አገባብ',
}

function translateRootCause(text: string): string {
  // Try exact match first
  if (translations[text]) {
    return translations[text]
  }
  
  // Try partial matches
  let translated = text
  for (const [english, amharic] of Object.entries(translations)) {
    if (text.toLowerCase().includes(english.toLowerCase())) {
      translated = translated.replace(new RegExp(english, 'gi'), amharic)
    }
  }
  
  return translated
}

function translateExplanation(text: string): string {
  // Common explanation patterns in Amharic
  const patterns: Record<string, string> = {
    'This error occurs when': 'ይህ ስህተት የሚከሰተው በሚከተሉት ጊዜዎች ነው',
    'You need to': 'መስራት ያለቦት',
    'The application is trying to': 'መተግበሪያው እየሞከረ ያለው',
    'Make sure': 'ያረጋግጡ',
    'Check': 'ያረጋግጡ',
    'Install': 'ይጫኑ',
    'Add': 'ይጨምሩ',
    'Fix': 'ያስተካክሉ',
    'Update': 'ያዘምኑ',
    'Common issues include': 'የተለመዱ ጉዳዮች የሚከተሉትን ያካትታሉ',
    'This typically means': 'ይህ ብዙውን ጊዜ ማለት',
    'The script': 'ስክሪፕቱ',
    'The code': 'ኮዱ',
    'In your code': 'በኮድዎ ውስጥ',
    'is set to': 'ተቀምጧል',
    'before performing': 'ከማከናወን በፊት',
  }
  
  let translated = text
  for (const [english, amharic] of Object.entries(patterns)) {
    translated = translated.replace(new RegExp(english, 'gi'), amharic)
  }
  
  // Replace common words
  for (const [english, amharic] of Object.entries(translations)) {
    translated = translated.replace(new RegExp(`\\b${english}\\b`, 'gi'), amharic)
  }
  
  return translated
}

function translateSuccessCriteria(text: string): string {
  const patterns: Record<string, string> = {
    'The application runs without': 'መተግበሪያው ያለ',
    'successfully': 'በተሳካ ሁኔታ',
    'and handles': 'እና በሚከተለው መንገድ ይይዛል',
    'gracefully': 'በጥሩ ሁኔታ',
    'should be resolved': 'መፍትሄ መያዝ አለበት',
    'works without errors': 'ያለ ስህተት ይሰራል',
    'runs without errors': 'ያለ ስህተት ይሮጣል',
    'executes without errors': 'ያለ ስህተት ይፈፅማል',
    'no longer appears': 'ከዚህ በኋላ አይታይም',
  }
  
  let translated = text
  for (const [english, amharic] of Object.entries(patterns)) {
    translated = translated.replace(new RegExp(english, 'gi'), amharic)
  }
  
  return translated
}

/**
 * Get section headers in Amharic
 */
export const amharicHeaders = {
  rootCause: '🎯 ዋና ምክንያት',
  explanation: '🧠 ማብራሪያ',
  fixCode: '🛠️ የመፍትሄ ኮድ',
  fixConfig: '⚙️ የውቅረት መፍትሄ',
  commands: '💻 ለማስኬድ የሚሆኑ ትዕዛዞች',
  successCriteria: '🏁 የስኬት መስፈርቶች',
  similarLogs: '✨ ተመሳሳይ ያለፉ ስህተቶች ተገኝተዋል!',
  category: '📂 ምድብ',
  confidence: 'እምነት'
}

