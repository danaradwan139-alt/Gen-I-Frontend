import { CheckIcon } from '@/components/account/icons'
import { downloadQuotePdf, egp } from '@/components/business/quoteHelpers'
import { Button } from '@/components/ui/Button'
import { useBusiness } from '@/context/BusinessContext'

const steps = [
  ['Order confirmation', 'Your request has been accepted by the admin.'],
  ['Delivery scheduling', 'Per location, as agreed in the quote.'],
  ['Invoices & documents', 'Shared with your company.'],
]

// Figma "04.3 quote": accepted quotations and what happens next.
export default function QuotationsPage() {
  const { quotes, company, locations } = useBusiness()
  const accepted = quotes.filter((q) => q.status === 'accepted')

  if (accepted.length === 0) {
    return (
      <section className="acct-card">
        <h2 className="acct-card-title">No accepted quotations yet</h2>
        <p className="bz-attn-sub">When you accept a quote it appears here with the next steps.</p>
        <Button size="md" variant="outline-teal" to="../quotes">Go to quote requests</Button>
      </section>
    )
  }

  return (
    <div className="acct-stack">
      {accepted.map((q) => (
        <section key={q.id} className="acct-card bz-accepted">
          <span className="bz-accepted-tick" aria-hidden="true"><CheckIcon size={22} /></span>
          <h2 className="bz-accepted-title">Your request has been accepted.</h2>
          <p className="bz-attn-sub">
            {q.quoteNo ?? q.id}{q.version ? ` v${q.version}` : ''} · The admin will contact you to confirm the order and schedule the delivery. The approved price quote is now final; neither the prices nor the terms will change.
          </p>
          <div className="bz-accepted-total"><span>Accepted total</span><b>{egp(q.acceptedTotal ?? 0)} incl. VAT</b></div>
          <ol className="bz-next">
            {steps.map(([title, text], i) => (
              <li key={title}><span className="num">{i + 1}</span><b>{title}</b><span>{text}</span></li>
            ))}
          </ol>
          <div className="bz-decide is-left">
            <Button size="md" onClick={() => downloadQuotePdf(q, company, locations)}>Download accepted quote (PDF)</Button>
            <Button size="md" variant="outline-teal" href={`mailto:business@gen-i.com?subject=${encodeURIComponent(`${company.name} · ${q.quoteNo ?? q.id}`)}`}>Contact Admin</Button>
          </div>
        </section>
      ))}
    </div>
  )
}
