import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startInterview } from '../lib/api'

const INSTRUCTIONS = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M23 7l-7-7H4a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7z" stroke="#2563eb" strokeWidth="1.8"/>
        <polyline points="17 2 17 8 23 8" stroke="#2563eb" strokeWidth="1.8"/>
        <circle cx="12" cy="14" r="2" stroke="#2563eb" strokeWidth="1.8"/>
        <path d="M12 10v2M12 16v2" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Camera',
    desc: 'Ensure your camera is ON and your face is clearly visible during the interview.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="11" rx="3" stroke="#2563eb" strokeWidth="1.8"/>
        <path d="M5 10a7 7 0 0 0 14 0" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="12" y1="17" x2="12" y2="21" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="8" y1="21" x2="16" y2="21" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Microphone',
    desc: 'Ensure your microphone is working properly and there is no background noise.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="14" rx="2" stroke="#2563eb" strokeWidth="1.8"/>
        <rect x="7" y="7" width="6" height="5" rx="1" stroke="#2563eb" strokeWidth="1.5"/>
        <line x1="16" y1="8" x2="19" y2="8" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="16" y1="11" x2="19" y2="11" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M8 18h8" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'Environment',
    desc: 'Choose a quiet place with good lighting and avoid distractions.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#2563eb" strokeWidth="1.8"/>
        <circle cx="12" cy="7" r="4" stroke="#2563eb" strokeWidth="1.8"/>
      </svg>
    ),
    title: 'Integrity',
    desc: 'This is a simulation. Do not use any external help or resources during the interview.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#2563eb" strokeWidth="1.8"/>
        <path d="M12 7v5l3 3" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    title: 'Duration',
    desc: 'The interview may take around 30–45 minutes. Make sure you have enough time.',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <line x1="18" y1="20" x2="18" y2="10" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="12" y1="20" x2="12" y2="4" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
        <line x1="6" y1="20" x2="6" y2="14" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
    title: 'AI Evaluation',
    desc: 'Your responses will be evaluated by AI and you will get detailed feedback at the end.',
  },
]

export default function InstructionsPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleStart = async () => {
    const selection = JSON.parse(sessionStorage.getItem('interview_selection') || '{}')
    if (!selection.company || !selection.role) {
      navigate('/setup')
      return
    }
    setError(null)
    setLoading(true)
    try {
      const data = await startInterview({ company: selection.company, role: selection.role })
      sessionStorage.setItem('interview', JSON.stringify({
        company: selection.company,
        role: selection.role,
        interview_id: data.interview_id,
        questions: data.questions,
      }))
      navigate('/interview')
    } catch (err) {
      setError(err?.error || 'Failed to start interview. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={s.page}>
      <div style={s.card}>

        {/* Top icon */}
        <div style={s.topIcon}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="#2563eb" strokeWidth="1.8"/>
            <polyline points="14 2 14 8 20 8" stroke="#2563eb" strokeWidth="1.8"/>
            <line x1="9" y1="13" x2="15" y2="13" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="9" y1="17" x2="13" y2="17" stroke="#2563eb" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </div>

        <h1 style={s.title}>Interview Instructions</h1>
        <p style={s.subtitle}>Please read the instructions carefully before starting your mock interview.</p>

        {/* Instruction rows */}
        <div style={s.list}>
          {INSTRUCTIONS.map((item) => (
            <div key={item.title} style={s.row}>
              <div style={s.rowIcon}>{item.icon}</div>
              <div>
                <div style={s.rowTitle}>{item.title}</div>
                <div style={s.rowDesc}>{item.desc}</div>
              </div>
            </div>
          ))}

          {/* Important row — highlighted */}
          <div style={s.importantRow}>
            <div style={s.importantIcon}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2563eb" strokeWidth="1.8"/>
              </svg>
            </div>
            <div>
              <div style={s.importantTitle}>Important</div>
              <div style={s.rowDesc}>Your interview will be recorded and the AI will provide personalized feedback to help you improve.</div>
            </div>
          </div>
        </div>

        {error && <div style={s.errorBox}>{error}</div>}

        {/* CTA */}
        <button
          style={{ ...s.btn, opacity: loading ? 0.8 : 1 }}
          onClick={handleStart}
          disabled={loading}
        >
          {!loading && (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21"/>
            </svg>
          )}
          {loading ? 'Starting…' : 'Start Interview'}
        </button>

        <p style={s.note}>By clicking Start Interview, you agree to the instructions above.</p>
      </div>
    </div>
  )
}

const s = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(160deg, #eef2ff 0%, #f0f7ff 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '32px 16px',
    fontFamily: "system-ui, 'Segoe UI', sans-serif",
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    padding: '40px 36px 32px',
    width: '100%',
    maxWidth: 580,
    boxShadow: '0 4px 32px rgba(37,99,235,0.08)',
  },

  topIcon: {
    width: 64, height: 64, borderRadius: '50%',
    background: '#eff6ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  title: { margin: '0 0 8px', fontSize: 28, fontWeight: 800, color: '#0f172a', textAlign: 'center' },
  subtitle: { margin: '0 0 28px', fontSize: 14, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 },

  list: { display: 'flex', flexDirection: 'column', gap: 0 },

  row: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '14px 0',
    borderBottom: '1px solid #f1f5f9',
  },
  rowIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: '#eff6ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  rowTitle: { fontSize: 15, fontWeight: 700, color: '#0f172a', marginBottom: 2 },
  rowDesc: { fontSize: 13, color: '#64748b', lineHeight: 1.5 },

  importantRow: {
    display: 'flex', alignItems: 'flex-start', gap: 14,
    padding: '14px',
    background: '#eff6ff',
    borderRadius: 12,
    marginTop: 8,
  },
  importantIcon: {
    width: 40, height: 40, borderRadius: 10,
    background: '#dbeafe',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  importantTitle: { fontSize: 15, fontWeight: 700, color: '#2563eb', marginBottom: 2 },

  errorBox: {
    background: '#fef2f2', border: '1px solid #fecaca',
    borderRadius: 8, padding: '10px 14px',
    color: '#dc2626', fontSize: 13, marginBottom: 12, marginTop: 16,
  },

  btn: {
    width: '100%', padding: '15px',
    background: '#2563eb', color: '#fff',
    border: 'none', borderRadius: 12,
    fontSize: 16, fontWeight: 700,
    cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    marginTop: 24,
  },
  note: { margin: '10px 0 0', textAlign: 'center', fontSize: 12, color: '#94a3b8' },
}
