import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CountdownTimer from '../components/CountdownTimer'
import SpeechRecorder from '../components/SpeechRecorder'
import { analyzeInterview } from '../lib/api'

const PHASES = { DISPLAY: 'display', PREP: 'prep', RECORD: 'record', DONE: 'done' }

export default function InterviewPage() {
  const navigate = useNavigate()
  const session = JSON.parse(sessionStorage.getItem('interview') || 'null')
  const questions = session?.questions || []

  const [qIndex, setQIndex] = useState(0)
  const [phase, setPhase] = useState(PHASES.DISPLAY)
  const [responses, setResponses] = useState([])
  const [transcript, setTranscript] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const timerKey = useRef(0)

  useEffect(() => {
    if (!session) navigate('/')
  }, [])

  const question = questions[qIndex]
  const isLast = qIndex === questions.length - 1

  const startPrep = () => {
    timerKey.current++
    setTranscript('')
    setPhase(PHASES.PREP)
  }

  const startRecord = () => {
    timerKey.current++
    setPhase(PHASES.RECORD)
  }

  const finishResponse = (text) => {
    const saved = text || transcript || '(no response)'
    const newResponses = [...responses, { question_id: question.id, response_text: saved }]
    setResponses(newResponses)

    if (isLast) {
      submitAnalysis(newResponses)
    } else {
      setQIndex(i => i + 1)
      setPhase(PHASES.DISPLAY)
    }
  }

  const submitAnalysis = async (allResponses) => {
    setSubmitting(true)
    try {
      const result = await analyzeInterview({ questions, responses: allResponses })
      sessionStorage.setItem('results', JSON.stringify(result))
      navigate('/results')
    } catch {
      navigate('/results')
    }
  }

  if (!question) return null

  const phaseConfig = {
    [PHASES.DISPLAY]: {
      label: 'Read the question',
      color: '#4299e1',
      bg: '#ebf8ff',
    },
    [PHASES.PREP]: {
      label: 'Preparation time',
      color: '#ed8936',
      bg: '#fffaf0',
    },
    [PHASES.RECORD]: {
      label: 'Answer now',
      color: '#48bb78',
      bg: '#f0fff4',
    },
  }

  const cfg = phaseConfig[phase] || phaseConfig[PHASES.DISPLAY]

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <span style={styles.qCounter}>Question {qIndex + 1} / {questions.length}</span>
            <span style={{ ...styles.phaseBadge, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
          </div>
          <div style={styles.dots}>
            {questions.map((_, i) => (
              <div key={i} style={{ ...styles.dot, background: i < qIndex ? '#48bb78' : i === qIndex ? cfg.color : '#e2e8f0' }} />
            ))}
          </div>
        </div>

        {/* Question */}
        <div style={styles.questionBox}>
          <div style={{ fontSize: '0.8rem', color: '#a0aec0', marginBottom: '0.5rem' }}>
            {question.category} · {question.difficulty}
          </div>
          <p style={styles.questionText}>{question.question}</p>
        </div>

        {/* Phase content */}
        {phase === PHASES.DISPLAY && (
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <p style={{ color: '#718096', marginBottom: '1rem' }}>Take a moment to read the question, then start your preparation time.</p>
            <button style={styles.btn} onClick={startPrep}>Start Preparation (30s) →</button>
          </div>
        )}

        {phase === PHASES.PREP && (
          <div>
            <CountdownTimer key={`prep-${timerKey.current}`} seconds={30} label="Preparation time" onExpire={startRecord} />
            <div style={{ textAlign: 'center' }}>
              <button style={{ ...styles.btn, background: '#ed8936' }} onClick={startRecord}>Skip prep → Start answering</button>
            </div>
          </div>
        )}

        {phase === PHASES.RECORD && (
          <div>
            <CountdownTimer key={`rec-${timerKey.current}`} seconds={60} label="Response time" onExpire={() => finishResponse(transcript)} />
            <SpeechRecorder active={true} onTranscript={setTranscript} />
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <button style={{ ...styles.btn, background: '#48bb78' }} onClick={() => finishResponse(transcript)}>
                {isLast ? 'Finish Interview ✓' : 'Done → Next Question'}
              </button>
            </div>
            {question.follow_up_hint && (
              <div style={styles.hint}>
                <b>Hint:</b> {question.follow_up_hint}
              </div>
            )}
          </div>
        )}

        {submitting && (
          <div style={styles.overlay}>
            <div style={styles.spinner} />
            <p style={{ marginTop: '1rem', color: '#fff' }}>Analyzing your responses…</p>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  page: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)', padding: '1.5rem' },
  card: { position: 'relative', background: '#fff', borderRadius: 16, padding: '2rem', width: '100%', maxWidth: 600, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', overflow: 'hidden' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' },
  qCounter: { fontWeight: 700, color: '#2d3748', marginRight: '0.6rem' },
  phaseBadge: { padding: '0.2rem 0.8rem', borderRadius: 20, fontSize: '0.8rem', fontWeight: 600 },
  dots: { display: 'flex', gap: '0.4rem' },
  dot: { width: 12, height: 12, borderRadius: '50%', transition: 'background 0.3s' },
  questionBox: { background: '#f7fafc', borderRadius: 10, padding: '1.2rem 1.5rem', marginBottom: '0.5rem' },
  questionText: { margin: 0, fontSize: '1.15rem', lineHeight: 1.6, color: '#2d3748', fontWeight: 500 },
  btn: { display: 'inline-block', padding: '0.7rem 1.5rem', borderRadius: 8, border: 'none', background: 'linear-gradient(135deg,#667eea,#764ba2)', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' },
  hint: { marginTop: '1rem', padding: '0.7rem 1rem', borderRadius: 8, background: '#fffff0', border: '1px solid #faf089', fontSize: '0.9rem', color: '#744210' },
  overlay: { position: 'absolute', inset: 0, background: 'rgba(102,126,234,0.92)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  spinner: { width: 48, height: 48, border: '5px solid rgba(255,255,255,0.3)', borderTop: '5px solid #fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
}
