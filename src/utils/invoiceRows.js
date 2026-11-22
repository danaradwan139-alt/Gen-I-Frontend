// Turns account data into rows for the invoice PDF (utils/invoicePdf.js).

const parseEgp = (text) => Number(String(text).replace(/[^\d.]/g, '')) || 0
const longDate = (value) => new Date(value).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

const billToFromAddress = (addresses) => {
  const address = addresses.find((a) => a.isDefault) ?? addresses[0]
  return address
    ? [address.fullName, [address.street, address.floor].filter(Boolean).join(', '), `${address.area}, ${address.governorate}`, address.mobile]
    : []
}

// An invoice from the Invoices page (linked to an order by its reference "Order #GN-…")
export function invoiceRow(invoice, { orderDetails, addresses }) {
  const orderId = invoice.reference.match(/#?([A-Z]{2}-\d+)/)?.[1]
  const order = orderId ? orderDetails[orderId] : undefined
  return { ...orderRow(order, addresses), id: invoice.id, dateLabel: longDate(invoice.date), reference: invoice.reference, amount: invoice.amount, status: invoice.status }
}

// An order's own invoice (Order details page)
export function orderRow(order, addresses, date = new Date()) {
  const items = order?.items?.map((item) => {
    const qty = Number(item.spec?.match(/Qty\s*(\d+)/i)?.[1]) || 1
    return { name: item.name, spec: item.spec?.replace(/\s*·\s*Qty\s*\d+/i, ''), qty, unitPrice: parseEgp(item.price) / qty }
  })
  const billTo = order?.delivery?.length
    ? [order.delivery[0].split(' · ')[0], order.delivery[1], order.delivery[0].split(' · ')[1]].filter(Boolean)
    : billToFromAddress(addresses)
  const id = order?.id?.replace('#', '') ?? ''
  return {
    id: `INV-${id}`,
    dateLabel: longDate(date),
    reference: `Order ${order?.id ?? ''}`,
    amount: parseEgp(order?.payment?.total),
    status: order?.cancelled ? 'Refunded' : 'Paid',
    items,
    billTo,
    payment: order?.payment?.method,
    delivery: order?.payment?.delivery && order.payment.delivery !== 'Free' ? parseEgp(order.payment.delivery) : 0,
  }
}

// A repair invoice (Repairs page "View invoice", Orders list repair row)
export function repairRow({ id, amount, service, device, date }, addresses) {
  return {
    id: `INV-${id.replace('#', '')}`,
    dateLabel: longDate(date ?? Date.now()),
    reference: `Repair ${id}`,
    amount,
    status: 'Paid',
    items: [{ name: service, spec: `${device} · genuine-quality parts · 6-month warranty`, qty: 1, unitPrice: amount }],
    billTo: billToFromAddress(addresses),
    payment: 'Paid in store',
  }
}
