import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/account/Breadcrumb'
import ChangeItemsModal from '@/components/business/ChangeItemsModal'
import QuoteBadge from '@/components/business/QuoteBadge'
import { downloadQuotePdf, egp, quoteSummary } from '@/components/business/quoteHelpers'
import { Button } from '@/components/ui/Button'
import { quoteTotals, useBusiness } from '@/context/BusinessContext'
import { useConfirm } from '@/context/ConfirmContext'
import { APPROVAL_LIMIT } from '@/data/business'

// Figma "04.2 Review quote": versions, what changed, line items, totals, terms; accept or request changes.
export default function ReviewQuotePage() {
  const { quoteId } = useParams()
  const { quotes, company, locations, acceptQuote, requestChanges } = useBusiness()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [version, setVersion] = useState('current')
  const [changing, setChanging] = useState(false)
  const quote = quotes.find((q) => q.id === quoteId)
  if (!quote) return <Navigate to="/business/account/quotes" replace />

  const { subtotal, vat, total } = quoteTotals(quote)
  const canDecide = quote.status === 'ready'
  const lines = version === 'current' ? quote.lines ?? [] : (quote.lines ?? []).map((l) => ({ ...l, ...l.was }))
  const shownTotals = version === 'current' ? { subtotal, vat, total } : quoteTotals({ lines })

  async function handleAccept() {
    const ok = await confirm({
      tone: 'save', icon: 'save',
      title: `Accept ${egp(total)} quote?`,
      message: `${company.name} agrees to the items, prices and terms in version ${quote.version}.`,
      confirmLabel: 'Accept quote',
      ...(total > APPROVAL_LIMIT && { secondStep: { title: 'Second approval', message: `This order is above ${egp(APPROVAL_LIMIT)}. Type APPROVE to confirm you are authorised to accept it.`, confirmLabel: 'Approve & accept', requireText: 'APPROVE' } }),
    })
    if (ok) { acceptQuote(quote.id); navigate('/business/account/quotations') }
  }

  if (!quote.lines) {
    return (
      <div className="acct-stack">
        <Breadcrumb parent={{ label: 'Quote requests', to: '/business/account/quotes' }} current={`#${quote.id}`} />
        <section className="acct-card">
          <div className="bz-card-head"><h2 className="acct-card-title">Request #{quote.id}</h2><QuoteBadge status={quote.status} /></div>
          <p className="bz-attn-sub">{quoteSummary(quote)} · submitted {new Date(quote.submitted).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}</p>
          <p>Your account manager is preparing the quote. You’ll get an email as soon as it’s ready to review.</p>
        </section>
      </div>
    )
  }

  return (
    <div className="acct-stack">
      <Breadcrumb parent={{ label: 'Quote requests', to: '/business/account/quotes' }} current={`Quote ${quote.quoteNo ?? quote.id}`} />
      <div className="bz-review-head">
        <div className="bz-review-tags">
          {quote.validUntil && canDecide && <span className="acct-status is-blue">Valid until {quote.validUntil}</span>}
          {!canDecide && <QuoteBadge status={quote.status} version={quote.version} />}
        </div>
        <button type="button" className="bz-link" onClick={() => downloadQuotePdf(quote, company, locations)}>Download PDF</button>
      </div>

      {quote.version > 1 && quote.lines.some((l) => l.was) && (
        <div className="acct-tabs bz-versions" role="group" aria-label="Quote version">
          <button type="button" className={`bz-ver ${version === 'current' ? 'is-on' : ''}`} onClick={() => setVersion('current')}>v{quote.version} · current</button>
          <button type="button" className={`bz-ver ${version === 'prev' ? 'is-on' : ''}`} onClick={() => setVersion('prev')}>v{quote.version - 1} · superseded</button>
        </div>
      )}

      {version === 'current' && quote.changes && (
        <div className="bz-changes">
          <p className="bz-changes-title">What changed since v{quote.version - 1}</p>
          {quote.changes.map(([what, from, to]) => (
            <div key={what} className="bz-change-line"><span>{what}</span><span><s>{from}</s> → <b>{to}</b></span></div>
          ))}
        </div>
      )}

      <div className="bz-table-wrap">
        <table className="bz-table">
          <thead><tr><th>Item</th><th>Qty</th><th>Unit price*</th><th>Total*</th></tr></thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.id}>
                <td data-label="Item">{l.name}</td>
                <td data-label="Qty">{l.qty}</td>
                <td data-label="Unit price">{egp(l.unitPrice)}</td>
                <td data-label="Total">{egp(l.qty * l.unitPrice)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="bz-totals">
          <div><span>Subtotal excl. VAT</span><b>{egp(shownTotals.subtotal)}</b></div>
          <div><span>VAT 14%</span><b>{egp(shownTotals.vat)}</b></div>
          <div className="is-total"><span>Total incl. VAT</span><b>{egp(shownTotals.total)}</b></div>
          <p className="bz-fine">*Prices exclude VAT.</p>
        </div>
      </div>

      {quote.terms && (
        <section className="acct-card acct-card-tight">
          <h3 className="bz-terms-title">Terms in this version</h3>
          {quote.terms.map(([k, v]) => <div key={k} className="bz-term"><span>{k}</span><span>{v}</span></div>)}
        </section>
      )}

      {canDecide && version === 'current' && (
        <div className="bz-decide">
          <Button variant="outline-teal" size="md" onClick={() => setChanging(true)}>Request changes</Button>
          <Button size="md" onClick={handleAccept}>Accept quote</Button>
        </div>
      )}
      <ChangeItemsModal open={changing} quote={quote} onClose={() => setChanging(false)} onSend={(c) => { requestChanges(quote.id, c); navigate('/business/account/quotes') }} />
    </div>
  )
}
