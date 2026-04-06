import { getToken } from '../utils/storage'

const AUTH_API = import.meta.env.VITE_AUTH_API || 'http://localhost:8001/api/auth'
const COMPLAINT_API = import.meta.env.VITE_COMPLAINT_API || 'http://localhost:8002/api/complaints'
const MAP_API = import.meta.env.VITE_MAP_API || 'http://localhost:8004/api/map'

function makeHeaders(extra = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function handleResponse(response) {
  const contentType = response.headers.get('content-type') || ''
  const isJson = contentType.includes('application/json')
  const data = isJson ? await response.json() : await response.text()

  if (!response.ok) {
    const message = typeof data === 'string' ? data : data.error || data.message || 'Request failed'
    throw new Error(message)
  }

  return data
}

export async function login(payload) {
  const response = await fetch(`${AUTH_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

export async function register(payload) {
  const response = await fetch(`${AUTH_API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

export async function getComplaints() {
  const response = await fetch(COMPLAINT_API, {
    headers: makeHeaders(),
  })

  return handleResponse(response)
}

export async function createComplaint({ image, description, latitude, longitude }) {
  const formData = new FormData()
  formData.append('image', image)
  formData.append('description', description)
  formData.append('latitude', latitude)
  formData.append('longitude', longitude)

  const response = await fetch(COMPLAINT_API, {
    method: 'POST',
    headers: makeHeaders(),
    body: formData,
  })

  return handleResponse(response)
}

export async function getBins(lat, lng) {
  const params = new URLSearchParams()
  if (lat !== undefined && lat !== null && lat !== '') params.set('lat', String(lat))
  if (lng !== undefined && lng !== null && lng !== '') params.set('lng', String(lng))

  const query = params.toString()
  const url = query ? `${MAP_API}/bins?${query}` : `${MAP_API}/bins`

  const response = await fetch(url, {
    headers: makeHeaders(),
  })

  return handleResponse(response)
}

export async function setBinLocation(payload) {
  const response = await fetch(`${MAP_API}/bins`, {
    method: 'POST',
    headers: makeHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

export async function getAdminComplaints() {
  const response = await fetch(COMPLAINT_API, {
    headers: makeHeaders(),
  })

  return handleResponse(response)
}

export async function updateComplaintStatus(id, status = 'cleaned') {
  const response = await fetch(`${COMPLAINT_API}/${id}/clean`, {
    method: 'PATCH',
    headers: makeHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ status }),
  })

  return handleResponse(response)
}

export async function deleteComplaint(id) {
  const response = await fetch(`${COMPLAINT_API}/${id}`, {
    method: 'DELETE',
    headers: makeHeaders(),
  })

  return handleResponse(response)
}
