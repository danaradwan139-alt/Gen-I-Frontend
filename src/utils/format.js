const time = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
const shortDate = new Intl.DateTimeFormat('en-US', { weekday: 'short', day: 'numeric', month: 'short' })

function dayLabel(date) {
  const startOfDay = (value) => new Date(value.getFullYear(), value.getMonth(), value.getDate())
  const diff = Math.round((startOfDay(date) - startOfDay(new Date())) / 86400000)
  if (diff === 0) return 'today'
  if (diff === 1) return 'tomorrow'
  if (diff === -1) return 'yesterday'
  return shortDate.format(date)
}

// "today, 11:20 AM" or "tomorrow, 11 PM" (minutes are dropped on the hour).
export function formatDayTime(value) {
  const date = new Date(value)
  const clock = date.getMinutes() === 0 ? time.format(date).replace(':00', '') : time.format(date)
  return `${dayLabel(date)}, ${clock}`
}

export const formatEgp = (amount) => `${new Intl.NumberFormat('en-US').format(amount)} EGP`

export function formatDate(value) {
  const date = new Date(value)
  const today = new Date()
  if (date.toDateString() === today.toDateString()) return 'Today'
  return new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(date)
}

// "today", "12 days ago", "3 months ago"
export function formatAgo(value) {
  const days = Math.floor((Date.now() - new Date(value).getTime()) / 86400000)
  if (days < 1) return 'today'
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  const months = Math.floor(days / 30)
  return `${months} month${months === 1 ? '' : 's'} ago`
}
