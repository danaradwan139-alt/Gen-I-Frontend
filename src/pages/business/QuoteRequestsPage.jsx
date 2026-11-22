import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ChangeItemsModal from '@/components/business/ChangeItemsModal'
import QuoteBadge from '@/components/business/QuoteBadge'
import { quoteSummary } from '@/components/business/quoteHelpers'
import { Button } from '@/components/ui/Button'
import { Chip } from '@/components/ui/Chip'
import { useBusiness } from '@/context/BusinessContext'
import { useConfirm } from '@/context/ConfirmContext'

const filters = [
  ['all', 'All'], ['review', 'In review'], ['ready', 'Quote ready'], ['action', 'Action needed'], ['accepted', 'Accepted'], ['expired', 'Expired'],
]

// Figma "04.1 Quote requests": every RFQ with its status and the next thing to do.
export default function QuoteRequestsPage() {
  const { quotes, requestChanges, requestAgain } = useBusiness()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [changing, setChanging] = useState(null)
  const visible = quotes.filter((q) => filter === 'all' || q.status === filter)

  async function handleRequestAgain(q) {
    const ok = await confirm({ tone: 'save', title: `Request ${q.id} again?`, message: 'We’ll send the same items and locations to your account manager for a fresh quote.', confirmLabel: 'Send request' })
    if (ok) requestAgain(q.id)
  }

  const action = (q) => {
    if (q.status === 'ready') return <Button size="xs" onClick={() => navigate(q.id)}>Review quote</Button>
    if (q.status === 'action') return <Button size="xs" variant="outline-teal" onClick={() => setChanging(q)}>Change items</Button>
    if (q.status === 'expired') return <Button size="xs" variant="outline-teal" onClick={() => handleRequestAgain(q)}>Request again</Button>
    if (q.status === 'accepted') return <Button size="xs" variant="outline-teal" to="../quotations">View quotation</Button>
    return <Button size="xs" variant="outline-teal" onClick={() => navigate(q.id)}>View request</Button>
  }

  return (
    <div className="acct-stack">
      <div className="acct-tabs bz-filters" role="group" aria-label="Request status">
        {filters.map(([id, label]) => <Chip key={id} active={filter === id} onClick={() => setFilter(id)}>{label}</Chip>)}
      </div>
      {visible.length === 0 && <p className="acct-empty">No requests here yet.</p>}
      {visible.map((q) => (
        <article key={q.id} className="bz-rfq">
          <div className="bz-rfq-text">
            <h3 className="rec-id">#{q.id}</h3>
            <p className="rec-meta">{quoteSummary(q)}</p>
            {q.status === 'action' && q.note && <p className="bz-rfq-note">{q.note}</p>}
          </div>
          <div className="bz-rfq-side">
            <QuoteBadge status={q.status} version={q.version} />
            {action(q)}
          </div>
        </article>
      ))}
      <ChangeItemsModal open={Boolean(changing)} quote={changing} onClose={() => setChanging(null)} onSend={(changes) => requestChanges(changing.id, changes)} />
    </div>
  )
}
