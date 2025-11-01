import { useState, useEffect } from 'react'
import './App.css'
import { LogInputPanel, AnalysisResult, LogHistory, LoadingSpinner } from './components'
import { detectLogType } from './core'
import { buildPrompt, parseResponse, SAMPLE_LOGS } from './prompts'
import { saveLog, getAllLogs, searchLogs, deleteLog, initializeStorage } from './storage'
import { callAI, generateId, copyToClipboard } from './utils'
import { ErrorLog, Analysis, LogType, SearchFilters } from './types'

function App() {
  // State
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze')
  const [logInput, setLogInput] = useState('')
  const [selectedType, setSelectedType] = useState<LogType | 'auto'>('auto')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [currentAnalysis, setCurrentAnalysis] = useState<Analysis | null>(null)
  const [savedLogs, setSavedLogs] = useState<ErrorLog[]>([])
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({})

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

    try {
      // 1. Detect log type
      const detection = detectLogType(logInput)
      const logType = selectedType === 'auto' ? detection.logType : selectedType

      console.log('🔍 Detected log type:', logType, 'with confidence:', detection.confidence + '%')

      // 2. Build AI prompt
      const prompt = buildPrompt(logType, logInput)

      // 3. Call AI API (using mock for now)
      console.log('🤖 Calling AI...')
      const aiResponse = await callAI({ prompt })

      // 4. Parse AI response
      const analysis = parseResponse(aiResponse.text)

      console.log('✅ Analysis complete:', analysis)

      // 5. Create error log object
      const errorLog: ErrorLog = {
        id: generateId(),
        timestamp: new Date(),
        logType: logType,
        rawLog: logInput,
        analysis: analysis,
        tags: [],
        isFavorite: false
      }

      // 6. Save to storage
      await saveLog(errorLog)
      console.log('💾 Log saved to storage!')

      // 7. Update UI
      setCurrentAnalysis(analysis)
      
      // 8. Reload log history
      await loadLogs()

      // Show success message
      alert('✅ Analysis complete and saved to history!')

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
    <div className="min-h-screen bg-cursor-bg text-cursor-text">
      {/* Header */}
      <header className="bg-cursor-panel border-b border-cursor-border px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-cursor-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">D</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">DevFix.AI</h1>
              <p className="text-xs text-cursor-text">Debug + DevOps Fixer</p>
            </div>
          </div>
          <div className="text-xs text-cursor-text">
            Built by DebugDivas 🚀
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <div className="bg-cursor-panel border-b border-cursor-border">
        <div className="flex px-6">
          <button
            onClick={() => setActiveTab('analyze')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'analyze'
                ? 'border-cursor-accent text-cursor-accent'
                : 'border-transparent text-cursor-text hover:text-white'
            }`}
          >
            🔍 Analyze Logs
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-cursor-accent text-cursor-accent'
                : 'border-transparent text-cursor-text hover:text-white'
            }`}
          >
            📚 Log History ({savedLogs.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'analyze' ? (
          <>
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

            {/* Analysis Result */}
            {currentAnalysis && !isAnalyzing && (
              <AnalysisResult
                analysis={currentAnalysis}
                onCopy={handleCopy}
              />
            )}
          </>
        ) : (
          /* Log History */
          <LogHistory
            logs={savedLogs}
            onSearch={handleSearch}
            onReload={handleReloadLogs}
            onDelete={handleDeleteLog}
          />
        )}
      </main>
    </div>
  )
}

export default App

