import { useCallback, useSyncExternalStore } from 'react'

// Saved products ("heart"), shared by every page and kept in localStorage.
// Any component using this hook re-renders when a heart is toggled anywhere, including other tabs.
const KEY = 'geni-favorites'
const listeners = new Set()

function read() {
  try {
    const value = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(value) ? value : []
  } catch {
    return []
  }
}

let snapshot = read()

function subscribe(listener) {
  listeners.add(listener)
  const onStorage = (event) => {
    if (event.key === KEY) {
      snapshot = read()
      listener()
    }
  }
  window.addEventListener('storage', onStorage)
  return () => {
    listeners.delete(listener)
    window.removeEventListener('storage', onStorage)
  }
}

const getSnapshot = () => snapshot

export function useFavorites() {
  const favorites = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)

  const toggleFavorite = useCallback((id) => {
    snapshot = snapshot.includes(id) ? snapshot.filter((x) => x !== id) : [...snapshot, id]
    try {
      localStorage.setItem(KEY, JSON.stringify(snapshot))
    } catch {
      /* storage full or blocked: keep the in-memory list */
    }
    listeners.forEach((listener) => listener())
  }, [])

  const isFavorite = useCallback((id) => favorites.includes(id), [favorites])

  return { favorites, isFavorite, toggleFavorite }
}
