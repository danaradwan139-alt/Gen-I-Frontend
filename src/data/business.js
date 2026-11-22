// Sample data for the GEN-I Business account (Figma "04 Overview" … "04.5 Company Profile").
// Replace with the business API once it exists.

export const initialCompany = {
  name: 'Nile Logistics',
  email: 'procurement@nilelogistics.com',
  phone: '+20 2 2735 0000',
  registration: 'CR-104582',
  country: 'Egypt',
  type: 'Logistics & transport',
}

export const businessCountries = ['Egypt', 'Saudi Arabia', 'United Arab Emirates', 'Kuwait', 'Qatar', 'Jordan']

export const initialBusinessNotifications = {
  quotations: true,
  approvals: true,
  offers: false,
}

export const initialLocations = [
  { id: 'loc-1', type: 'Smart Village HQ', fullName: 'Nile Logistics', mobile: '+20 100 000 0000', governorate: 'Giza', area: 'Smart Village', street: '12 Nile St', floor: 'Apt 4', landmark: '', isDefault: true },
  { id: 'loc-2', type: 'Maadi office', fullName: 'Nile Logistics', mobile: '+20 100 000 0000', governorate: 'Cairo', area: 'Maadi', street: '12 Nile St', floor: 'Apt 4', landmark: '', isDefault: false },
]

// status: review (In review) | ready (Quote ready) | action (Action needed) | accepted | expired
export const quoteStatuses = {
  review: { label: 'In review', tone: 'blue' },
  ready: { label: 'Quote ready', tone: 'orange' },
  action: { label: 'Action needed', tone: 'red' },
  accepted: { label: 'Accepted', tone: 'green' },
  expired: { label: 'Quote expired', tone: 'grey' },
}

const lines = [
  { id: 'iphone-17', name: 'iPhone 17 · 256 GB', qty: 50, unitPrice: 57500, was: { unitPrice: 59999 } },
  { id: 'samsung-qled-55', name: 'Samsung 55″ QLED 4K · QE55Q60', qty: 15, unitPrice: 31200, was: { qty: 12 } },
]

export const initialQuotes = [
  {
    id: 'RFQ-2026-0193',
    quoteNo: 'Q-2026-0193',
    status: 'ready',
    submitted: '2026-11-05',
    pieces: 65,
    locations: 2,
    version: 2,
    validUntil: 'Fri 20 Nov, 23:59',
    lines,
    changes: [
      ['iPhone 17 · unit price', 'EGP 59,999', 'EGP 57,500'],
      ['Samsung QLED · quantity', '12', '15'],
      ['Maadi delivery date', '28 Nov', '25 Nov'],
    ],
    terms: [
      ['Payment', 'Bank transfer before delivery'],
      ['Delivery', 'Maadi by 25 Nov · Smart Village by 28 Nov'],
      ['Validity', 'Until Fri 20 Nov, 23:59'],
      ['Warranty', 'Official manufacturer warranty per item'],
    ],
  },
  { id: 'RFQ-2026-0196', status: 'review', submitted: '2026-11-09', pieces: 30, locations: 1, lineCount: 2 },
  { id: 'RFQ-2026-0188', status: 'action', submitted: '2026-11-02', pieces: 30, locations: 1, version: 2, lines: [lines[1]], note: 'Samsung QLED is short in stock: please change the quantity or pick another model.' },
  { id: 'RFQ-2026-0170', quoteNo: 'Q-2026-0170', status: 'accepted', submitted: '2026-10-20', pieces: 30, locations: 1, version: 3, acceptedTotal: 1725000, lines: [{ ...lines[0], qty: 30 }] },
  { id: 'RFQ-2026-0151', status: 'expired', submitted: '2026-09-28', pieces: 30, locations: 1, lines: [{ ...lines[0], qty: 30 }] },
]

export const initialActivity = [
  { text: 'Admin issued version 2 of Q-2026-0193', when: 'Tue 10 Nov · 11:20' },
  { text: 'You requested changes on Q-2026-0193 v1', when: 'Mon 9 Nov · 18:02' },
  { text: 'Admin accepted Q-2026-0170 v3', when: '28 Oct · 10:15' },
]

export const APPROVAL_LIMIT = 1000000 // orders above this need a second approver
