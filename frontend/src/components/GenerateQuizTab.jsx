import React, {useState} from 'react'

export default function GenerateQuizTab(){
  const [url, setUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [takeMode, setTakeMode] = useState(false)
  const [answers, setAnswers] = useState({})
  const [score, setScore] = useState(null)

  function validUrl(u){
    try{ const p = new URL(u); return p.hostname.includes('wikipedia.org') }
    catch{ return false }
  }

  async function onSubmit(e){
    e.preventDefault()
    setError(null)
    setResult(null)
    setScore(null)
    if(!url) return setError('Please enter a Wikipedia URL')
    if(!validUrl(url)) return setError('Please enter a valid Wikipedia URL (e.g., https://en.wikipedia.org/wiki/Alan_Turing)')
    setLoading(true)
    try{
      const res = await fetch('/api/generate_quiz/', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({url})
      })
      if(!res.ok){
        const txt = await res.text()
        throw new Error(txt || 'Server error')
      }
      const data = await res.json()
      setResult(data)
      setTakeMode(false)
      setAnswers({})
      setScore(null)
    }catch(err){
      setError(err.message)
    }finally{setLoading(false)}
  }

  function selectAnswer(qidx, val){
    setAnswers(prev=>({ ...prev, [qidx]: val }))
  }

  function submitQuiz(){
    if(!result || !result.quiz) return
    let correct=0
    result.quiz.forEach((q, i)=>{
      if(answers[i] && answers[i] === q.answer) correct++
    })
    setScore(`${correct} / ${result.quiz.length}`)
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="mb-4">
        <div className="flex gap-2">
          <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="https://en.wikipedia.org/wiki/Alan_Turing" className="flex-1 p-2 border rounded" />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{loading? 'Generating...' : 'Generate'}</button>
        </div>
      </form>

      {error && <div className="text-red-600 mb-3">{error}</div>}

      {result && (
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{result.title}</h2>
              <p className="text-sm text-gray-700">{result.summary}</p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500">Related topics</div>
              <div className="mt-1">
                {(result.related_topics || []).slice(0,6).map((t,i)=>(<span key={i} className="inline-block bg-gray-100 px-2 py-1 text-xs mr-1 rounded">{t}</span>))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={()=>{ setTakeMode(false); setScore(null); setAnswers({}) }} className={`px-3 py-1 rounded ${!takeMode? 'bg-blue-600 text-white':'border'}`}>View</button>
            <button type="button" onClick={()=>{ setTakeMode(true); setScore(null); setAnswers({}) }} className={`px-3 py-1 rounded ${takeMode? 'bg-blue-600 text-white':'border'}`}>Take Quiz</button>
          </div>

          <div>
            {result.quiz && result.quiz.map((q, idx)=> (
              <div key={idx} className="p-4 border rounded mb-3 bg-white">
                <div className="font-medium">{idx+1}. {q.question}</div>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {q.options && q.options.map((o,i)=>(
                    <label key={i} className={`p-2 border rounded cursor-pointer ${takeMode ? (answers[idx]===o? 'bg-blue-50 border-blue-300':'') : ''}`}>
                      {takeMode ? (
                        <input type="radio" name={`q-${idx}`} className="mr-2" checked={answers[idx]===o} onChange={()=>selectAnswer(idx,o)} />
                      ) : null}
                      {o}
                    </label>
                  ))}
                </div>

                {!takeMode && (
                  <div className="mt-2 text-sm text-green-700">Answer: {q.answer}</div>
                )}

                {q.explanation && <div className="text-xs text-gray-600 mt-1">{q.explanation}</div>}
              </div>
            ))}
          </div>

          {takeMode && (
            <div className="flex items-center gap-2">
              <button type="button" onClick={submitQuiz} className="px-4 py-2 bg-green-600 text-white rounded">Submit Answers</button>
              {score && <div className="text-sm font-medium">Score: {score}</div>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
                        setScore(null)
