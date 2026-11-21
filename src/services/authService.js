// Auth + account API client. Set VITE_API_URL to the backend base URL.
// Expected contract (all JSON, errors as { message }):
//   POST   /auth/login            { identifier, password }                 -> { token, user }
//   POST   /auth/register         { identifier, password }                 -> { token, user }
//   GET    /auth/:provider        (facebook | apple | google) starts the OAuth redirect flow
//   POST   /auth/change-password  { currentPassword, newPassword }  (Bearer token)
//   DELETE /account               (Bearer token)
//
// LOCAL MODE: while VITE_API_URL is empty nothing leaves the browser. Any valid credentials
// create a session stored in this browser so the whole UI can be used and demoed.
// It is NOT real authentication; set VITE_API_URL before shipping.
const API_URL = import.meta.env.VITE_API_URL

function localUser(identifier) {
  const value = identifier.trim()
  if (value.includes('@')) {
    const [handle] = value.split('@')
    const word = handle.split(/[._-]/)[0]
    return { name: word.charAt(0).toUpperCase() + word.slice(1), email: value }
  }
  return { name: '', mobile: value }
}

const localSession = (user) => ({ token: 'local-session', user })

async function request(method, path, body, token) {
  let response
  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }) },
      body: body && JSON.stringify(body),
    })
  } catch {
    throw new Error('Unable to reach the server. Check your connection and try again.')
  }

  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message || 'Something went wrong. Please try again.')
  return data
}

export async function login({ identifier, password }) {
  if (!API_URL) return localSession(localUser(identifier))
  return request('POST', '/auth/login', { identifier, password })
}

export async function register({ identifier, password }) {
  if (!API_URL) return localSession(localUser(identifier))
  return request('POST', '/auth/register', { identifier, password })
}

// Returns a session in local mode, otherwise redirects the browser to the provider flow.
export async function signInWithProvider(provider) {
  if (!API_URL) return localSession({ name: '', provider })
  window.location.assign(`${API_URL}/auth/${provider}`)
  return null
}

export async function changePassword(payload, token) {
  if (!API_URL) return
  await request('POST', '/auth/change-password', payload, token)
}

export async function deleteAccount(token) {
  if (!API_URL) return
  await request('DELETE', '/account', undefined, token)
}
