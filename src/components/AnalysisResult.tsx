import React from 'react'
import { Analysis } from '@/types'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { CopyButton } from './CopyButton'
import { translateToAmharic, amharicHeaders } from '@/utils/amharicTranslator'
import { Target, Brain, Wrench, Settings, Terminal, CheckCircle } from 'lucide-react'

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
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              {headers.rootCause}
            </CardTitle>
            <Badge variant="secondary">
              {displayAnalysis.confidence}% {headers.confidence}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg">{displayAnalysis.rootCause}</p>
        </CardContent>
      </Card>

      {/* Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            {headers.explanation}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{displayAnalysis.explanation}</p>
        </CardContent>
      </Card>

      {/* Fix Code */}
      {displayAnalysis.fixCode && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                {headers.fixCode}
              </CardTitle>
              <CopyButton text={displayAnalysis.fixCode} onCopy={onCopy} />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="text-sm font-mono">{displayAnalysis.fixCode}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Fix Config */}
      {displayAnalysis.fixConfig && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                {headers.fixConfig}
              </CardTitle>
              <CopyButton text={displayAnalysis.fixConfig} onCopy={onCopy} />
            </div>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="text-sm font-mono">{displayAnalysis.fixConfig}</code>
            </pre>
          </CardContent>
        </Card>
      )}

      {/* Commands */}
      {displayAnalysis.commands && displayAnalysis.commands.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              {headers.commands}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {displayAnalysis.commands.map((cmd, idx) => (
              <div key={idx} className="flex items-center justify-between bg-muted p-3 rounded-md">
                <code className="text-sm font-mono flex-1">{cmd}</code>
                <CopyButton text={cmd} onCopy={onCopy} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Success Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            {headers.successCriteria}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{displayAnalysis.successCriteria}</p>
        </CardContent>
      </Card>
    </div>
  )
}

