// Store contact details and social profiles used across the site (footer, store cards, invoices).
// TODO before launch: replace the social URLs with GEN-I's real profile links.
export const STORE = {
  name: 'Trivium Zayed Branch',
  address: 'Trivium Square, Sheikh Zayed City, Giza, Egypt',
  hours: 'Open today · 10 AM – 11 PM',
}

export const directionsUrl = (place = `${STORE.name}, ${STORE.address}`) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place)}`

export const SOCIAL_LINKS = {
  Facebook: 'https://www.facebook.com/',
  Instagram: 'https://www.instagram.com/',
  LinkedIn: 'https://www.linkedin.com/',
  WhatsApp: 'https://wa.me/',
}
