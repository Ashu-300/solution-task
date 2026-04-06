import { getToken } from '../utils/storage'
import { parseJwt } from '../utils/jwt'

const AUTH_API = import.meta.env.VITE_AUTH_API || 'http://localhost:8001/api/auth'
const COMPLAINT_API = import.meta.env.VITE_COMPLAINT_API || 'http://localhost:8002/api/complaints'
const MAP_API = import.meta.env.VITE_MAP_API || 'http://localhost:8004/api/map'

function authHeaders(extra = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const payload = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof payload === 'string' ? payload : payload.message || payload.error || 'Request failed'
    throw new Error(message)
  }

  return payload
}

export async function adminLogin(email, password) {
  const response = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  const data = await parseResponse(response)
  const role = parseJwt(data?.token)?.role
  if (role !== 'admin') {
    throw new Error('Only admin accounts can access this portal')
  }

  return data
}

export async function adminRegister(name, email, password) {
  const response = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role: 'admin' }),
  })

  const data = await parseResponse(response)
  const role = parseJwt(data?.token)?.role || data?.user?.role
  if (role !== 'admin') {
    throw new Error('Registration succeeded, but this account is not admin.')
  }

  return data
}

export async function getAdminComplaints() {
  const response = await fetch(COMPLAINT_API, {
    headers: authHeaders(),
  })

  return parseResponse(response)
}

export async function updateComplaintStatus(id, status = 'cleaned') {
  const response = await fetch(`${COMPLAINT_API}/${id}/clean`, {
    method: 'PATCH',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  })

  return parseResponse(response)
}

export async function deleteComplaint(id) {
  const response = await fetch(`${COMPLAINT_API}/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  return parseResponse(response)
}

export async function getBins() {
  const response = await fetch(`${MAP_API}/bins`, {
    headers: authHeaders(),
  })

  return parseResponse(response)
}

export async function addBin(payload) {
  const response = await fetch(`${MAP_API}/bins`, {
    method: 'POST',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  return parseResponse(response)
}
