import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { fetchCompanies, fetchRoles, fetchRoleDetail } from '../lib/api'

// ── Brand logo renderers ──────────────────────────────────────────────────────
function TCSLogo({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 80 40" width={size * 1.4} height={size * 0.7}>
        <text x="0" y="34" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="38" fill="#d32f2f" letterSpacing="-2">tcs</text>
      </svg>
    </div>
  )
}

function InfosysLogo({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 120 30" width={size * 1.8} height={size * 0.55}>
        <text x="0" y="26" fontFamily="Arial, sans-serif" fontWeight="700" fontSize="26" fill="#007cc2" letterSpacing="0.5">Infosys</text>
      </svg>
    </div>
  )
}

function CREDLogo({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, background: '#1a1a1a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 40 40" width={size * 0.6} height={size * 0.6}>
        <path d="M20 3 L34 9 L34 22 Q34 32 20 37 Q6 32 6 22 L6 9 Z" fill="none" stroke="#fff" strokeWidth="2.5"/>
        <text x="13" y="26" fontFamily="Arial Black" fontWeight="900" fontSize="14" fill="#fff">C</text>
      </svg>
    </div>
  )
}

function PhonePeLogo({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: '#5f259f', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 50 30" width={size * 0.8} height={size * 0.5}>
        <text x="2" y="24" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="#fff">Pe</text>
      </svg>
    </div>
  )
}

function FlipkartLogo({ size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, background: '#f8a800', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 40 50" width={size * 0.55} height={size * 0.7}>
        <text x="4" y="40" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="40" fill="#2874f0">F</text>
      </svg>
    </div>
  )
}

function DefaultLogo({ name, size = 56 }) {
  return (
    <div style={{ width: size, height: size, borderRadius: 12, background: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: size * 0.38 }}>
      {name[0]}
    </div>
  )
}

function CompanyLogo({ name, size = 56 }) {
  if (name === 'TCS') return <TCSLogo size={size} />
  if (name === 'Infosys') return <InfosysLogo size={size} />
  if (name === 'CRED') return <CREDLogo size={size} />
  if (name === 'PhonePe') return <PhonePeLogo size={size} />
  if (name === 'Flipkart') return <FlipkartLogo size={size} />
  return <DefaultLogo name={name} size={size} />
}

// ── Nav icons ─────────────────────────────────────────────────────────────────
const NAV = [
  { label: 'Mock Interview', active: true,
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="2" y="3" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M8 21h8M12 17v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { label: 'Dashboard',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/></svg> },
  { label: 'Interview History',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { label: 'Bookmarks',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2"/></svg> },
  { label: 'Profile',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/></svg> },
  { label: 'Settings',
    icon: <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" stroke="currentColor" strokeWidth="2"/></svg> },
]

// ── Main page ─────────────────────────────────────────────────────────────────
export default function SetupPage() {
  const navigate = useNavigate()
  const rolesRef = useRef(null)
  const detailRef = useRef(null)

  const [companies, setCompanies]         = useState([])
  const [roles, setRoles]                 = useState([])
  const [roleDetail, setRoleDetail]       = useState(null)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [selectedRole, setSelectedRole]   = useState(null)
  const [companySearch, setCompanySearch] = useState('')
  const [loadingRoles, setLoadingRoles]   = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  const step = !selectedCompany ? 1 : !selectedRole ? 2 : 3

  useEffect(() => {
    fetchCompanies().then(setCompanies).catch(() => {})
  }, [])

  const handleSelectCompany = async (company) => {
    if (selectedCompany?.id === company.id) return
    setSelectedCompany(company)
    setSelectedRole(null)
    setRoleDetail(null)
    setRoles([])
    setLoadingRoles(true)
    try {
      const data = await fetchRoles(company.id)
      setRoles(data.roles || [])
      setTimeout(() => rolesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } finally {
      setLoadingRoles(false)
    }
  }

  const handleSelectRole = async (role) => {
    setSelectedRole(role)
    setRoleDetail(null)
    setLoadingDetail(true)
    try {
      const detail = await fetchRoleDetail(selectedCompany.id, role.id)
      setRoleDetail(detail)
      setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80)
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleStart = () => {
    sessionStorage.setItem('interview_selection', JSON.stringify({
      company: selectedCompany.name,
      role: selectedRole.title,
    }))
    navigate('/instructions')
  }

  const filteredCompanies = companies.filter(c =>
    c.name.toLowerCase().includes(companySearch.toLowerCase())
  )

  return (
    <div style={s.shell}>

      {/* ── Sidebar ── */}
      <aside style={s.sidebar}>
        <div style={s.brand}>
          <div style={s.brandIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" fill="#2563eb"/>
            </svg>
          </div>
          <div>
            <div style={s.brandName}>MockPro</div>
            <div style={s.brandTag}>Practice. Improve. Succeed.</div>
          </div>
        </div>

        <nav style={s.nav}>
          {NAV.map(item => (
            <div key={item.label} style={{ ...s.navItem, ...(item.active ? s.navActive : {}) }}>
              <span style={{ color: item.active ? '#2563eb' : '#9ca3af', display: 'flex' }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: item.active ? 600 : 500, color: item.active ? '#2563eb' : '#374151' }}>{item.label}</span>
            </div>
          ))}
        </nav>

        <div style={s.proTip}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#2563eb"/></svg>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#2563eb' }}>Pro Tip</span>
          </div>
          <p style={{ margin: 0, fontSize: 12, color: '#4b5563', lineHeight: 1.5 }}>Practice regularly to improve your confidence and performance.</p>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={s.main}>
        <div style={s.content}>

          {/* Header */}
          <h1 style={s.pageTitle}>Mock Interview</h1>
          <p style={s.pageSub}>Select a company and role to start your mock interview.</p>

          {/* Stepper */}
          <div style={s.stepper}>
            <StepBubble n={1} label="Select Company" active={step >= 1} past={step > 1} />
            <div style={{ ...s.stepLine, background: step > 1 ? '#2563eb' : '#d1d5db' }} />
            <StepBubble n={2} label="Select Role" active={step >= 2} past={step > 2} />
            <div style={{ ...s.stepLine, background: step > 2 ? '#2563eb' : '#d1d5db' }} />
            <StepBubble n={3} label="Start Interview" active={step >= 3} past={false} />
          </div>

          {/* Company section card */}
          <div style={s.card}>

            {/* Hero — visible only when no company selected */}
            {!selectedCompany && (
              <div style={s.hero}>
                <div style={s.heroIcon}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="#2563eb" strokeWidth="1.5"/>
                    <polyline points="9 22 9 12 15 12 15 22" stroke="#2563eb" strokeWidth="1.5"/>
                  </svg>
                  <span style={s.heroDot} />
                  <span style={{ ...s.heroDot, top: 6, right: -10 }} />
                  <span style={{ ...s.heroDot, bottom: 4, left: -8 }} />
                  <span style={{ ...s.heroDot, top: -6, left: 4 }} />
                </div>
                <h2 style={s.heroTitle}>Let's get started</h2>
                <p style={s.heroSub}>Search and select a company to explore roles<br />that match your goals.</p>
              </div>
            )}

            {/* Company search + grid */}
            <div style={s.sectionLabel}>Select a Company</div>

            <div style={s.searchWrap}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8" stroke="#9ca3af" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                style={s.searchInput}
                placeholder="Search companies..."
                value={companySearch}
                onChange={e => setCompanySearch(e.target.value)}
              />
            </div>

            <div style={s.companyGrid}>
              {filteredCompanies.map(company => {
                const active = selectedCompany?.id === company.id
                return (
                  <div
                    key={company.id}
                    style={{ ...s.companyCard, ...(active ? s.companyCardActive : {}) }}
                    onClick={() => handleSelectCompany(company)}
                  >
                    <CompanyLogo name={company.name} size={52} />
                    <span style={s.companyName}>{company.name}</span>
                    <Radio checked={active} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Roles — expands below company grid when company selected */}
          {selectedCompany && (
            <div ref={rolesRef} style={{ ...s.card, marginTop: 16, animation: 'fadeSlideIn 0.22s ease' }}>
              <div style={s.roleHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <CompanyLogo name={selectedCompany.name} size={32} />
                  <span style={s.sectionLabel}>{selectedCompany.name} — Select a Role</span>
                </div>
              </div>

              {loadingRoles ? (
                <div style={s.loadingWrap}>
                  <Spinner /> <span style={s.loadingText}>Loading roles…</span>
                </div>
              ) : (
                <div style={s.roleGrid}>
                  {roles.map(role => {
                    const active = selectedRole?.id === role.id
                    return (
                      <div
                        key={role.id}
                        style={{ ...s.roleCard, ...(active ? s.roleCardActive : {}) }}
                        onClick={() => handleSelectRole(role)}
                      >
                        <div style={s.roleCardTop}>
                          <span style={s.roleTitle}>{role.title}</span>
                          <Radio checked={active} />
                        </div>
                        <div style={s.roleMeta}>
                          <span style={s.roleTag}>{role.difficulty}</span>
                          <span style={s.roleTag}>{role.duration_mins} mins</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Role detail */}
          {(loadingDetail || roleDetail) && (
            <div ref={detailRef} style={{ ...s.card, marginTop: 16, animation: 'fadeSlideIn 0.22s ease' }}>
              {loadingDetail ? (
                <div style={s.loadingWrap}><Spinner /> <span style={s.loadingText}>Loading role details…</span></div>
              ) : (
                <>
                  <div style={s.sectionLabel}>Role Details</div>

                  <div style={s.detailTop}>
                    <CompanyLogo name={roleDetail.company} size={52} />
                    <div>
                      <h2 style={s.detailRole}>{roleDetail.title}</h2>
                      <p style={s.detailCompany}>{roleDetail.company}</p>
                      <div style={s.tagRow}>
                        <Tag>Experience: {roleDetail.experience}</Tag>
                        <Tag>Interview Type: {roleDetail.interview_type}</Tag>
                        <Tag>Duration: {roleDetail.duration_mins} mins</Tag>
                      </div>
                    </div>
                  </div>

                  <div style={s.divider} />

                  <div style={s.detailSection}>
                    <div style={s.detailSectionTitle}>About the Role</div>
                    <p style={s.detailText}>{roleDetail.about_role}</p>
                  </div>

                  <div style={s.detailSection}>
                    <div style={s.detailSectionTitle}>Skills Assessed</div>
                    <div style={s.skills}>
                      {roleDetail.skills.map(sk => <span key={sk} style={s.skillBadge}>{sk}</span>)}
                    </div>
                  </div>

                  <div style={s.twoCol}>
                    <div>
                      <div style={s.detailSectionTitle}>Interview Structure</div>
                      {roleDetail.interview_structure.map((item, i) => (
                        <div key={i} style={s.structItem}>
                          <div style={s.structIcon}><StructIcon type={item.type} /></div>
                          <div>
                            <div style={s.structName}>{item.type}</div>
                            <div style={s.structCount}>{item.count} {item.count === 1 ? 'Question' : 'Questions'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={s.detailSectionTitle}>What to Expect</div>
                      {roleDetail.what_to_expect.map((item, i) => (
                        <div key={i} style={s.expectItem}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" fill="#2563eb"/>
                            <path d="M8 12l3 3 5-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          <span style={s.expectText}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button style={s.startBtn} onClick={handleStart}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21"/></svg>
                    Start Interview
                  </button>
                </>
              )}
            </div>
          )}

          {/* Info banner */}
          <div style={s.banner}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#2563eb" strokeWidth="2"/>
            </svg>
            <span style={s.bannerText}>Your interview will be recorded and the AI will provide personalized feedback to help you improve.</span>
          </div>

        </div>
      </main>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

// ── Small components ──────────────────────────────────────────────────────────
function StepBubble({ n, label, active, past }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 30, height: 30, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, flexShrink: 0,
        background: active ? '#2563eb' : '#fff',
        border: active ? '2px solid #2563eb' : '2px solid #d1d5db',
        color: active ? '#fff' : '#9ca3af',
      }}>
        {past
          ? <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          : n}
      </div>
      <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: active ? '#111827' : '#9ca3af', whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  )
}

function Radio({ checked }) {
  return (
    <div style={{
      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
      border: checked ? '5px solid #2563eb' : '2px solid #d1d5db',
      background: '#fff', transition: 'border 0.15s',
    }} />
  )
}

function Tag({ children }) {
  return <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: 20, padding: '3px 10px', fontSize: 12, fontWeight: 500 }}>{children}</span>
}

function Spinner() {
  return (
    <div style={{ width: 18, height: 18, border: '2px solid #e5e7eb', borderTop: '2px solid #2563eb', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}

function StructIcon({ type }) {
  const t = type.toLowerCase()
  if (t.includes('cod') || t.includes('aptitude')) {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><polyline points="16 18 22 12 16 6" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/><polyline points="8 6 2 12 8 18" stroke="#2563eb" strokeWidth="2" strokeLinecap="round"/></svg>
  }
  if (t.includes('behav') || t.includes('hr') || t.includes('people')) {
    return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="#2563eb" strokeWidth="2"/><circle cx="9" cy="7" r="4" stroke="#2563eb" strokeWidth="2"/></svg>
  }
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#2563eb" strokeWidth="2"/></svg>
}

// ── Styles ────────────────────────────────────────────────────────────────────
const s = {
  shell: { display: 'flex', minHeight: '100vh', background: '#f9fafb', fontFamily: "system-ui,'Segoe UI',sans-serif" },

  sidebar: { width: 240, minWidth: 240, background: '#fff', boxShadow: '1px 0 0 #e5e7eb', display: 'flex', flexDirection: 'column', padding: '24px 14px', position: 'sticky', top: 0, height: '100vh', overflowY: 'auto' },
  brand: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 },
  brandIcon: { width: 38, height: 38, borderRadius: 10, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  brandName: { fontWeight: 700, fontSize: 16, color: '#111827', lineHeight: 1.2 },
  brandTag: { fontSize: 10, color: '#9ca3af' },

  nav: { display: 'flex', flexDirection: 'column', gap: 2, flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '9px 10px', borderRadius: 8, cursor: 'pointer' },
  navActive: { background: '#eff6ff' },

  proTip: { marginTop: 20, background: '#eff6ff', borderRadius: 12, padding: '14px 12px' },

  main: { flex: 1, overflowY: 'auto' },
  content: { maxWidth: 1000, margin: '0 auto', padding: '32px 28px 56px' },

  pageTitle: { margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#111827' },
  pageSub: { margin: '0 0 24px', fontSize: 14, color: '#6b7280' },

  stepper: { display: 'flex', alignItems: 'center', marginBottom: 24 },
  stepLine: { flex: 1, height: 2, margin: '0 10px', minWidth: 32, maxWidth: 100 },

  card: { background: '#fff', borderRadius: 14, border: '1px solid #e5e7eb', padding: '24px 24px 20px' },

  // Hero
  hero: { textAlign: 'center', padding: '24px 0 20px' },
  heroIcon: { position: 'relative', width: 72, height: 72, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  heroDot: { position: 'absolute', width: 7, height: 7, borderRadius: '50%', background: '#bfdbfe', top: 4, right: -6 },
  heroTitle: { margin: '0 0 8px', fontSize: 22, fontWeight: 700, color: '#111827' },
  heroSub: { margin: 0, fontSize: 14, color: '#6b7280', lineHeight: 1.6 },

  sectionLabel: { fontWeight: 700, fontSize: 15, color: '#111827', marginBottom: 14 },

  searchWrap: { display: 'flex', alignItems: 'center', gap: 10, border: '1px solid #e5e7eb', borderRadius: 10, padding: '10px 14px', marginBottom: 18 },
  searchInput: { border: 'none', outline: 'none', fontSize: 14, color: '#374151', width: '100%', background: 'transparent' },

  companyGrid: { display: 'flex', gap: 12, flexWrap: 'wrap' },
  companyCard: { flex: '1 1 130px', maxWidth: 180, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, padding: '20px 12px 14px', borderRadius: 12, border: '1.5px solid #e5e7eb', cursor: 'pointer', transition: 'border 0.15s, box-shadow 0.15s', background: '#fff' },
  companyCardActive: { border: '1.5px solid #2563eb', boxShadow: '0 0 0 3px #dbeafe' },
  companyName: { fontSize: 13, fontWeight: 600, color: '#111827' },

  roleHeader: { marginBottom: 16 },
  roleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 },
  roleCard: { padding: '14px 14px 12px', border: '1.5px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', transition: 'border 0.15s, box-shadow 0.15s', background: '#fff' },
  roleCardActive: { border: '1.5px solid #2563eb', boxShadow: '0 0 0 3px #dbeafe', background: '#f8fbff' },
  roleCardTop: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 8 },
  roleTitle: { fontSize: 14, fontWeight: 600, color: '#1f2937', lineHeight: 1.3 },
  roleMeta: { display: 'flex', gap: 6 },
  roleTag: { fontSize: 11, color: '#6b7280', background: '#f3f4f6', borderRadius: 20, padding: '2px 8px' },

  loadingWrap: { display: 'flex', alignItems: 'center', gap: 10, padding: '20px 4px' },
  loadingText: { fontSize: 13, color: '#9ca3af' },

  // Detail
  detailTop: { display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 16 },
  detailRole: { margin: '0 0 2px', fontSize: 20, fontWeight: 700, color: '#111827' },
  detailCompany: { margin: '0 0 10px', fontSize: 14, color: '#6b7280' },
  tagRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  divider: { height: 1, background: '#f3f4f6', margin: '0 0 18px' },
  detailSection: { marginBottom: 18 },
  detailSectionTitle: { fontWeight: 700, fontSize: 14, color: '#111827', marginBottom: 8 },
  detailText: { margin: 0, fontSize: 14, color: '#4b5563', lineHeight: 1.6 },
  skills: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  skillBadge: { background: '#eff6ff', color: '#2563eb', borderRadius: 20, padding: '4px 12px', fontSize: 13, fontWeight: 500 },
  twoCol: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 },
  structItem: { display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 12 },
  structIcon: { width: 32, height: 32, borderRadius: 8, background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  structName: { fontSize: 14, fontWeight: 600, color: '#1f2937' },
  structCount: { fontSize: 12, color: '#6b7280', marginTop: 1 },
  expectItem: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 },
  expectText: { fontSize: 14, color: '#374151' },

  startBtn: { width: '100%', padding: '14px', borderRadius: 10, border: 'none', background: '#2563eb', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 },
  errorBox: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', color: '#dc2626', fontSize: 13, marginBottom: 12 },

  banner: { display: 'flex', alignItems: 'center', gap: 10, background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '12px 16px', marginTop: 16 },
  bannerText: { fontSize: 13, color: '#1d4ed8' },
}
