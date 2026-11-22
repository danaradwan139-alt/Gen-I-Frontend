import { quoteStatuses } from '@/data/business'

// Coloured status pill for a quote request (In review · Quote ready · Action needed · Accepted · Expired).
export default function QuoteBadge({ status, version, children }) {
  const { label, tone } = quoteStatuses[status]
  const text = children ?? (status === 'ready' && version ? `Quote v${version} ready` : status === 'accepted' && version ? `Accepted · v${version}` : label)
  return <span className={`acct-status is-${tone}`}>{text}</span>
}
