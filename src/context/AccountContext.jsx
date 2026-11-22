import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import {
  initialActiveRepair, initialAddresses, initialCards, initialDevices, initialInvoices, initialNotifications,
  initialOrderDetails, initialOrders, initialPastRepairs, initialReservations, initialSavedItems, initialSecurity,
  initialTradeInCredit, initialTradeIns,
} from '@/data/account'

const AccountContext = createContext(null)
const DAY = 24 * 60 * 60 * 1000

// Profile fields come from the signed-in user when known, otherwise the sample profile.
function buildProfile(user) {
  const [first, ...rest] = (user?.name ?? '').trim().split(/\s+/).filter(Boolean)
  const known = Boolean(user?.name || user?.email || user?.mobile)
  return {
    firstName: user?.firstName ?? first ?? (known ? '' : 'Mohamed'),
    lastName: user?.lastName ?? (rest.join(' ') || (known ? '' : 'Ahmed')),
    email: user?.email ?? (known ? '' : 'mohamed@email.com'),
    mobile: user?.mobile ?? (known ? '' : '+20 100 000 0000'),
    birthDate: user?.birthDate ?? '',
    language: user?.language ?? 'English',
  }
}

export function AccountProvider({ children }) {
  const { user } = useAuth()
  const [savedItems, setSavedItems] = useState(initialSavedItems)
  const [reservations, setReservations] = useState(initialReservations)
  const [addresses, setAddresses] = useState(initialAddresses)
  const [cards, setCards] = useState(initialCards)
  const [invoices] = useState(initialInvoices)
  // Read-only until the orders / repairs / trade-ins API exists.
  const [orders, setOrders] = useState(initialOrders)
  const [orderDetails, setOrderDetails] = useState(initialOrderDetails)
  const [activeRepair, setActiveRepair] = useState(initialActiveRepair)
  const [pastRepairs] = useState(initialPastRepairs)
  const [tradeIns, setTradeIns] = useState(initialTradeIns)
  const [tradeInCredit] = useState(initialTradeInCredit)
  const [profile, setProfile] = useState(() => buildProfile(user))
  const [security, setSecurity] = useState(initialSecurity)
  const [devices, setDevices] = useState(initialDevices)
  const [notifications, setNotifications] = useState(initialNotifications)

  useEffect(() => { setProfile(buildProfile(user)) }, [user])

  const removeSavedItem = useCallback((productId, variantId) => {
    setSavedItems((items) => items.filter((item) => !(item.productId === productId && item.variantId === variantId)))
  }, [])

  const extendReservation = useCallback((id) => {
    setReservations((items) =>
      items.map((item) => (item.id === id ? { ...item, heldUntil: new Date(new Date(item.heldUntil).getTime() + DAY).toISOString() } : item))
    )
  }, [])

  const cancelReservation = useCallback((id) => {
    setReservations((items) => items.filter((item) => item.id !== id))
  }, [])

  // Records a return request on a delivered order (sample data only): the order moves to the Returns filter.
  const submitReturn = useCallback((orderId, request) => {
    const requested = { label: 'Return requested', tone: 'blue' }
    setOrderDetails((current) => {
      const order = current[orderId]
      if (!order?.returnable || order.returnRequest) return current
      const id = `RT-${String(Date.now()).slice(-6)}`
      return { ...current, [orderId]: { ...order, status: requested, returnRequest: { id, ...request } } }
    })
    setOrders((current) => current.map((order) => (order.id === `#${orderId}`
      ? { ...order, status: requested, filter: 'returns' }
      : order)))
  }, [])

  const saveAddress = useCallback((address) => {
    setAddresses((items) => {
      const exists = items.some((item) => item.id === address.id)
      const makeDefault = address.isDefault || items.length === 0 || (items.length === 1 && exists)
      const next = exists
        ? items.map((item) => (item.id === address.id ? address : item))
        : [...items, { ...address, id: `addr-${Date.now()}` }]
      const defaultId = makeDefault ? (exists ? address.id : next[next.length - 1].id) : null
      return next.map((item) => ({ ...item, isDefault: defaultId ? item.id === defaultId : item.isDefault }))
    })
  }, [])

  const removeAddress = useCallback((id) => {
    setAddresses((items) => {
      const next = items.filter((item) => item.id !== id)
      return next.length && !next.some((item) => item.isDefault) ? next.map((item, index) => ({ ...item, isDefault: index === 0 })) : next
    })
  }, [])

  const setDefaultAddress = useCallback((id) => {
    setAddresses((items) => items.map((item) => ({ ...item, isDefault: item.id === id })))
  }, [])

  // Cards hold display data only (brand, last 4, expiry, holder). Never keep the full number or CVV.
  const addCard = useCallback((card) => {
    setCards((items) => {
      const makeDefault = card.isDefault || items.length === 0
      const next = [...items, { ...card, id: `card-${Date.now()}`, isDefault: false }]
      return next.map((item, index) => ({ ...item, isDefault: makeDefault ? index === next.length - 1 : item.isDefault }))
    })
  }, [])

  const removeCard = useCallback((id) => {
    setCards((items) => {
      const next = items.filter((item) => item.id !== id)
      return next.length && !next.some((item) => item.isDefault) ? next.map((item, index) => ({ ...item, isDefault: index === 0 })) : next
    })
  }, [])

  const setDefaultCard = useCallback((id) => {
    setCards((items) => items.map((item) => ({ ...item, isDefault: item.id === id })))
  }, [])

  const updateProfile = useCallback((values) => setProfile((current) => ({ ...current, ...values })), [])
  const setTwoStep = useCallback((twoStep) => setSecurity((current) => ({ ...current, twoStep })), [])
  const markPasswordChanged = useCallback(() => setSecurity((current) => ({ ...current, passwordChangedAt: new Date().toISOString() })), [])
  const revokeDevice = useCallback((id) => setDevices((items) => items.filter((item) => item.id !== id)), [])
  const setNotification = useCallback((key, value) => setNotifications((current) => ({ ...current, [key]: value })), [])

  // Repair quote: approving moves the repair to "Repairing"; declining ends it with no charge.
  const approveRepair = useCallback(() => setActiveRepair((repair) => ({
    ...repair,
    status: { label: 'Repair in progress', tone: 'blue' },
    currentStep: 3,
    quote: { ...repair.quote, decision: 'approved', title: `Quote approved: ${repair.quote.title.replace(/^Quote ready:\s*/, '')}`, note: 'Our technician has started. We’ll message you as soon as it’s ready for pickup.' },
  })), [])
  const declineRepair = useCallback(() => setActiveRepair((repair) => ({
    ...repair,
    status: { label: 'Quote declined', tone: 'grey' },
    quote: { ...repair.quote, decision: 'declined', title: 'Quote declined · no charge', note: 'Collect your device from the store any time during opening hours.' },
  })), [])

  const updateOrder = (orderId, patch, listPatch) => {
    setOrderDetails((current) => ({ ...current, [orderId]: { ...current[orderId], ...patch } }))
    if (listPatch) setOrders((current) => current.map((order) => (order.id === `#${orderId}` ? { ...order, ...listPatch } : order)))
  }
  const cancelOrder = useCallback((orderId) => updateOrder(orderId,
    { status: { label: 'Cancelled', tone: 'grey' }, cancelled: true, arriving: 'Order cancelled · refund on its way (3–5 working days)' },
    { status: { label: 'Cancelled', tone: 'grey' }, meta: 'Cancelled today', filter: 'delivered', action: { label: 'View details', variant: 'outline-teal', to: `/account/orders/${orderId}` } }), [])
  const rescheduleTradeIn = useCallback((id, slotLabel) => setTradeIns((items) => items.map((item) => (item.id === id
    ? { ...item, title: item.title.replace(/Inspection booked .*/, `Inspection booked ${slotLabel}`) }
    : item))), [])
  const changeDeliverySlot = useCallback((orderId, slotLabel) => updateOrder(orderId, {
    arriving: `Arriving ${slotLabel}`,
  }), [])

  const value = useMemo(
    () => ({
      savedItems, reservations, addresses, cards, invoices, profile, security, devices, notifications,
      orders, orderDetails, activeRepair, pastRepairs, tradeIns, tradeInCredit,
      removeSavedItem, extendReservation, cancelReservation, submitReturn, saveAddress, removeAddress, setDefaultAddress,
      addCard, removeCard, setDefaultCard, updateProfile, setTwoStep, markPasswordChanged, revokeDevice, setNotification,
      approveRepair, declineRepair, cancelOrder, changeDeliverySlot, rescheduleTradeIn,
    }),
    [
      savedItems, reservations, addresses, cards, invoices, profile, security, devices, notifications,
      orders, orderDetails, activeRepair, pastRepairs, tradeIns, tradeInCredit,
      removeSavedItem, extendReservation, cancelReservation, submitReturn, saveAddress, removeAddress, setDefaultAddress,
      addCard, removeCard, setDefaultCard, updateProfile, setTwoStep, markPasswordChanged, revokeDevice, setNotification,
      approveRepair, declineRepair, cancelOrder, changeDeliverySlot, rescheduleTradeIn,
    ]
  )

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
}

export function useAccount() {
  const context = useContext(AccountContext)

  if (!context) {
    throw new Error('useAccount must be used inside AccountProvider')
  }

  return context
}
