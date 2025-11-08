import React, { useState } from 'react'

// DO NOT use window.location.origin.
// Vite proxy handles /api routes.
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
    if (!validUrl(url))
      return setError('Please enter a valid Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Alan_Turing)')

    setLoading(true)
    try {
      // ✅ Correct API call using Vite proxy
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

  // Shorten long answers
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

      {/* Error Section */}
      {error && (
        <div className="alert alert-error">
          <span className="alert-message">{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          
          {/* Header */}
          <div className="quiz-header">
            <h2 className="quiz-title">{result.title}</h2>
            <p className="quiz-summary">{result.summary}</p>

            {result.related_topics && result.related_topics.length > 0 && (
              <div style={{ marginTop: '1.5rem' }}>
                <h3 className="related-title">Related Topics</h3>
                <div className="related-topics">
                  {result.related_topics.slice(0, 6).map((t, i) => (
                    <div key={i} className="topic-tag">{t}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mode Switch */}
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
            {result.quiz &&
              result.quiz.map((q, idx) => (
                <div key={idx} className="question-card">

                  <div className="question-header">
                    <span className="question-number">{idx + 1}</span>
                    <span className="question-text">{q.question}</span>
                  </div>

                  {/* Difficulty */}
                  {q.difficulty && (
                    <div>
                      <span className={`difficulty-badge difficulty-${q.difficulty}`}>
                        {q.difficulty}
                      </span>
                    </div>
                  )}

                  {/* Options */}
                  <div className="options-container">
                    {q.options &&
                      q.options.map((o, i) => {
                        let optionClass = `option-label ${takeMode && answers[idx] === o ? 'selected' : ''}`;
                        
                        if (takeMode && score) {
                          if (o === q.answer) optionClass += ' option-correct'
                          else if (answers[idx] === o) optionClass += ' option-wrong'
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
                            <span className="option-text">{truncateOption(o)}</span>
                          </label>
                        )
                      })}
                  </div>

                  {/* View Mode */}
                  {!takeMode && (
                    <div className="answer-box">
                      <div className="answer-label">Correct Answer:</div>
                      <div className="answer-text">{q.answer}</div>
                    </div>
                  )}

                  {/* Explanation */}
                  {!takeMode && q.explanation && (
                    <div className="explanation-box">
                      <div className="explanation-label">Explanation:</div>
                      <div className="explanation-text">{q.explanation}</div>
                    </div>
                  )}

                </div>
              ))}
          </div>

          {/* Submit Answers */}
          {takeMode && (
            <div className="submit-container">
              <button type="button" onClick={submitQuiz} className="btn btn-primary">
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
