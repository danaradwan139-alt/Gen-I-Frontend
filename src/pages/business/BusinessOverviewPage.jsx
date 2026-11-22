import { useNavigate } from 'react-router-dom'
import { ClockIcon } from '@/components/account/icons'
import QuoteBadge from '@/components/business/QuoteBadge'
import { egp } from '@/components/business/quoteHelpers'
import { Button } from '@/components/ui/Button'
import { quoteTotals, useBusiness } from '@/context/BusinessContext'
import { APPROVAL_LIMIT } from '@/data/business'

// Figma "04 Overview": counters, what needs attention, recent activity.
export default function BusinessOverviewPage() {
  const { quotes, activity } = useBusiness()
  const navigate = useNavigate()
  const open = quotes.filter((q) => ['review', 'ready', 'action'].includes(q.status))
  const toReview = quotes.filter((q) => q.status === 'ready')
  const bigOnes = toReview.filter((q) => quoteTotals(q).total > APPROVAL_LIMIT)
  const inReview = quotes.filter((q) => q.status === 'review')
  const attention = [...quotes.filter((q) => q.status === 'ready' || q.status === 'action'), ...inReview].slice(0, 3)

  return (
    <div className="acct-stack">
      <div className="bz-stats">
        <div className="bz-stat">
          <p className="bz-stat-label">Open requests</p>
          <p className="bz-stat-num">{open.length}</p>
          {inReview.length > 0 && <span className="acct-status is-blue">In review by your account manager</span>}
        </div>
        <div className="bz-stat">
          <p className="bz-stat-label">Quotes to review</p>
          <p className="bz-stat-num">{toReview.length}</p>
          {toReview[0]?.validUntil && <span className="acct-status is-orange">Valid until {toReview[0].validUntil.split(',')[0].replace(/^\w+ /, '')}</span>}
        </div>
        <div className="bz-stat">
          <p className="bz-stat-label">Waiting for approval</p>
          <p className="bz-stat-num">{bigOnes.length}</p>
          <span className="acct-status is-grey">Above {egp(APPROVAL_LIMIT)}</span>
        </div>
      </div>

      <section className="acct-card">
        <div className="bz-card-head">
          <h2 className="acct-card-title">Needs your attention</h2>
          <Button size="xs" to="/business/checkout">New quote request →</Button>
        </div>
        {attention.length === 0 && <p className="acct-empty">You’re all caught up.</p>}
        {attention.map((q) => (
          <div key={q.id} className="bz-attn">
            <div className="bz-attn-text">
              <p className="bz-attn-title">
                {q.status === 'review' || q.status === 'action' ? `Request #${q.id}` : `Quote #${q.quoteNo ?? q.id}${q.version ? ` · version ${q.version}` : ''}`}
                <QuoteBadge status={q.status}>{q.status === 'ready' ? 'Ready to review' : undefined}</QuoteBadge>
              </p>
              <p className="bz-attn-sub">
                {q.status === 'review'
                  ? `${q.lineCount ?? q.lines?.length ?? 1} lines · ${q.pieces} pieces · submitted ${new Date(q.submitted).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`
                  : q.status === 'action' ? q.note : `For ${q.id} · ${egp(quoteTotals(q).total)} incl. VAT · valid until ${q.validUntil}`}
              </p>
            </div>
            <Button size="xs" variant={q.status === 'review' ? 'outline-teal' : 'primary'} onClick={() => navigate(`quotes/${q.id}`)}>
              {q.status === 'review' ? 'View' : q.status === 'action' ? 'Change items' : 'Review quote'}
            </Button>
          </div>
        ))}
      </section>

      <section className="acct-card">
        <h2 className="acct-card-title">Recent activity</h2>
        <ul className="bz-activity">
          {activity.map((a) => (
            <li key={a.text + a.when}><ClockIcon size={16} /><span>{a.text}</span><time>{a.when}</time></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
