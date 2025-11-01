import React from 'react'
import { LogType } from '@/types'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Sparkles } from 'lucide-react'

interface LogInputPanelProps {
  value: string
  onChange: (value: string) => void
  selectedType: LogType | 'auto'
  onTypeChange: (type: LogType | 'auto') => void
  onAnalyze: () => void
  onLoadSample?: (sampleKey: string) => void
  isAnalyzing: boolean
}

export const LogInputPanel: React.FC<LogInputPanelProps> = ({
  value,
  onChange,
  selectedType,
  onTypeChange,
  onAnalyze,
  onLoadSample,
  isAnalyzing
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Paste Your Error Logs
        </CardTitle>
        <CardDescription>
          Paste stack traces, CI/CD logs, Docker errors, or deployment failures below.
          Vibe Assist will analyze and suggest fixes.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Textarea */}
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-64 font-mono text-sm resize-y"
          placeholder="Paste your error logs here..."
        />
        
        {/* Character count */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{value.length} characters</span>
        </div>
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            {/* Log type dropdown */}
            <Select value={selectedType} onValueChange={(v) => onTypeChange(v as LogType | 'auto')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select log type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect</SelectItem>
                <SelectItem value="node">Node.js</SelectItem>
                <SelectItem value="python">Python</SelectItem>
                <SelectItem value="docker">Docker</SelectItem>
                <SelectItem value="github_actions">GitHub Actions</SelectItem>
                <SelectItem value="vercel">Vercel</SelectItem>
                <SelectItem value="nginx">Nginx</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Clear button */}
            <Button
              onClick={() => onChange('')}
              variant="ghost"
              size="sm"
              disabled={!value}
            >
              Clear
            </Button>
          </div>
          
          {/* Analyze button */}
          <Button
            onClick={onAnalyze}
            disabled={!value.trim() || isAnalyzing}
            size="lg"
            className="w-full sm:w-auto"
          >
            {isAnalyzing ? (
              <>Analyzing...</>
            ) : (
              <>Analyze Log</>
            )}
          </Button>
        </div>
        
        {/* Sample logs */}
        {onLoadSample && (
          <div className="pt-4 border-t space-y-2">
            <p className="text-sm text-muted-foreground">Quick Test:</p>
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => onLoadSample('node')}
              >
                Node.js Error
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => onLoadSample('python')}
              >
                Python Error
              </Badge>
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-accent"
                onClick={() => onLoadSample('docker')}
              >
                Docker Error
              </Badge>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

