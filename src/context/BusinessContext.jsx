import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  initialActivity, initialBusinessNotifications, initialCompany, initialLocations, initialQuotes,
} from '@/data/business'

const BusinessContext = createContext(null)

const VAT = 0.14
export const quoteTotals = (quote) => {
  const subtotal = (quote.lines ?? []).reduce((sum, line) => sum + line.qty * line.unitPrice, 0)
  return { subtotal, vat: Math.round(subtotal * VAT), total: Math.round(subtotal * (1 + VAT)) }
}

const stamp = () => new Date().toLocaleString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·')

// State for the business account: company, quote requests / quotations, delivery locations.
export function BusinessProvider({ children }) {
  const { user } = useAuth()
  const [company, setCompany] = useState(() => ({ ...initialCompany, ...(user?.company && { name: user.company }) }))
  const [quotes, setQuotes] = useState(initialQuotes)
  const [locations, setLocations] = useState(initialLocations)
  const [activity, setActivity] = useState(initialActivity)
  const [notifications, setNotifications] = useState(initialBusinessNotifications)

  const log = (text) => setActivity((items) => [{ text, when: stamp() }, ...items].slice(0, 8))
  const patchQuote = (id, patch) => setQuotes((items) => items.map((q) => (q.id === id ? { ...q, ...patch } : q)))

  const acceptQuote = useCallback((id) => {
    setQuotes((items) => items.map((q) => (q.id === id ? { ...q, status: 'accepted', acceptedTotal: quoteTotals(q).total } : q)))
    log(`You accepted ${id.replace('RFQ', 'Q')} v2`)
  }, [])

  const requestChanges = useCallback((id, changes) => {
    setQuotes((items) => items.map((q) => (q.id === id ? { ...q, status: 'review', requestedChanges: changes } : q)))
    log(`You requested changes on ${id.replace('RFQ', 'Q')}`)
  }, [])

  const requestAgain = useCallback((id) => {
    const nextId = `RFQ-2026-0${Math.floor(200 + Math.random() * 700)}`
    setQuotes((items) => {
      const source = items.find((q) => q.id === id)
      return [{ ...source, id: nextId, status: 'review', submitted: new Date().toISOString().slice(0, 10), quoteNo: undefined, version: undefined }, ...items]
    })
    log(`You re-sent ${id} as ${nextId}`)
  }, [])

  const saveLocation = useCallback((location) => {
    setLocations((items) => {
      const next = location.id ? items.map((l) => (l.id === location.id ? location : l)) : [...items, { ...location, id: `loc-${Date.now()}` }]
      return location.isDefault ? next.map((l) => ({ ...l, isDefault: l.id === (location.id ?? next.at(-1).id) })) : next
    })
  }, [])
  const removeLocation = useCallback((id) => setLocations((items) => {
    const next = items.filter((l) => l.id !== id)
    return next.length && !next.some((l) => l.isDefault) ? next.map((l, i) => ({ ...l, isDefault: i === 0 })) : next
  }), [])
  const setDefaultLocation = useCallback((id) => setLocations((items) => items.map((l) => ({ ...l, isDefault: l.id === id }))), [])

  const updateCompany = useCallback((values) => setCompany((c) => ({ ...c, ...values })), [])
  const setNotification = useCallback((key, value) => setNotifications((n) => ({ ...n, [key]: value })), [])

  const value = useMemo(() => ({
    company, quotes, locations, activity, notifications,
    acceptQuote, requestChanges, requestAgain, patchQuote,
    saveLocation, removeLocation, setDefaultLocation, updateCompany, setNotification,
  }), [company, quotes, locations, activity, notifications, acceptQuote, requestChanges, requestAgain, saveLocation, removeLocation, setDefaultLocation, updateCompany, setNotification])

  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>
}

export function useBusiness() {
  const context = useContext(BusinessContext)
  if (!context) throw new Error('useBusiness must be used inside BusinessProvider')
  return context
}
