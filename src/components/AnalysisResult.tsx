// Team Member 1: UI Components
// TODO: Implement analysis result display
// See TEAM_TASKS.md for requirements

import React from 'react'
import { Analysis } from '@/types'
import { Card } from './Card'
import { CopyButton } from './CopyButton'
import { translateToAmharic, amharicHeaders } from '@/utils/amharicTranslator'

interface AnalysisResultProps {
  analysis: Analysis
  onCopy?: (text: string) => Promise<boolean>
  showAmharic?: boolean
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  onCopy,
  showAmharic = false
}) => {
  // Get translated version if needed
  const displayAnalysis = showAmharic ? translateToAmharic(analysis) : analysis
  const headers = showAmharic ? amharicHeaders : {
    rootCause: '🎯 Root Cause',
    explanation: '🧠 Explanation',
    fixCode: '🛠️ Fix Code',
    fixConfig: '⚙️ Fix Configuration',
    commands: '💻 Commands to Run',
    successCriteria: '🏁 Success Criteria',
    confidence: 'confident'
  }

  return (
    <div className="space-y-4">
      {/* Root Cause */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-cursor-text mb-2">
              {headers.rootCause}
            </h3>
            <p className="text-lg text-white">{displayAnalysis.rootCause}</p>
          </div>
          <div className="text-sm text-cursor-text">
            {displayAnalysis.confidence}% {headers.confidence}
          </div>
        </div>
      </Card>

      {/* Explanation */}
      <Card>
        <h3 className="text-sm font-semibold text-cursor-text mb-2">
          {headers.explanation}
        </h3>
        <p className="text-cursor-text">{displayAnalysis.explanation}</p>
      </Card>

      {/* Fix Code */}
      {displayAnalysis.fixCode && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cursor-text">
              {headers.fixCode}
            </h3>
            <CopyButton text={displayAnalysis.fixCode} onCopy={onCopy} />
          </div>
          <pre className="bg-cursor-bg p-4 rounded overflow-x-auto">
            <code className="text-sm text-cursor-text">{displayAnalysis.fixCode}</code>
          </pre>
        </Card>
      )}

      {/* Fix Config */}
      {displayAnalysis.fixConfig && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cursor-text">
              {headers.fixConfig}
            </h3>
            <CopyButton text={displayAnalysis.fixConfig} onCopy={onCopy} />
          </div>
          <pre className="bg-cursor-bg p-4 rounded overflow-x-auto">
            <code className="text-sm text-cursor-text">{displayAnalysis.fixConfig}</code>
          </pre>
        </Card>
      )}

      {/* Commands */}
      {displayAnalysis.commands && displayAnalysis.commands.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-cursor-text mb-2">
            {headers.commands}
          </h3>
          <div className="space-y-2">
            {displayAnalysis.commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center justify-between bg-cursor-bg p-3 rounded">
                <code className="text-sm text-cursor-text">{cmd}</code>
                <CopyButton text={cmd} onCopy={onCopy} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Success Criteria */}
      <Card>
        <h3 className="text-sm font-semibold text-cursor-text mb-2">
          {headers.successCriteria}
        </h3>
        <p className="text-cursor-text">{displayAnalysis.successCriteria}</p>
      </Card>
    </div>
  )
}

