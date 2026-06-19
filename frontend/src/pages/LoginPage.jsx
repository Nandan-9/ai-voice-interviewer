import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginUser } from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await loginUser(form)
      sessionStorage.setItem('user', JSON.stringify({ username: data.username, email: data.email }))
      navigate('/setup')
    } catch (err) {
      setError(err.error || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Welcome Back</h1>
        <p style={styles.sub}>Sign in to continue your interview prep</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={submit} style={styles.form}>
          <label style={styles.label}>Email</label>
          <input style={styles.input} type="email" required value={form.email} onChange={set('email')} />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" required value={form.password} onChange={set('password')} />

          <button style={styles.btn} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p style={styles.switchText}>
          Don't have an account?{' '}
          <span style={styles.link} onClick={() => navigate('/')}>Create one</span>
        </p>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '2rem' },
  card: { background: '#fff', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.15)' },
  title: { margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#2d3748' },
  sub: { margin: '0.4rem 0 1.5rem', color: '#718096' },
  form: { display: 'flex', flexDirection: 'column', gap: '0.3rem' },
  label: { fontSize: '0.85rem', fontWeight: 600, color: '#4a5568', marginTop: '0.6rem' },
  input: { padding: '0.6rem 0.8rem', borderRadius: 8, border: '1.5px solid #e2e8f0', fontSize: '1rem', outline: 'none', width: '100%', boxSizing: 'border-box' },
  btn: { marginTop: '1.2rem', padding: '0.75rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  errorBox: { background: '#fff5f5', border: '1px solid #fed7d7', borderRadius: 8, padding: '0.75rem', marginBottom: '1rem', color: '#c53030', fontSize: '0.9rem' },
  switchText: { textAlign: 'center', marginTop: '1.2rem', color: '#718096', fontSize: '0.9rem' },
  link: { color: '#667eea', fontWeight: 600, cursor: 'pointer' },
}
