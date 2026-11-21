export const digitsOnly = (value) => value.replace(/\D/g, '')

export function formatCardNumber(value) {
  return digitsOnly(value).slice(0, 19).replace(/(.{4})/g, '$1 ').trim()
}

export function formatExpiry(value) {
  const digits = digitsOnly(value).slice(0, 4)
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits
}

export function cardBrand(number) {
  const digits = digitsOnly(number)
  if (/^4/.test(digits)) return 'VISA'
  if (/^(5[1-5]|2[2-7])/.test(digits)) return 'MASTERCARD'
  if (/^3[47]/.test(digits)) return 'AMEX'
  if (/^(5078|6304|67)/.test(digits)) return 'MAESTRO'
  return 'CARD'
}

// Standard Luhn checksum.
function passesLuhn(digits) {
  let sum = 0
  for (let i = 0; i < digits.length; i += 1) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

export function validateCardNumber(value) {
  const digits = digitsOnly(value)
  if (!digits) return 'Enter the card number.'
  return digits.length >= 13 && digits.length <= 19 && passesLuhn(digits) ? '' : 'Enter a valid card number.'
}

export function validateExpiry(value) {
  if (!value) return 'Enter the expiry date.'
  const match = /^(\d{2})\/(\d{2})$/.exec(value)
  if (!match) return 'Use the format MM/YY.'
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return 'Enter a valid month.'
  const now = new Date()
  const expired = year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)
  return expired ? 'This card has expired.' : ''
}

export function validateCvv(value, brand) {
  if (!value) return 'Enter the CVV.'
  const length = brand === 'AMEX' ? 4 : 3
  return digitsOnly(value).length === length ? '' : `CVV must be ${length} digits.`
}
