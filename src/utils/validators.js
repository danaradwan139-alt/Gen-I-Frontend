export const MIN_PASSWORD_LENGTH = 8

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const MOBILE_PATTERN = /^\+?\d{8,15}$/

export function validateIdentifier(value) {
  const trimmed = value.trim()
  if (!trimmed) return 'Enter your email or mobile number.'
  const digitsOnly = trimmed.replace(/[\s()-]/g, '')
  if (EMAIL_PATTERN.test(trimmed) || MOBILE_PATTERN.test(digitsOnly)) return ''
  return 'Enter a valid email address or mobile number.'
}

export function validatePassword(value, { enforceLength = false } = {}) {
  if (!value) return 'Enter your password.'
  if (enforceLength && value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
  }
  return ''
}

export function validateConfirmPassword(value, password) {
  if (!value) return 'Confirm your password.'
  if (value !== password) return 'Passwords do not match.'
  return ''
}

export function validateRequired(value, message) {
  return value.trim() ? '' : message
}

export function validateMobile(value) {
  const digitsOnly = value.trim().replace(/[\s()-]/g, '')
  if (!digitsOnly) return 'Enter your mobile number.'
  return MOBILE_PATTERN.test(digitsOnly) ? '' : 'Enter a valid mobile number.'
}

export function validateEmail(value) {
  if (!value.trim()) return 'Enter your email address.'
  return EMAIL_PATTERN.test(value.trim()) ? '' : 'Enter a valid email address.'
}

// Date of birth typed as "DD / MM / YYYY".
export function parseBirthDate(value) {
  const match = /^(\d{2}) \/ (\d{2}) \/ (\d{4})$/.exec(value)
  if (!match) return null
  const [, day, month, year] = match.map(Number)
  const date = new Date(year, month - 1, day)
  const valid = date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
  return valid ? date : null
}

export function validateBirthDate(value) {
  if (!value) return 'Enter your date of birth.'
  const date = parseBirthDate(value)
  if (!date) return 'Use the format DD / MM / YYYY.'
  return date > new Date() || date.getFullYear() < 1900 ? 'Enter a valid date of birth.' : ''
}

export function formatBirthDateInput(value) {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join(' / ')
}
