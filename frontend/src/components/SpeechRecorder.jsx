import { useEffect, useRef, useState } from 'react'

export default function SpeechRecorder({ active, onTranscript }) {
  const [liveText, setLiveText] = useState('')
  const recognitionRef = useRef(null)
  const finalRef = useRef('')

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return

    const rec = new SR()
    rec.continuous = true
    rec.interimResults = true
    rec.lang = 'en-US'

    rec.onresult = (e) => {
      let interim = ''
      let final = finalRef.current
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          final += e.results[i][0].transcript + ' '
        } else {
          interim += e.results[i][0].transcript
        }
      }
      finalRef.current = final
      setLiveText(final + interim)
    }

    rec.onend = () => {
      if (active) rec.start()
    }

    recognitionRef.current = rec
  }, [])

  useEffect(() => {
    const rec = recognitionRef.current
    if (!rec) return
    if (active) {
      finalRef.current = ''
      setLiveText('')
      try { rec.start() } catch {}
    } else {
      try { rec.stop() } catch {}
      onTranscript?.(finalRef.current.trim())
    }
  }, [active])

  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition)

  return (
    <div style={{ marginTop: '1rem' }}>
      {!supported && (
        <p style={{ color: '#e53e3e', fontSize: '0.9rem' }}>
          Speech recognition is not supported in this browser. Please use Chrome.
        </p>
      )}
      <textarea
        readOnly
        value={liveText}
        placeholder={active ? 'Listening… speak your answer' : 'Your response will appear here'}
        rows={5}
        style={{
          width: '100%',
          padding: '0.75rem',
          borderRadius: 8,
          border: active ? '2px solid #667eea' : '2px solid #e2e8f0',
          resize: 'none',
          fontSize: '1rem',
          background: active ? '#f0f4ff' : '#f7fafc',
          boxSizing: 'border-box',
        }}
      />
      {active && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.4rem' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e53e3e', display: 'inline-block', animation: 'pulse 1s infinite' }} />
          <span style={{ fontSize: '0.85rem', color: '#667eea' }}>Recording…</span>
        </div>
      )}
    </div>
  )
}
