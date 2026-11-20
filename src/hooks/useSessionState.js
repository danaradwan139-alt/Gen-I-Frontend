import { useEffect, useState } from 'react'

// useState that survives a page refresh for the rest of the browser session.
export function useSessionState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = sessionStorage.getItem(key)
      return saved != null ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      sessionStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage blocked: state still works for this visit */
    }
  }, [key, value])

  return [value, setValue]
}
