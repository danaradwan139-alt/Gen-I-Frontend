import './records.css'

// tone: blue | green | grey
export default function StatusBadge({ tone = 'blue', children }) {
  return <span className={`acct-status is-${tone}`}>{children}</span>
}
