const BASE = 'http://localhost:8000'

export async function fetchCompanies() {
  const res = await fetch(`${BASE}/company/`)
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function fetchRoles(companyId) {
  const res = await fetch(`${BASE}/company/${companyId}/roles/`)
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function fetchRoleDetail(companyId, roleId) {
  const res = await fetch(`${BASE}/company/${companyId}/roles/${roleId}/`)
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function loginUser(data) {
  const res = await fetch(`${BASE}/user/login/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function registerUser(data) {
  const res = await fetch(`${BASE}/user/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function startInterview({ company, role }) {
  const res = await fetch(`${BASE}/core/interview/start/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ company, role }),
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function submitResponse(interviewId, questionId, audioBlob) {
  const form = new FormData()
  form.append('interview_id', interviewId)
  form.append('question_id', questionId)
  form.append('audio', audioBlob, `response_${questionId}.webm`)

  const res = await fetch(`${BASE}/core/interview/respond/`, {
    method: 'POST',
    body: form,
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}

export async function analyzeInterview({ interview_id }) {
  const res = await fetch(`${BASE}/core/interview/analyze/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ interview_id }),
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}
