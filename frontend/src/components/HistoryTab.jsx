import React, { useEffect, useState } from 'react'

export default function HistoryTab() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => { fetchList() }, [])

  async function fetchList() {
    setLoading(true)
    try {
      const res = await fetch('/api/history')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setItems(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function showDetails(id) {
    try {
      const res = await fetch(`/api/quiz/${id}`)
      const data = await res.json()
      setSelected(data)
    } catch (e) { console.error(e) }
  }

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <span>Loading quiz history...</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && items.length === 0 && (
        <div style={{ background: '#dbeafe', border: '1px solid #93c5fd', borderRadius: '0.75rem', padding: '3rem 2rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>No quizzes generated yet</p>
          <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>Go to the Generate Quiz tab to create your first quiz</p>
        </div>
      )}

      {/* History Table */}
      {!loading && items.length > 0 && (
        <div className="history-container">
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Created</th>
                <th>Source</th>
                <th style={{ textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((it, idx) => (
                <tr key={it.id}>
                  <td>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', background: '#dbeafe', color: '#1e40af', borderRadius: '50%', fontWeight: '700', fontSize: '0.875rem' }}>
                      {it.id}
                    </span>
                  </td>
                  <td style={{ fontWeight: '500' }}>{it.title}</td>
                  <td style={{ fontSize: '0.95rem' }}>
                    {new Date(it.date_generated).toLocaleDateString()} <br />
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af' }}>{new Date(it.date_generated).toLocaleTimeString()}</span>
                  </td>
                  <td style={{ fontSize: '0.95rem', wordBreak: 'break-all' }}>
                    <a href={it.url} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none' }}>
                      {it.url.replace('https://en.wikipedia.org/wiki/', '')}
                    </a>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => showDetails(it.id)}
                      className="btn btn-primary btn-small"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Details Modal */}
      {selected && (
        <div className="modal-overlay">
          <div className="modal">
            {/* Modal Header */}
            <div className="modal-header">
              <h2 className="modal-title">{selected.title}</h2>
              <button
                onClick={() => setSelected(null)}
                className="modal-close"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="modal-section">
                <div className="modal-section-label">URL</div>
                <a
                  href={selected.url}
                  target="_blank"
                  rel="noreferrer"
                  className="modal-section-content"
                  style={{ color: '#3b82f6', textDecoration: 'none' }}
                >
                  {selected.url}
                </a>
              </div>

              {selected.summary && (
                <div className="modal-section">
                  <div className="modal-section-label">Summary</div>
                  <div className="modal-section-content">{selected.summary}</div>
                </div>
              )}

              {selected.full_quiz_data && (
                <div className="modal-section">
                  <div className="modal-section-label">Quiz Data</div>
                  <pre className="modal-code">
                    {typeof selected.full_quiz_data === 'string'
                      ? JSON.stringify(JSON.parse(selected.full_quiz_data), null, 2)
                      : JSON.stringify(selected.full_quiz_data, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                onClick={() => setSelected(null)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

