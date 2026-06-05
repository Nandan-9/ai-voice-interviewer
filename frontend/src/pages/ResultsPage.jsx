import { useNavigate } from 'react-router-dom'

function ScoreBadge({ score }) {
  const color = score >= 75 ? '#276749' : score >= 50 ? '#744210' : '#c53030'
  const bg = score >= 75 ? '#f0fff4' : score >= 50 ? '#fffff0' : '#fff5f5'
  return (
    <span style={{ background: bg, color, padding: '0.2rem 0.7rem', borderRadius: 20, fontWeight: 700, fontSize: '1rem' }}>
      {score}/100
    </span>
  )
}

export default function ResultsPage() {
  const navigate = useNavigate()
  const results = JSON.parse(sessionStorage.getItem('results') || 'null')

  if (!results) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <p>No results found.</p>
          <button style={styles.btn} onClick={() => navigate('/')}>Start over</button>
        </div>
      </div>
    )
  }

  const { overall_score, summary, questions } = results

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Overall */}
        <div style={styles.overallBox}>
          <div style={styles.scoreCircle}>
            <span style={styles.scoreNum}>{overall_score}</span>
            <span style={styles.scoreMax}>/100</span>
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={styles.title}>Interview Complete</h1>
            <p style={styles.summary}>{summary}</p>
          </div>
        </div>

        {/* Per-question cards */}
        <h2 style={styles.sectionTitle}>Question-by-Question Breakdown</h2>
        {questions?.map((q, i) => (
          <div key={i} style={styles.qCard}>
            <div style={styles.qHeader}>
              <span style={{ fontWeight: 600, color: '#4a5568' }}>Q{i + 1}.</span>
              <span style={{ flex: 1, marginLeft: '0.5rem', color: '#2d3748' }}>{q.question}</span>
              <ScoreBadge score={q.score} />
            </div>

            <div style={styles.responseBox}>
              <b style={{ fontSize: '0.8rem', color: '#a0aec0' }}>YOUR RESPONSE</b>
              <p style={{ margin: '0.3rem 0 0', color: '#4a5568', fontSize: '0.95rem' }}>
                {q.response || <i style={{ color: '#a0aec0' }}>No response recorded</i>}
              </p>
            </div>

            <div style={styles.feedbackRow}>
              <div style={styles.feedbackCol}>
                <div style={styles.feedLabel}>Strengths</div>
                {q.strengths?.map((s, j) => (
                  <div key={j} style={styles.strengthItem}>✓ {s}</div>
                ))}
              </div>
              <div style={styles.feedbackCol}>
                <div style={{ ...styles.feedLabel, color: '#c05621' }}>Areas to Improve</div>
                {q.improvements?.map((s, j) => (
                  <div key={j} style={styles.improvItem}>→ {s}</div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <div style={{ textAlign: 'center', marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={styles.btn} onClick={() => navigate('/setup')}>Try Another Role</button>
          <button style={{ ...styles.btn, background: '#fff', color: '#667eea', border: '2px solid #667eea' }} onClick={() => navigate('/')}>
            New Account
          </button>
        </div>
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '2rem', display: 'flex', justifyContent: 'center' },
  card: { background: '#fff', borderRadius: 16, padding: '2.5rem', width: '100%', maxWidth: 680, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', height: 'fit-content' },
  overallBox: { display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', borderRadius: 12, padding: '1.5rem', color: '#fff', marginBottom: '2rem' },
  scoreCircle: { display: 'flex', alignItems: 'baseline', gap: 2 },
  scoreNum: { fontSize: '3.5rem', fontWeight: 800, lineHeight: 1 },
  scoreMax: { fontSize: '1.2rem', opacity: 0.7 },
  title: { margin: 0, fontSize: '1.5rem', fontWeight: 700 },
  summary: { margin: '0.4rem 0 0', opacity: 0.9, lineHeight: 1.5, fontSize: '0.95rem' },
  sectionTitle: { fontSize: '1.1rem', fontWeight: 700, color: '#2d3748', marginBottom: '1rem' },
  qCard: { border: '1.5px solid #e2e8f0', borderRadius: 10, padding: '1.2rem', marginBottom: '1rem' },
  qHeader: { display: 'flex', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.8rem' },
  responseBox: { background: '#f7fafc', borderRadius: 8, padding: '0.75rem', marginBottom: '0.8rem' },
  feedbackRow: { display: 'flex', gap: '1rem' },
  feedbackCol: { flex: 1 },
  feedLabel: { fontSize: '0.75rem', fontWeight: 700, color: '#276749', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' },
  strengthItem: { fontSize: '0.9rem', color: '#276749', marginBottom: '0.2rem' },
  improvItem: { fontSize: '0.9rem', color: '#c05621', marginBottom: '0.2rem' },
  btn: { padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
}
