import { useState } from 'react'
import { Link } from 'react-router-dom'
import { InvoicesIcon } from '@/components/account/icons'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useAccount } from '@/context/AccountContext'
import { downloadInvoices } from '@/utils/invoicePdf'
import { formatDate, formatEgp } from '@/utils/format'

const filters = [
  { id: 'all', label: 'All', empty: 'No invoices yet.' },
  { id: 'order', label: 'Orders', empty: 'No order invoices yet.' },
  { id: 'repair', label: 'Repairs', empty: 'No repair invoices yet.' },
]

const columns = ['INVOICE', 'DATE', 'FOR', 'AMOUNT', 'STATUS', 'Actions']

const parseEgp = (text) => Number(String(text).replace(/[^\d.]/g, '')) || 0

// Everything the PDF needs: line items from the matching order, who it's billed to, how it was paid.
function toPdfRow(invoice, { orderDetails, addresses }) {
  const orderId = invoice.reference.match(/#?([A-Z]{2}-\d+)/)?.[1]
  const order = orderId ? orderDetails[orderId] : undefined
  const address = addresses.find((a) => a.isDefault) ?? addresses[0]

  const items = order?.items?.map((item) => {
    const qty = Number(item.spec?.match(/Qty\s*(\d+)/i)?.[1]) || 1
    return {
      name: item.name,
      spec: item.spec?.replace(/\s*·\s*Qty\s*\d+/i, ''),
      qty,
      unitPrice: parseEgp(item.price) / qty,
    }
  })

  const billTo = order?.delivery?.length
    ? [order.delivery[0].split(' · ')[0], order.delivery[1], order.delivery[0].split(' · ')[1]].filter(Boolean)
    : address
      ? [address.fullName, [address.street, address.floor].filter(Boolean).join(', '), `${address.area}, ${address.governorate}`, address.mobile]
      : []

  return {
    id: invoice.id,
    // a real calendar date on the document (the table may say "Today")
    dateLabel: new Date(invoice.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
    reference: invoice.reference,
    amount: invoice.amount,
    status: invoice.status,
    items,
    billTo,
    payment: order?.payment?.method,
    delivery: order?.payment?.delivery && order.payment.delivery !== 'Free' ? parseEgp(order.payment.delivery) : 0,
  }
}

export default function InvoicesPage() {
  const { invoices, orderDetails, addresses } = useAccount()
  const pdfRow = (invoice) => toPdfRow(invoice, { orderDetails, addresses })
  const [filter, setFilter] = useState('all')
  const visible = invoices.filter((invoice) => filter === 'all' || invoice.kind === filter)
  const year = new Date().getFullYear()
  const thisYear = invoices.filter((invoice) => new Date(invoice.date).getFullYear() === year)

  return (
    <>
      <div className="acct-bar acct-bar-tabs">
        <div className="acct-tabs" role="group" aria-label="Invoice type">
          {filters.map(({ id, label }) => (
            <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>{label}</Chip>
          ))}
        </div>
        <Button
          variant="outline-teal" size="md" className="acct-download" disabled={thisYear.length === 0}
          onClick={() => downloadInvoices(thisYear.map(pdfRow), `gen-i-invoices-${year}.pdf`)}
        >
          Download all ({year})
        </Button>
      </div>

      {visible.length === 0 ? (
        <p className="acct-empty">{filters.find((item) => item.id === filter).empty}</p>
      ) : (
        <div className="inv-wrap">
          <table className="inv">
            <thead>
              <tr>{columns.map((column) => <th key={column} scope="col">{column}</th>)}</tr>
            </thead>
            <tbody>
              {visible.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="inv-id">{invoice.id}</td>
                  <td>{formatDate(invoice.date)}</td>
                  <td>{invoice.reference}</td>
                  <td>{formatEgp(invoice.amount)}</td>
                  <td><span className="inv-status">{invoice.status}</span></td>
                  <td>
                    <button type="button" className="inv-pdf" onClick={() => downloadInvoices([pdfRow(invoice)], `${invoice.id}.pdf`)} aria-label={`Download ${invoice.id} as PDF`}>
                      <InvoicesIcon size={16} strokeWidth={2.2} />
                      PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="inv-note">
        <Link to="/#business">Need a tax invoice in your company’s name? Switch to a GEN-I Business account.</Link>
      </p>
    </>
  )
}
