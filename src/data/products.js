import { assets as A } from '@/assets/assets'

export const categories = [
  'iPhone',
  'Apple Watch',
  'Laptops',
  'TV & Home',
  'Home Appliances',
  'Accessories',
]

const sampleUpdatedAt = '2026-11-12T18:00:00+02:00'

export const products = [
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    category: 'iPhone',
    brand: 'Apple',
    image: null,
    description: 'A powerful everyday iPhone with a vivid display and advanced camera system.',
    variants: [
      { id: '128-black', label: '128 GB · Black', storage: '128 GB', color: 'Black', price: 69000, stock: 3, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
      { id: '256-teal', label: '256 GB · Teal', storage: '256 GB', color: 'Teal', price: 76000, stock: 2, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'iphone-air',
    name: 'iPhone Air',
    category: 'iPhone',
    brand: 'Apple',
    image: null,
    description: 'A lightweight iPhone designed for everyday use.',
    variants: [
      { id: '128-black', label: '128 GB · Black', storage: '128 GB', color: 'Black', price: 69000, stock: 3, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'iphone-18-pro-max',
    name: 'iPhone 18 Pro Max',
    category: 'iPhone',
    brand: 'Apple',
    image: null,
    description: 'A large-screen iPhone with advanced camera features.',
    variants: [
      { id: '128-black', label: '128 GB · Black', storage: '128 GB', color: 'Black', price: 69000, stock: 3, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    category: 'iPhone',
    brand: 'Apple',
    image: null,
    description: 'A pro-performance iPhone with an advanced camera system.',
    variants: [
      { id: '128-black', label: '128 GB · Black', storage: '128 GB', color: 'Black', price: 69000, stock: 3, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'iphone-17e',
    name: 'iPhone 17e',
    category: 'iPhone',
    brand: 'Apple',
    image: null,
    description: 'An iPhone for everyday performance and photography.',
    variants: [
      { id: '128-black', label: '128 GB · Black', storage: '128 GB', color: 'Black', price: 69000, stock: 3, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'apple-watch-series-10',
    name: 'Apple Watch Series 10',
    category: 'Apple Watch',
    brand: 'Apple',
    image: null,
    description: 'A versatile Apple Watch with health, fitness and everyday connectivity features.',
    variants: [
      { id: '42-silver', label: '42 mm · Silver', storage: '42 mm', color: 'Silver', price: 22900, stock: 4, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
      { id: '46-jet-black', label: '46 mm · Jet Black', storage: '46 mm', color: 'Jet Black', price: 25900, stock: 1, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'macbook-air-13',
    name: 'MacBook Air 13-inch',
    category: 'Laptops',
    brand: 'Apple',
    image: null,
    description: 'A lightweight laptop for work, study and everyday creativity.',
    variants: [
      { id: '256-midnight', label: '256 GB · Midnight', storage: '256 GB', color: 'Midnight', price: 59900, stock: 2, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
      { id: '512-starlight', label: '512 GB · Starlight', storage: '512 GB', color: 'Starlight', price: 69900, stock: 0, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'samsung-qled-55',
    name: 'Samsung 55″ QLED 4K',
    category: 'TV & Home',
    brand: 'Samsung',
    image: A.phone1,
    description: 'A 55-inch 4K QLED television for a bright, detailed home viewing experience.',
    variants: [
      { id: '55-black', label: '55 inch · Black', storage: '55 inch', color: 'Black', price: 42900, stock: 2, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'lg-front-load-washer',
    name: 'LG Front-load Washer',
    category: 'Home Appliances',
    brand: 'LG',
    image: A.phone3,
    description: 'A front-load washing machine with practical cycles for everyday laundry.',
    variants: [
      { id: '9kg-white', label: '9 kg · White', storage: '9 kg', color: 'White', price: 34900, stock: 1, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
  {
    id: 'philips-hue-starter-kit',
    name: 'Philips Hue Starter Kit',
    category: 'Accessories',
    brand: 'Philips',
    image: A.phone2,
    description: 'A starter set of smart lighting designed to make connected home lighting simple.',
    variants: [
      { id: 'e27-white-color', label: 'E27 · White and color', storage: 'E27', color: 'White and color', price: 7990, stock: 5, store: 'Trivium Zayed Branch', updatedAt: sampleUpdatedAt },
    ],
  },
]

export function getCatalog() {
  return Promise.resolve(products)
}

export function formatPrice(price) {
  return `${new Intl.NumberFormat('en-EG').format(price)} EGP`
}

export function formatUpdatedAt(value) {
  return new Intl.DateTimeFormat('en-EG', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Africa/Cairo',
  }).format(new Date(value))
}
