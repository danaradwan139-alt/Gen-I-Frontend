import { products, formatPrice } from '@/data/products'

// GEN-I assistant replies, worked out from the product catalog in src/data/products.js.
// It runs in the browser with no AI service: replace `getReply` with a call to your backend
// later and the chat UI keeps working, as long as you return the same message shape:
// { text, chips?, products?, compare?, repair?, action? }

export const WELCOME = {
  role: 'assistant',
  text: "Hi! 👋 I'm GEN-I assistant. Tell me what you need — I can compare products, check stock at our stores, or book an iPhone repair.",
  chips: ['Compare iPhones', 'Laptop for university', 'TV for a small room', 'My screen is cracked', 'Trade-in value'],
}

const fromPrice = (p) => Math.min(...p.variants.map((v) => v.price))
const stockOf = (p) => p.variants.reduce((t, v) => t + v.stock, 0)
const byCategory = (c) => products.filter((p) => p.category === c && p.variants?.length)
const has = (text, ...words) => words.some((w) => text.includes(w))

function priceLimit(text) {
  const m = text.replace(/,/g, '').match(/(?:under|below|less than|max|budget|<)\s*(\d{3,7})(k)?/)
  if (!m) return null
  return Number(m[1]) * (m[2] ? 1000 : 1)
}

function mentionedProducts(text) {
  return products
    .filter((p) => text.includes(p.name.toLowerCase()))
    .sort((a, b) => b.name.length - a.name.length)
}

function listReply(intro, list, chips, action) {
  if (list.length === 0) {
    return {
      text: `${intro} I couldn't find any in our current catalog, but the team can check what's coming in.`,
      chips: ['Show all products', 'Talk about something else'],
      action: { label: 'Browse the store', to: '/shop' },
    }
  }
  return { text: intro, products: list.slice(0, 4), chips, action }
}

export function getReply(input, context = {}) {
  const text = input.toLowerCase().trim()
  const limit = priceLimit(text)
  const named = mentionedProducts(text)

  // Follow-up to "which iPhone needs repair?"
  if (context.awaiting === 'repair-model') {
    const service = context.service || 'Screen replacement'
    return {
      text: "Got it. Here's what to expect — you can pick a store and time in the next step.",
      repair: {
        title: `${service} · ${input}`,
        points: ['Free diagnosis before you pay', 'Price confirmed after diagnosis', 'Repair time confirmed by the repair team'],
        to: `/repair?service=${encodeURIComponent(service)}`,
      },
      context: {},
    }
  }

  if (has(text, 'hi', 'hello', 'hey', 'salam', 'مرحبا') && text.length < 12) return { ...WELCOME, role: undefined }

  if (has(text, 'all products', 'browse', 'something else', 'start over')) {
    return { text: 'Sure — what are you shopping for today?', chips: WELCOME.chips, action: { label: 'Browse the store', to: '/shop' } }
  }

  if (has(text, 'crack', 'screen', 'broken', 'repair', 'fix', 'battery')) {
    const service = has(text, 'battery') ? 'Battery replacement' : has(text, 'camera') ? 'Camera repair' : has(text, 'port', 'charg') ? 'Charging port' : 'Screen replacement'
    return {
      text: `Sorry to hear that. I can help you book a ${service.toLowerCase()}. Which iPhone do you have?`,
      chips: ['iPhone Pro', 'iPhone Air', 'iPhone 16', 'Other model'],
      context: { awaiting: 'repair-model', service },
    }
  }

  if (has(text, 'trade')) {
    return {
      text: 'You can trade in your current phone for credit toward a new one. The value depends on the model and its condition, so our team gives you the exact amount when they check it — in store or when we collect it.',
      chips: ['Compare iPhones', 'Find a store'],
      action: { label: 'See how trade-in works', to: '/#trade-in' },
    }
  }

  if (has(text, 'business', 'bulk', 'company', 'quote')) {
    return {
      text: 'For 10 units or more you get business pricing, official tax invoices and delivery to all your branches. You can start a quote request now.',
      action: { label: 'Request a business quote', to: '/business/checkout' },
    }
  }

  if (has(text, 'stock', 'near me', 'store', 'available', 'availability', 'find a store')) {
    const target = named[0] || context.lastProduct && products.find((p) => p.id === context.lastProduct)
    if (target) {
      const lines = target.variants.map((v) => `${v.label}: ${v.stock > 0 ? `${v.stock} in stock at ${v.store}` : 'out of stock'}`)
      return { text: `${target.name}\n${lines.join('\n')}`, products: [target], chips: ['Show prices', 'Compare iPhones'] }
    }
    return { text: 'Which product should I check? Tell me the model, e.g. “iPhone 16”.', chips: byCategory('iPhone').slice(0, 3).map((p) => p.name) }
  }

  if (named.length >= 2 || has(text, 'compare', ' vs ', 'versus', 'difference', 'better')) {
    const pair = named.length >= 2 ? named.slice(0, 2) : byCategory('iPhone').slice(0, 2)
    if (pair.length === 2) {
      return {
        text: `Here are ${pair[0].name} and ${pair[1].name} side by side. Open the full comparison to see camera, display, chip and battery details.`,
        compare: pair,
        chips: ['Check stock near me', 'Show prices'],
        action: { label: 'Open full comparison ↗', to: '/compare' },
        context: { lastProduct: pair[0].id },
      }
    }
  }

  if (has(text, 'price', 'cost', 'how much', 'cheap') || limit) {
    const pool = named.length ? named : products.filter((p) => p.variants?.length)
    const list = pool.filter((p) => !limit || fromPrice(p) <= limit).sort((a, b) => fromPrice(a) - fromPrice(b))
    return listReply(
      limit ? `Here's what we have under ${formatPrice(limit)}, cheapest first:` : 'Here are current starting prices, cheapest first:',
      list,
      ['Check stock near me', 'Compare iPhones']
    )
  }

  if (has(text, 'laptop', 'macbook', 'university', 'student', 'computer')) {
    return listReply('Good laptops for studying from our catalog:', byCategory('Laptops'), ['Show prices', 'Check stock near me'], { label: 'See all laptops', to: '/shop?category=Laptops' })
  }
  if (has(text, 'tv', 'television', 'room', 'screen size')) {
    return listReply('For a small room, a 43–55" screen usually works best. Here’s what we have:', byCategory('TV & Home'), ['Show prices'], { label: 'See all TV & Home', to: '/shop?category=TV%20%26%20Home' })
  }
  if (has(text, 'watch')) return listReply('Our Apple Watch range:', byCategory('Apple Watch'), ['Show prices'], { label: 'See all watches', to: '/shop?category=Apple%20Watch' })
  if (has(text, 'appliance', 'washer', 'fridge', 'vacuum', 'clean')) return listReply('Home appliances in stock:', byCategory('Home Appliances'), ['Show prices'], { label: 'See all appliances', to: '/shop?category=Home%20Appliances' })
  if (has(text, 'case', 'charger', 'earbud', 'airpods', 'accessor', 'audio', 'headphone')) return listReply('Accessories that go well with your devices:', byCategory('Accessories'), ['Show prices'], { label: 'See all accessories', to: '/shop?category=Accessories' })

  if (has(text, 'photo', 'camera', 'iphone', 'phone')) {
    const list = byCategory('iPhone').sort((a, b) => stockOf(b) - stockOf(a))
    return { ...listReply('Here are the iPhones we have right now. For photos, the Pro models have the most advanced cameras.', list, ['Compare iPhones', 'Show prices'], { label: 'Shop all iPhones', to: '/shop?category=iPhone' }), context: { lastProduct: list[0]?.id } }
  }

  if (named.length === 1) {
    const p = named[0]
    return {
      text: `${p.name} starts at ${formatPrice(fromPrice(p))} and is ${stockOf(p) > 0 ? 'in stock' : 'currently out of stock'}. ${p.description || ''}`.trim(),
      products: [p],
      chips: ['Check stock near me', 'Compare iPhones'],
      context: { lastProduct: p.id },
    }
  }

  return {
    text: "I'm not sure I got that. I can compare products, show prices and stock, or help book a repair. You can also search the store directly.",
    chips: WELCOME.chips.slice(0, 3),
    action: { label: `Search for “${input.slice(0, 30)}”`, to: `/shop?q=${encodeURIComponent(input)}` },
  }
}
