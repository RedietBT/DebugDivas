// Team Member 1: UI Components
// TODO: Implement analysis result display
// See TEAM_TASKS.md for requirements

import React from 'react'
import { Analysis } from '@/types'
import { Card } from './Card'
import { CopyButton } from './CopyButton'

interface AnalysisResultProps {
  analysis: Analysis
  onCopy?: (text: string) => Promise<boolean>
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({
  analysis,
  onCopy
}) => {
  return (
    <div className="space-y-4">
      {/* Root Cause */}
      <Card>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-cursor-text mb-2">
              🎯 Root Cause
            </h3>
            <p className="text-lg text-white">{analysis.rootCause}</p>
          </div>
          <div className="text-sm text-cursor-text">
            {analysis.confidence}% confident
          </div>
        </div>
      </Card>

      {/* Explanation */}
      <Card>
        <h3 className="text-sm font-semibold text-cursor-text mb-2">
          🧠 Explanation
        </h3>
        <p className="text-cursor-text">{analysis.explanation}</p>
      </Card>

      {/* Fix Code */}
      {analysis.fixCode && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cursor-text">
              🛠️ Fix Code
            </h3>
            <CopyButton text={analysis.fixCode} onCopy={onCopy} />
          </div>
          <pre className="bg-cursor-bg p-4 rounded overflow-x-auto">
            <code className="text-sm text-cursor-text">{analysis.fixCode}</code>
          </pre>
        </Card>
      )}

      {/* Fix Config */}
      {analysis.fixConfig && (
        <Card>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-cursor-text">
              ⚙️ Fix Configuration
            </h3>
            <CopyButton text={analysis.fixConfig} onCopy={onCopy} />
          </div>
          <pre className="bg-cursor-bg p-4 rounded overflow-x-auto">
            <code className="text-sm text-cursor-text">{analysis.fixConfig}</code>
          </pre>
        </Card>
      )}

      {/* Commands */}
      {analysis.commands && analysis.commands.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-cursor-text mb-2">
            💻 Commands to Run
          </h3>
          <div className="space-y-2">
            {analysis.commands.map((cmd, idx) => (
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
          🏁 Success Criteria
        </h3>
        <p className="text-cursor-text">{analysis.successCriteria}</p>
      </Card>
    </div>
  )
}

