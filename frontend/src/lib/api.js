const BASE = ''

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

export async function analyzeInterview({ questions, responses }) {
  const res = await fetch(`${BASE}/core/interview/analyze/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ questions, responses }),
  })
  const json = await res.json()
  if (!res.ok) throw json
  return json
}
