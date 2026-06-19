import { useEffect, useRef, useState } from 'react'

export default function AudioRecorder({ active, onAudioReady }) {
  const [elapsed, setElapsed] = useState(0)
  const [error, setError] = useState(null)
  const mediaRecorderRef = useRef(null)
  const chunksRef = useRef([])
  const timerRef = useRef(null)

  useEffect(() => {
    if (active) {
      startRecording()
    } else {
      stopRecording()
    }
    return () => clearInterval(timerRef.current)
  }, [active])

  const startRecording = async () => {
    setElapsed(0)
    setError(null)
    chunksRef.current = []

    let stream
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      setError('Microphone access denied. Please allow microphone and try again.')
      return
    }

    const mr = new MediaRecorder(stream)
    mediaRecorderRef.current = mr

    mr.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data)
    }

    mr.onstop = () => {
      stream.getTracks().forEach(t => t.stop())
      const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
      onAudioReady?.(blob)
    }

    mr.start()
    timerRef.current = setInterval(() => setElapsed(s => s + 1), 1000)
  }

  const stopRecording = () => {
    clearInterval(timerRef.current)
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
  }

  const fmt = s =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  return (
    <div style={{
      marginTop: '1rem',
      padding: '1.5rem',
      borderRadius: 10,
      border: `2px solid ${active ? '#fc8181' : '#e2e8f0'}`,
      background: active ? '#fff5f5' : '#f7fafc',
      textAlign: 'center',
    }}>
      {error && (
        <p style={{ margin: 0, color: '#c53030', fontSize: '0.9rem' }}>{error}</p>
      )}

      {!error && active && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' }}>
            <span style={{
              width: 12, height: 12, borderRadius: '50%',
              background: '#e53e3e', display: 'inline-block',
              animation: 'pulse 1s infinite',
            }} />
            <span style={{ fontWeight: 700, color: '#c53030', fontSize: '1.1rem' }}>
              Recording — {fmt(elapsed)}
            </span>
          </div>
          <p style={{ margin: '0.5rem 0 0', color: '#718096', fontSize: '0.9rem' }}>
            Speak your answer clearly. Click "Done" when finished.
          </p>
        </>
      )}

      {!error && !active && (
        <p style={{ margin: 0, color: '#a0aec0', fontSize: '0.95rem' }}>
          Ready to record your answer
        </p>
      )}
    </div>
  )
}
