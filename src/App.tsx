import { useState, useEffect } from 'react'
import './App.css'
import { LogInputPanel, AnalysisResult, LogHistory, LoadingSpinner } from './components'
import { detectLogType } from './core'
import { buildPrompt, parseResponse, SAMPLE_LOGS } from './prompts'
import { saveLog, getAllLogs, searchLogs, deleteLog, initializeStorage } from './storage'
import { callAI, generateId, copyToClipboard } from './utils'
import { findSimilarLogs, categorizeError } from './utils/logMatcher'
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

            {/* Similar Past Logs */}
            {similarLogs.length > 0 && !isAnalyzing && (
              <div className="bg-cursor-panel border border-yellow-600 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                  {showAmharic ? '✨ ተመሳሳይ ያለፉ ስህተቶች ተገኝተዋል!' : `✨ Found ${similarLogs.length} Similar Past Error${similarLogs.length > 1 ? 's' : ''}!`}
                </h3>
                <p className="text-sm text-cursor-text mb-4">
                  {showAmharic 
                    ? 'ከዚህ በፊት ተመሳሳይ ስህተቶች አጋጥመውዎታል። የሰራውን እንመልከት:' 
                    : "You've encountered similar errors before. Here's what worked:"}
                </p>
                <div className="space-y-3">
                  {similarLogs.map((log) => {
                    const isExpanded = expandedSimilarLog === log.id
                    return (
                      <div key={log.id} className="bg-cursor-bg border border-cursor-border rounded p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs px-2 py-1 bg-cursor-accent rounded text-white">
                              {log.logType}
                            </span>
                            {log.tags.map((tag, idx) => (
                              <span key={idx} className="text-xs px-2 py-1 bg-blue-600 rounded text-white">
                                📂 {tag}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs text-cursor-text">
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => setExpandedSimilarLog(isExpanded ? null : log.id)}
                              className="text-xs text-cursor-accent hover:text-blue-400"
                            >
                              {isExpanded ? '▼ Hide' : '▶ Show Details'}
                            </button>
                          </div>
                        </div>
                        <p className="text-sm text-white mb-2">
                          {log.analysis?.rootCause || 'No analysis available'}
                        </p>
                        {!isExpanded ? (
                          <p className="text-xs text-cursor-text font-mono line-clamp-2">
                            {log.rawLog}
                          </p>
                        ) : (
                          <div className="mt-4 space-y-3 border-t border-cursor-border pt-3">
                            <div>
                              <p className="text-xs text-cursor-text font-semibold mb-1">
                                {showAmharic ? 'ዋና ምክንያት:' : 'Root Cause:'}
                              </p>
                              <p className="text-sm text-white">{log.analysis?.rootCause}</p>
                            </div>
                            <div>
                              <p className="text-xs text-cursor-text font-semibold mb-1">
                                {showAmharic ? 'ማብራሪያ:' : 'Explanation:'}
                              </p>
                              <p className="text-sm text-cursor-text">{log.analysis?.explanation}</p>
                            </div>
                            {log.analysis?.fixCode && (
                              <div>
                                <p className="text-xs text-cursor-text font-semibold mb-1">
                                  {showAmharic ? 'የመፍትሄ ኮድ:' : 'Fix Code:'}
                                </p>
                                <pre className="bg-cursor-bg border border-cursor-border rounded p-3 text-xs overflow-x-auto">
                                  <code>{log.analysis.fixCode}</code>
                                </pre>
                              </div>
                            )}
                            <div>
                              <p className="text-xs text-cursor-text font-semibold mb-1">
                                {showAmharic ? 'የስህተቱ ቅጂ:' : 'Original Error:'}
                              </p>
                              <pre className="bg-cursor-bg border border-cursor-border rounded p-3 text-xs overflow-x-auto">
                                <code>{log.rawLog}</code>
                              </pre>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Translation Toggle & Category */}
            {(errorCategory || currentAnalysis) && !isAnalyzing && (
              <div className="bg-cursor-panel border border-cursor-border rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {errorCategory && (
                      <>
                        <span className="text-sm text-cursor-text">
                          {showAmharic ? 'ምድብ:' : 'Category:'}
                        </span>
                        <span className="text-sm px-3 py-1 bg-blue-600 rounded text-white font-medium">
                          📂 {errorCategory}
                        </span>
                      </>
                    )}
                  </div>
                  
                  {/* Translation Toggle Button */}
                  <button
                    onClick={() => setShowAmharic(!showAmharic)}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium transition-colors"
                  >
                    <span>{showAmharic ? '🇺🇸 English' : '🇪🇹 አማርኛ'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* Analysis Result */}
            {currentAnalysis && !isAnalyzing && (
              <AnalysisResult
                analysis={currentAnalysis}
                onCopy={handleCopy}
                showAmharic={showAmharic}
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

