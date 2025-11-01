import { useState } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState<'analyze' | 'history'>('analyze')

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
            📚 Log History
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {activeTab === 'analyze' ? (
          <div className="space-y-6">
            <div className="bg-cursor-panel border border-cursor-border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4 text-white">
                Paste Your Error Logs
              </h2>
              <p className="text-sm text-cursor-text mb-4">
                Paste stack traces, CI/CD logs, Docker errors, or deployment failures below.
                DevFix.AI will analyze and suggest fixes.
              </p>
              
              {/* This will be replaced by LogInputPanel component */}
              <div className="space-y-4">
                <textarea
                  className="w-full h-64 bg-cursor-bg border border-cursor-border rounded p-4 text-cursor-text font-mono text-sm focus:outline-none focus:ring-2 focus:ring-cursor-accent"
                  placeholder="Paste your error logs here..."
                />
                <div className="flex items-center justify-between">
                  <select className="bg-cursor-bg border border-cursor-border rounded px-4 py-2 text-sm text-cursor-text">
                    <option>Auto-detect log type</option>
                    <option>Node.js</option>
                    <option>Python</option>
                    <option>Docker</option>
                    <option>GitHub Actions</option>
                    <option>Vercel</option>
                    <option>Nginx</option>
                  </select>
                  <button className="bg-cursor-accent hover:bg-blue-600 text-white px-6 py-2 rounded font-medium transition-colors">
                    Analyze Log 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* Results will be shown here */}
            <div className="bg-cursor-panel border border-cursor-border rounded-lg p-6">
              <p className="text-cursor-text text-center py-8">
                Analysis results will appear here...
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-cursor-panel border border-cursor-border rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4 text-white">
              Saved Error Logs
            </h2>
            <p className="text-cursor-text text-center py-8">
              Your saved logs will appear here...
            </p>
          </div>
        )}
      </main>
    </div>
  )
}

export default App

