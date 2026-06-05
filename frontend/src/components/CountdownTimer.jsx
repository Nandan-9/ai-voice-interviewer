import { useEffect, useState } from 'react'

export default function CountdownTimer({ seconds, onExpire, label }) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    setRemaining(seconds)
  }, [seconds])

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.()
      return
    }
    const id = setInterval(() => setRemaining(r => r - 1), 1000)
    return () => clearInterval(id)
  }, [remaining, onExpire])

  const pct = (remaining / seconds) * 100
  const urgent = remaining <= 10

  return (
    <div style={{ textAlign: 'center', margin: '1rem 0' }}>
      <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '0.4rem' }}>{label}</div>
      <div
        style={{
          fontSize: '2.5rem',
          fontWeight: 700,
          color: urgent ? '#e53e3e' : '#2d3748',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {String(Math.floor(remaining / 60)).padStart(2, '0')}:
        {String(remaining % 60).padStart(2, '0')}
      </div>
      <div
        style={{
          height: 6,
          borderRadius: 3,
          background: '#e2e8f0',
          marginTop: '0.5rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: urgent ? '#e53e3e' : '#667eea',
            transition: 'width 1s linear',
          }}
        />
      </div>
    </div>
  )
}
