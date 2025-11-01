import { useState, useEffect } from 'react'
import './App.css'
import { LogInputPanel, AnalysisResult, LogHistory, LoadingSpinner } from './components'
import { detectLogType } from './core'
import { buildPrompt, parseResponse, SAMPLE_LOGS } from './prompts'
import { saveLog, getAllLogs, searchLogs, deleteLog, initializeStorage } from './storage'
import { callAI, generateId, copyToClipboard } from './utils'
import { findSimilarLogs, categorizeError } from './utils/logMatcher'
import { ErrorLog, Analysis, LogType, SearchFilters } from './types'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card'
import { Badge } from './components/ui/badge'
import { Button } from './components/ui/button'
import { Sparkles, History, ChevronDown, ChevronUp } from 'lucide-react'
import { ThemeToggle } from './components/theme-toggle'

function App() {
  // State
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze')
  const [logInput, setLogInput] = useState('')
  const [selectedType, setSelectedType] = useState<LogType | 'auto'>('auto')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null)
  const [savedLogs, setSavedLogs] = useState<ErrorLog[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})
  const [similarLogs, setSimilarLogs] = useState<ErrorLog[]>([])
  const [errorCategory, setErrorCategory] = useState<string>('')
  const [showAmharic, setShowAmharic] = useState<boolean>(false)
  const [expandedSimilarLog, setExpandedSimilarLog] = useState<string | null>(null)

  // Initialize storage on mount
  useEffect(() => {
    initializeStorage()
    loadLogs()
  }, [])

  async function loadLogs() {
    const logs = await getAllLogs()
    setSavedLogs(logs)
  }

  // Main analysis function
  async function handleAnalyze() {
    if (!logInput.trim()) {
      alert('Please paste an error log first!')
      return
    }

    setIsAnalyzing(true)
    setCurrentAnalysis(null)
    setSimilarLogs([])
    setErrorCategory('')

    try {
      // 1. Detect log type
      const detection = detectLogType(logInput)
      const logType = selectedType === 'auto' ? detection.logType : selectedType

      console.log('🔍 Detected log type:', logType, 'with confidence:', detection.confidence + '%')

      // 2. Categorize error
      const category = categorizeError(logInput)
      setErrorCategory(category)
      console.log('📂 Error category:', category)

      // 3. Find similar past logs
      const allLogs = await getAllLogs()
      const similar = findSimilarLogs(logInput, logType, allLogs)
      setSimilarLogs(similar)
      if (similar.length > 0) {
        console.log(`✨ Found ${similar.length} similar past error(s)!`)
      }

      // 4. Build AI prompt
      const prompt = buildPrompt(logType, logInput)

      // 5. Call AI API (using mock for now)
      console.log('🤖 Calling AI...')
      const aiResponse = await callAI({ prompt })

      // 6. Parse AI response
      const analysis = parseResponse(aiResponse.text)

      console.log('✅ Analysis complete:', analysis)

      // 7. Create error log object
      const errorLog: ErrorLog = {
        id: generateId(),
        timestamp: new Date(),
        logType: logType,
        rawLog: logInput,
        analysis: analysis,
        tags: [category], // Add category as tag
        isFavorite: false
      }

      // 8. Save to storage
      await saveLog(errorLog)
      console.log('💾 Log saved to storage!')

      // 9. Update UI
      setCurrentAnalysis(analysis)
      
      // 10. Reload log history
      await loadLogs()

      // Show success message with similar logs info
      const successMsg = similar.length > 0 
        ? `✅ Analysis complete! Found ${similar.length} similar past error(s).`
        : '✅ Analysis complete and saved to history!'
      alert(successMsg)

    } catch (error) {
      console.error('❌ Analysis failed:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  // Search logs
  async function handleSearch(filters: SearchFilters) {
    setSearchFilters(filters)
    const results = await searchLogs(filters)
    setSavedLogs(results)
  }

  // Copy code to clipboard
  async function handleCopy(text: string) {
    const success = await copyToClipboard(text)
    if (success) {
      alert('✅ Copied to clipboard!')
    } else {
      alert('❌ Failed to copy')
    }
  }

  // Load sample log
  function loadSample(sampleKey: string) {
    const samples: any = SAMPLE_LOGS
    const sample = samples[sampleKey]
    if (sample) {
      setLogInput(sample.error)
      setSelectedType(sampleKey as LogType)
    }
  }

  // Delete log
  async function handleDeleteLog(id: string) {
    await deleteLog(id)
    await loadLogs()
  }

  // Reload logs
  async function handleReloadLogs() {
    await loadLogs()
    alert('✅ Logs reloaded!')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-primary/60">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Vibe Assist</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Debug Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Badge variant="secondary" className="hidden sm:inline-flex">
              Built by DebugDivas
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'analyze' | 'history')} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="analyze" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Analyze Logs
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              History ({savedLogs.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="analyze" className="space-y-6"
          >
            {/* Input Panel */}
            <LogInputPanel
              value={logInput}
              onChange={setLogInput}
              selectedType={selectedType}
              onTypeChange={setSelectedType}
              onAnalyze={handleAnalyze}
              onLoadSample={loadSample}
              isAnalyzing={isAnalyzing}
            />

            {/* Loading State */}
            {isAnalyzing && <LoadingSpinner size="lg" text="Analyzing your error log..." />}

            {/* Similar Past Logs */}
            {similarLogs.length > 0 && !isAnalyzing && (
              <Card className="border-yellow-500/50 bg-yellow-500/5">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-yellow-500">
                    <Sparkles className="h-5 w-5" />
                    {showAmharic ? 'ተመሳሳይ ያለፉ ስህተቶች ተገኝተዋል!' : `Found ${similarLogs.length} Similar Past Error${similarLogs.length > 1 ? 's' : ''}!`}
                  </CardTitle>
                  <CardDescription>
                    {showAmharic 
                      ? 'ከዚህ በፊት ተመሳሳይ ስህተቶች አጋጥመውዎታል። የሰራውን እንመልከት:' 
                      : "You've encountered similar errors before. Here's what worked:"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {similarLogs.map((log) => {
                    const isExpanded = expandedSimilarLog === log.id
                    return (
                      <Card key={log.id} className="bg-card/50">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="default">{log.logType}</Badge>
                              {log.tags.map((tag, idx) => (
                                <Badge key={idx} variant="secondary">{tag}</Badge>
                              ))}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground">
                                {new Date(log.timestamp).toLocaleDateString()}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setExpandedSimilarLog(isExpanded ? null : log.id)}
                                className="h-8"
                              >
                                {isExpanded ? (
                                  <ChevronUp className="h-4 w-4" />
                                ) : (
                                  <ChevronDown className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm mb-2">
                            {log.analysis?.rootCause || 'No analysis available'}
                          </p>
                          {!isExpanded ? (
                            <p className="text-xs text-muted-foreground font-mono line-clamp-2">
                              {log.rawLog}
                            </p>
                          ) : (
                            <div className="mt-4 space-y-4 border-t pt-4">
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  {showAmharic ? 'ዋና ምክንያት:' : 'Root Cause:'}
                                </p>
                                <p className="text-sm">{log.analysis?.rootCause}</p>
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  {showAmharic ? 'ማብራሪያ:' : 'Explanation:'}
                                </p>
                                <p className="text-sm text-muted-foreground">{log.analysis?.explanation}</p>
                              </div>
                              {log.analysis?.fixCode && (
                                <div>
                                  <p className="text-xs font-semibold text-muted-foreground mb-1">
                                    {showAmharic ? 'የመፍትሄ ኮድ:' : 'Fix Code:'}
                                  </p>
                                  <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">
                                    <code className="font-mono">{log.analysis.fixCode}</code>
                                  </pre>
                                </div>
                              )}
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">
                                  {showAmharic ? 'የስህተቱ ቅጂ:' : 'Original Error:'}
                                </p>
                                <pre className="bg-muted rounded-md p-3 text-xs overflow-x-auto">
                                  <code className="font-mono">{log.rawLog}</code>
                                </pre>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </CardContent>
              </Card>
            )}

            {/* Translation Toggle & Category */}
            {(errorCategory || currentAnalysis) && !isAnalyzing && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {errorCategory && (
                        <>
                          <span className="text-sm text-muted-foreground">
                            {showAmharic ? 'ምድብ:' : 'Category:'}
                          </span>
                          <Badge variant="secondary" className="gap-1">
                            {errorCategory}
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    {/* Translation Toggle Button */}
                    <Button
                      onClick={() => setShowAmharic(!showAmharic)}
                      variant="outline"
                      size="sm"
                    >
                      <span>{showAmharic ? 'English' : 'አማርኛ'}</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Analysis Result */}
            {currentAnalysis && !isAnalyzing && (
              <AnalysisResult
                analysis={currentAnalysis}
                onCopy={handleCopy}
                showAmharic={showAmharic}
              />
            )}
          </TabsContent>

          <TabsContent value="history">
            {/* Log History */}
            <LogHistory
              logs={savedLogs}
              onSearch={handleSearch}
              onReload={handleReloadLogs}
              onDelete={handleDeleteLog}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

export default App


