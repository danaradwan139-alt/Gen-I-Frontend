// SAMPLE account data used until the account API is connected.
// Replace the seeds in context/AccountContext.jsx with API calls; the shapes below are what the pages expect.
import { assets as A } from '@/assets/assets'

const at = (dayOffset, hours, minutes = 0) => {
  const date = new Date()
  date.setDate(date.getDate() + dayOffset)
  date.setHours(hours, minutes, 0, 0)
  return date.toISOString()
}

export const governorates = [
  'Cairo', 'Giza', 'Alexandria', 'Qalyubia', 'Sharqia', 'Dakahlia', 'Gharbia', 'Monufia', 'Beheira', 'Kafr El Sheikh',
  'Damietta', 'Port Said', 'Ismailia', 'Suez', 'North Sinai', 'South Sinai', 'Fayoum', 'Beni Suef', 'Minya', 'Assiut',
  'Sohag', 'Qena', 'Luxor', 'Aswan', 'Red Sea', 'New Valley', 'Matrouh',
]

const areasByGovernorate = {
  Cairo: ['Zamalek', 'Maadi', 'Nasr City', 'Heliopolis', 'New Cairo', 'Downtown', 'Mokattam', 'Shorouk'],
  Giza: ['Sheikh Zayed', '6th of October', 'Dokki', 'Mohandessin', 'Agouza', 'Haram', 'Faisal'],
  Alexandria: ['Smouha', 'Sidi Gaber', 'Stanley', 'Montaza', 'Miami', 'Agami'],
}

export const getAreas = (governorate) => areasByGovernorate[governorate] ?? ['Other']

export const initialSavedItems = [
  { productId: 'iphone-18-pro', variantId: '128-black' },
  { productId: 'iphone-16', variantId: '256-teal' },
  { productId: 'iphone-air', variantId: '128-black' },
  { productId: 'iphone-18-pro-max', variantId: '128-black' },
]

export const initialReservations = [
  {
    id: 'RS-5520',
    status: 'active',
    productId: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    variantLabel: '256GB · Natural Titanium',
    price: 64999,
    paymentNote: 'Pay in store',
    store: 'Trivium Zayed Branch, Sheikh Zayed',
    reservedAt: at(0, 11, 20),
    heldUntil: at(1, 23),
  },
]

export const initialAddresses = [
  { id: 'addr-1', type: 'Home', fullName: 'Mohamed Ahmed', mobile: '+20 100 000 0000', governorate: 'Cairo', area: 'Zamalek', street: '12 Nile St', floor: 'Apt 4', landmark: '', isDefault: true },
  { id: 'addr-2', type: 'Work', fullName: 'Mohamed Ahmed', mobile: '+20 100 000 0000', governorate: 'Cairo', area: 'Zamalek', street: '12 Nile St', floor: 'Apt 4', landmark: '', isDefault: false },
]

const daysAgo = (days) => new Date(Date.now() - days * 86400000).toISOString()

export const initialCards = [
  { id: 'card-1', brand: 'VISA', last4: '4242', holder: 'Mohamed Ahmed', expiry: '08/28', isDefault: true },
  { id: 'card-2', brand: 'VISA', last4: '4242', holder: 'Mohamed Ahmed', expiry: '08/28', isDefault: false },
]

export const initialInvoices = [
  { id: 'INV-INST-03', kind: 'order', date: new Date().toISOString(), reference: 'Order #GN-260142', amount: 66998, status: 'Paid' },
  { id: 'INV-INST-02', kind: 'order', date: '2026-10-31T10:00:00.000Z', reference: 'Order #GN-260142', amount: 66998, status: 'Paid' },
]

export const initialDevices = [
  { id: 'dev-1', name: 'iPhone 15 Pro', detail: 'Cairo, Egypt · This device', current: true },
  { id: 'dev-2', name: 'MacBook Air', detail: 'Cairo, Egypt · Active 2 days ago', current: false },
  { id: 'dev-3', name: 'iPad Air', detail: 'Giza, Egypt · Active 3 weeks ago', current: false },
  { id: 'dev-4', name: 'Windows PC', detail: 'Cairo, Egypt · Active 2 months ago', current: false },
]

export const initialNotifications = {
  orders: true,
  repairs: false,
  offers: true,
  whatsapp: true,
}

export const initialSecurity = { twoStep: true, passwordChangedAt: daysAgo(95) }

export const languages = ['English', 'Arabic']

// ---- Orders, repairs and trade-ins --------------------------------------------------------------
// `tone` picks the status badge colour (blue | green); `filter` is the tab a row appears under.
// Button `variant`s are the Button variants from components/ui/Button.jsx.

export const initialOrders = [
  {
    id: '#GN-260142',
    meta: 'Placed today',
    status: { label: 'Preparing', tone: 'blue' },
    filter: 'in-progress',
    image: A.accountIphoneBack,
    title: 'iPhone 18 Pro · MagSafe clear case',
    total: 'Total 66,998 EGP',
    action: { label: 'Track order', variant: 'primary', to: '/account/orders/GN-260142' },
  },
  {
    id: '#GN-259604',
    meta: 'Placed 12 Nov 2026 · Delivered 15 Nov',
    status: { label: 'Delivered', tone: 'green' },
    filter: 'delivered',
    image: A.accountIphoneBack,
    title: 'iPhone 18 Pro Max · Wireless earbuds',
    total: 'Total 83,998 EGP',
    action: { label: 'View details', variant: 'primary', to: '/account/orders/GN-259604' },
  },
  {
    id: '#GN-259871',
    meta: 'Placed 31 Oct 2026',
    status: { label: 'Delivered', tone: 'green' },
    filter: 'delivered',
    image: A.accountAirpods,
    title: 'AirPods-style wireless earbuds',
    total: 'Total 8,999 EGP',
    action: { label: 'Buy again', variant: 'outline-teal' },
  },
  {
    id: '#RP-10433',
    meta: 'Repair 2 Aug 2026',
    status: { label: 'Delivered', tone: 'green' },
    filter: 'delivered',
    image: A.accountIphoneFront,
    title: 'Screen replacement · iPhone 15',
    total: 'Total 4,500 EGP',
    action: { label: 'View invoice', variant: 'outline-teal' },
  },
]

// Order details & tracking, keyed by the order number used in the URL (/account/orders/:orderId).
export const initialOrderDetails = {
  'GN-260142': {
    id: '#GN-260142',
    status: { label: 'Preparing', tone: 'blue' },
    placed: 'Placed today, 4:12 PM',
    arriving: 'Arriving tomorrow, 10 AM – 2 PM',
    currentStep: 2,
    steps: [
      { label: 'Order placed', note: 'Today 4:12 PM' },
      { label: 'Preparing', note: 'Packing your items' },
      { label: 'Out for delivery', note: 'Tomorrow' },
      { label: 'Delivered', note: '10 AM – 2 PM' },
    ],
    items: [
      { name: 'iPhone 18 Pro', spec: '256GB · Natural Titanium · Qty 1', price: '64,999 EGP', image: A.accountIphoneBox },
      { name: 'MagSafe clear case', spec: 'For iPhone 18 Pro · Qty 1', price: '1,999 EGP', image: A.accountIphoneBack },
    ],
    delivery: [
      'Mohamed Ahmed · +20 100 000 0000',
      '12 Nile St, Zamalek, Cairo',
      'Courier: GEN-I Express · Tracking no. GX-88213',
    ],
    payment: { subtotal: '66,998 EGP', delivery: 'Free', total: '66,998 EGP', method: 'Paid with Visa •••• 4242' },
  },
  // A delivered order: every step is complete, and `returnable` switches on "Start a return".
  'GN-259604': {
    id: '#GN-259604',
    status: { label: 'Delivered', tone: 'green' },
    placed: 'Placed 12 Nov 2026, 2:40 PM',
    arriving: 'Delivered 15 Nov 2026, 11:20 AM',
    completed: true,
    currentStep: 4,
    steps: [
      { label: 'Order placed', note: '12 Nov, 2:40 PM' },
      { label: 'Preparing', note: 'Packed 13 Nov' },
      { label: 'Out for delivery', note: '15 Nov, 9:05 AM' },
      { label: 'Delivered', note: '15 Nov, 11:20 AM' },
    ],
    items: [
      { id: 'iphone-18-pro-max', name: 'iPhone 18 Pro Max', spec: '256GB · Desert Titanium · Qty 1', price: '74,999 EGP', image: A.accountIphoneBack },
      { id: 'wireless-earbuds', name: 'AirPods-style wireless earbuds', spec: 'White · Qty 1', price: '8,999 EGP', image: A.accountAirpods },
    ],
    delivery: [
      'Mohamed Ahmed · +20 100 000 0000',
      '12 Nile St, Zamalek, Cairo',
      'Delivered by GEN-I Express · Tracking no. GX-87940',
    ],
    payment: { subtotal: '83,998 EGP', delivery: 'Free', total: '83,998 EGP', method: 'Paid with Visa •••• 4242' },
    returnable: { until: '29 Nov 2026' },
  },
}

export const initialActiveRepair = {
  id: '#RP-10587',
  meta: 'Booked today · Trivium Zayed Branch',
  status: { label: 'Waiting for your approval', tone: 'blue' },
  image: A.accountIphoneBack,
  device: 'iPhone 18 Pro',
  spec: '256GB · Natural Titanium',
  currentStep: 2,
  steps: [
    { label: 'Booked', note: 'Today 1:00 PM' },
    { label: 'Diagnosed', note: 'Screen + frame check' },
    { label: 'Repairing', note: '~45 min' },
    { label: 'Ready for pickup', note: 'Same day' },
  ],
  quote: {
    title: 'Quote ready: 4,500 EGP',
    note: 'Includes genuine-quality screen, labour and 6-month warranty.',
  },
}

export const initialPastRepairs = [
  {
    id: '#RP-09812',
    date: '14 Mar 2026',
    image: A.accountIphoneBack,
    summary: 'Battery replacement · iPhone 13 · Warranty until Feb 2027',
    status: { label: 'Completed', tone: 'green' },
  },
  {
    id: '#RP-09540',
    date: '14 Mar 2026',
    image: A.accountIphoneBack,
    summary: 'Battery replacement · iPhone 13 · Warranty until Feb 2027',
    status: { label: 'Completed', tone: 'green' },
  },
]

export const initialTradeInCredit = {
  label: 'Trade-in credit available',
  amount: '12,000 EGP',
  note: 'Use it on any order before 31 Jan 2027.',
}

export const initialTradeIns = [
  {
    id: '#TI-3021',
    meta: 'iPhone 15 Pro · 256GB',
    status: { label: 'Inspection booked', tone: 'blue' },
    filter: 'in-progress',
    image: A.accountIphoneBack,
    title: 'Good condition · Inspection booked tomorrow, Trivium Zayed',
    total: 'Up to 18,500 EGP',
    action: { label: 'Reschedule', variant: 'outline-teal' },
  },
  {
    id: '#TI-2987',
    meta: 'iPhone 13 · 128GB',
    status: { label: 'Approved', tone: 'green' },
    filter: 'completed',
    image: A.accountIphoneBack,
    title: 'Fair condition · Inspected 4 Oct 2026',
    total: '12,000 EGP',
    action: { label: 'View details', variant: 'outline-teal' },
  },
]

// "Start a return" form options.
export const returnReasons = [
  { id: 'changed-mind', label: 'Changed my mind' },
  { id: 'faulty', label: 'Item is faulty or damaged' },
  { id: 'not-as-described', label: 'Not as described' },
  { id: 'wrong-item', label: 'Received the wrong item' },
]

export const returnRefunds = [
  { id: 'refund-card', label: 'Refund to Visa •••• 4242', note: '3–5 business days' },
  { id: 'drop-off', label: 'Drop off at a store', note: 'Free · any GEN-I branch' },
]
