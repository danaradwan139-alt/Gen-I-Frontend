import { quoteTotals } from '@/context/BusinessContext'
import { downloadInvoices } from '@/utils/invoicePdf'

export const egp = (n) => `EGP ${Math.round(n).toLocaleString('en-US')}`

export const quoteSummary = (q) => `${q.pieces} items · ${q.locations} location${q.locations === 1 ? '' : 's'}`

// Quotation PDF (same branded layout as invoices)
export function downloadQuotePdf(quote, company, locations) {
  const hq = locations.find((l) => l.isDefault) ?? locations[0]
  const { total } = quoteTotals(quote)
  downloadInvoices([{
    docTitle: quote.status === 'accepted' ? 'ACCEPTED QUOTE' : 'QUOTATION',
    id: `${quote.quoteNo ?? quote.id}${quote.version ? ` v${quote.version}` : ''}`,
    dateLabel: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    reference: quote.id,
    amount: quote.acceptedTotal ?? total,
    status: quote.status === 'accepted' ? 'Accepted' : `Valid until ${quote.validUntil ?? '-'}`,
    totalLabel: quote.status === 'accepted' ? 'ACCEPTED TOTAL' : 'QUOTE TOTAL',
    items: (quote.lines ?? []).map((l) => ({ name: l.name, spec: '', qty: l.qty, unitPrice: l.unitPrice * 1.14 })),
    billTo: [company.name, hq && `${hq.street}, ${hq.area}`, hq && hq.governorate, company.phone].filter(Boolean),
    payment: quote.terms?.find(([k]) => k === 'Payment')?.[1] ?? 'Bank transfer before delivery',
    notes: (quote.terms ?? []).slice(1).map(([k, v]) => `${k}: ${v}`).concat('Prices include 14% VAT.').slice(0, 4),
  }], `${quote.quoteNo ?? quote.id}.pdf`)
}
