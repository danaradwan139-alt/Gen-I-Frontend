import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const AuthContext = createContext(null)
const STORAGE_KEY = 'geni-session'

function readSession() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : null
  } catch {
    return null
  }
}

function clearStoredSession() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // Storage is unavailable (e.g. private mode); the session lives in memory only.
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readSession)

  const signIn = useCallback((nextSession, { remember = false } = {}) => {
    clearStoredSession()
    try {
      const storage = remember ? localStorage : sessionStorage
      storage.setItem(STORAGE_KEY, JSON.stringify(nextSession))
    } catch {
      // Storage is unavailable; the session lives in memory only.
    }
    setSession(nextSession)
  }, [])

  const signOut = useCallback(() => {
    clearStoredSession()
    setSession(null)
  }, [])

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session?.token),
      signIn,
      signOut,
    }),
    [session, signIn, signOut]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }

  return context
}
