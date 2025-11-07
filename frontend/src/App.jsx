import React, { useState } from 'react'
import GenerateQuizTab from './components/GenerateQuizTabNew'
import HistoryTab from './components/HistoryTab'
import './styles.css'

export default function App() {
  const [tab, setTab] = useState('generate')

  return (
    <div>
      {/* Header */}
      <div className="app-header">
        <div className="header-content">
          <h1>DeepKlarity AI Wiki Quiz</h1>
          <p>Generate intelligent quizzes from Wikipedia articles</p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="nav-container">
        <div className="nav-tabs">
          <button
            onClick={() => setTab('generate')}
            className={`nav-tab ${tab === 'generate' ? 'active' : ''}`}
          >
            Generate Quiz
          </button>
          <button
            onClick={() => setTab('history')}
            className={`nav-tab ${tab === 'history' ? 'active' : ''}`}
          >
            History
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="main-content">
        {tab === 'generate' ? <GenerateQuizTab /> : <HistoryTab />}
      </div>

      {/* Footer */}
      <div className="app-footer">
        <p>© 2025 DeepKlarity AI - Advanced Quiz Generation from Wikipedia</p>
      </div>
    </div>
  )
}

