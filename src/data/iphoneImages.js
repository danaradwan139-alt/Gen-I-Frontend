// Fallback phone images for product cards, matched by product name or id.
// Files live in public/assets/.
const base = '/assets/'

const byKey = {
  'iphone 16': 'iphone-16.png',
  'iphone air': 'iphone-air.png',
  'iphone 18 pro max': 'iphone-18-pro-max.png',
  'iphone 18 pro': 'iphone-18-pro.png',
  'iphone 17e': 'iphone-17e.png',
  // 'iphone 17': 'iphone-17.png',   // add the image, then uncomment
}

const norm = (s = '') => s.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim()

export function getIphoneImage(product) {
  const file = byKey[norm(product.name)] || byKey[norm(product.id)]
  return file ? base + file : null
}
