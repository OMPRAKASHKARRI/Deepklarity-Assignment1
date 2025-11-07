import React, { useState } from 'react'

export default function GenerateQuizTabNew() {
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [takeMode, setTakeMode] = useState(false)
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)

  function validUrl(u) {
    try {
      const p = new URL(u)
      return p.hostname.includes('wikipedia.org')
    } catch {
      return false
    }
  }

  async function onSubmit(e) {
    e.preventDefault()
    setError(null)
    setResult(null)
    setScore(null)
    if (!url) return setError('Please enter a Wikipedia URL')
    if (!validUrl(url)) return setError('Please enter a valid Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Alan_Turing)')
    setLoading(true)
    try {
      const res = await fetch('/api/generate_quiz/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      })
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(txt || 'Server error')
      }
      const data = await res.json()
      setResult(data)
      setTakeMode(false)
      setAnswers({})
      setScore(null)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  function selectAnswer(qidx, val) {
    setAnswers(prev => ({ ...prev, [qidx]: val }))
  }

  function submitQuiz() {
    if (!result || !result.quiz) return
    let correct = 0
    result.quiz.forEach((q, i) => {
      if (answers[i] && answers[i] === q.answer) correct++
    })
    setScore(`${correct} / ${result.quiz.length}`)
  }

  // Function to truncate text to 4-5 words with ellipsis
  function truncateOption(text, wordLimit = 5) {
    const words = text.trim().split(/\s+/)
    if (words.length > wordLimit) {
      return words.slice(0, wordLimit).join(' ') + '...'
    }
    return text
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Input Section */}
      <form onSubmit={onSubmit} className="form-container">
        <div className="form-group">
          <label>Enter Wikipedia URL</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://en.wikipedia.org/wiki/Alan_Turing"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary">
              {loading ? 'Generating...' : 'Generate'}
            </button>
          </div>
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-message">{error}</span>
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {/* Header */}
          <div className="quiz-header">
            <h2 className="quiz-title">{result.title}</h2>
            <p className="quiz-summary">{result.summary}</p>

            {/* Related Topics */}
            {result.related_topics && result.related_topics.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#1f2937' }}>
                  Related Topics
                </h3>
                <div className="related-topics">
                  {result.related_topics.slice(0, 6).map((t, i) => (
                    <div key={i} className="topic-tag">{t}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mode Toggle */}
          <div className="mode-toggle">
            <button
              type="button"
              onClick={() => {
                setTakeMode(false)
                setScore(null)
                setAnswers({})
              }}
              className={`mode-btn ${!takeMode ? 'active' : ''}`}
            >
              View Answers
            </button>
            <button
              type="button"
              onClick={() => {
                setTakeMode(true)
                setScore(null)
                setAnswers({})
              }}
              className={`mode-btn ${takeMode ? 'active' : ''}`}
            >
              Take Quiz
            </button>
          </div>

          {/* Questions */}
          <div className="questions-container">
            {result.quiz && result.quiz.map((q, idx) => (
              <div key={idx} className="question-card">
                {/* Question Number and Text */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="question-number">{idx + 1}</span>
                  <span className="question-text" style={{ display: 'block' }}>{q.question}</span>
                </div>

                {/* Difficulty Badge */}
                {q.difficulty && (
                  <div style={{ marginBottom: '1rem' }}>
                    <span className={`difficulty-badge difficulty-${q.difficulty}`}>
                      {q.difficulty}
                    </span>
                  </div>
                )}

                {/* Options */}
                <div className="options-container">
                  {q.options && q.options.map((o, i) => {
                    // Determine if option should be highlighted after submission
                    let optionClass = `option-label ${takeMode && answers[idx] === o ? 'selected' : ''}`;
                    
                    if (takeMode && score) {
                      // After submission, highlight correct/wrong answers
                      if (o === q.answer) {
                        optionClass += ' option-correct'; // Green for correct answer
                      } else if (answers[idx] === o && answers[idx] !== q.answer) {
                        optionClass += ' option-wrong'; // Red for selected wrong answer
                      }
                    }
                    
                    return (
                      <label key={i} className={optionClass}>
                        {takeMode && (
                          <input
                            type="radio"
                            name={`q-${idx}`}
                            checked={answers[idx] === o}
                            onChange={() => selectAnswer(idx, o)}
                          />
                        )}
                        <span className="option-text">{o}</span>
                      </label>
                    );
                  })}
                </div>

                {/* Answer Display (View Mode Only) */}
                {!takeMode && (
                  <div className="answer-box">
                    <div className="answer-label">Correct Answer:</div>
                    <div className="answer-text">{q.answer}</div>
                  </div>
                )}

                {/* Explanation (View Mode Or After Quiz Submitted) */}
                {q.explanation && !takeMode && (
                  <div className="explanation-box">
                    <div className="explanation-label">Explanation:</div>
                    <div className="explanation-text">{q.explanation}</div>
                  </div>
                )}

                {/* Show Answers and Explanation After Submission */}
                {takeMode && score && (
                  <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
                    <div className="answer-box">
                      <div className="answer-label">Correct Answer:</div>
                      <div className="answer-text">{q.answer}</div>
                    </div>
                    {q.explanation && (
                      <div className="explanation-box">
                        <div className="explanation-label">Explanation:</div>
                        <div className="explanation-text">{q.explanation}</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Submit Button (Take Quiz Mode) */}
          {takeMode && (
            <div className="submit-container" style={{ marginTop: 'auto' }}>
              <button
                type="button"
                onClick={submitQuiz}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Submit Answers
              </button>
              {score && (
                <div className="score-display">
                  Score: {score}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

