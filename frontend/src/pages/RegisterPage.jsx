import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerUser } from '../lib/api'

const switchText = { textAlign: 'center', marginTop: '1.2rem', color: '#718096', fontSize: '0.9rem' }
const link = { color: '#667eea', fontWeight: 600, cursor: 'pointer' }

export default function RegisterPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '', username: '', course: '', passing_out: '', bio: '', password: '',
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await registerUser({ ...form, passing_out: Number(form.passing_out) })
      navigate('/setup')
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.sub}>Set up your profile to begin the interview</p>

        {error && (
          <div style={styles.errorBox}>
            {Object.entries(error).map(([k, v]) => (
              <div key={k}><b>{k}:</b> {Array.isArray(v) ? v.join(', ') : v}</div>
            ))}
          </div>
        )}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" required value={form.email} onChange={set('email')} />

          <label style={styles.label}>Username</label>
          <input style={styles.input} required value={form.username} onChange={set('username')} />

          <label style={styles.label}>Course</label>
          <input style={styles.input} required value={form.course} onChange={set('course')} placeholder="e.g. B.Tech CSE" />

          <label style={styles.label}>Passing Out Year</label>
          <input style={styles.input} type="number" required value={form.passing_out} onChange={set('passing_out')} placeholder="e.g. 2025" />

          <label style={styles.label}>Bio</label>
          <textarea style={{ ...styles.input, resize: 'vertical' }} rows={3} value={form.bio} onChange={set('bio')} placeholder="Brief introduction…" />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" required minLength={8} value={form.password} onChange={set('password')} />

          <button style={styles.btn} disabled={loading}>
            {loading ? 'Creating account…' : 'Create Account & Continue →'}
          </button>
        </form>

        <p style={switchText}>
          Already have an account?{' '}
          <span style={link} onClick={() => navigate('/login')}>Sign in</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '2rem' },
  card: { background: '#fff', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 460, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  title: { margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#2d3748' },
  sub: { margin: '0.4rem 0 1.5rem', color: '#718096' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginTop: '0.6rem' },
  input: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { marginTop: '1.2rem', padding: '0.75rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: '#c53030', fontSize: '0.9rem' },
}
