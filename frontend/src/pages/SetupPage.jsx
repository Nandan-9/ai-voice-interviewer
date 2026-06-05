import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { startInterview } from '../lib/api'

const COMPANY_ROLES = {
  TCS: ['Data Analyst', 'Software Developer', 'System Engineer'],
  Flipkart: ['Backend Developer', 'Data Analyst', 'Frontend Developer'],
  Cred: ['Backend Developer', 'Data Engineer', 'Frontend Developer'],
  PhonePe: ['Android Developer', 'Backend Developer', 'Data Analyst'],
}

export default function SetupPage() {
  const navigate = useNavigate()
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCompany = (e) => {
    setCompany(e.target.value)
    setRole('')
  }

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await startInterview({ company, role })
      sessionStorage.setItem('interview', JSON.stringify({ company, role, questions: data.questions }))
      navigate('/interview')
    } catch (err) {
      setError(err?.error || 'Failed to load questions. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.badge}>Step 2 of 3</div>
        <h1 style={styles.title}>Select Interview</h1>
        <p style={styles.sub}>Choose a company and role to begin your practice session</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Company</label>
          <select style={styles.select} required value={company} onChange={handleCompany}>
            <option value="">— Select company —</option>
            {Object.keys(COMPANY_ROLES).map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <label style={styles.label}>Role</label>
          <select style={styles.select} required value={role} onChange={e => setRole(e.target.value)} disabled={!company}>
            <option value="">— Select role —</option>
            {(COMPANY_ROLES[company] || []).map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>

          {company && role && (
            <div style={styles.preview}>
              <b>{role}</b> at <b>{company}</b>
              <div style={{ fontSize: '0.85rem', color: '#718096', marginTop: '0.25rem' }}>3 questions · AI-powered feedback</div>
            </div>
          )}

          <button style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }} disabled={loading}>
            {loading ? 'Loading questions…' : 'Start Interview →'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '2rem' },
  card: { background: '#fff', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  badge: { display: 'inline-block', background: '#ebf4ff', color: '#4299e1', borderRadius: 20, padding: '0.2rem 0.8rem', fontSize: '0.8rem', fontWeight: 600, marginBottom: '1rem' },
  title: { margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#2d3748' },
  sub: { margin: '0.4rem 0 1.5rem', color: '#718096' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginTop: '0.6rem' },
  select: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '1rem', background: '#fff', width: '100%', boxSizing: 'border-box' },
  btn: { marginTop: '1.4rem', padding: '0.75rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  preview: { marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 8, background: '#f0fff4', border: '1px solid #c6f6d5', color: '#276749' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: '#c53030', fontSize: '0.9rem' },
}
