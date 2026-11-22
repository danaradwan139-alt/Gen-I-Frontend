import { Button } from '@/components/ui/Button'
import StatusBadge from './StatusBadge'
import Thumb from './Thumb'
import './records.css'

// Order / trade-in row: id, meta and status on top; thumbnail, two lines of text and one action below.
// `muted` greys the description line (trade-ins); orders keep it in the main text colour.
export default function RecordCard({ id, meta, status, image, title, total, action, muted = false, onAction }) {
  return (
    <article className="rec">
      <header className="rec-head">
        <div className="rec-heading">
          <h3 className="rec-id">{id}</h3>
          <p className="rec-meta">{meta}</p>
        </div>
        <StatusBadge tone={status.tone}>{status.label}</StatusBadge>
      </header>

      <div className="rec-body">
        <Thumb src={image} />
        <div className="rec-text">
          <p className={muted ? 'is-muted' : undefined}>{title}</p>
          <p className="rec-total">{total}</p>
        </div>
        <Button variant={action.variant} size="md" className="acct-btn rec-action" to={action.to} onClick={action.to ? undefined : () => onAction?.(action)}>{action.label}</Button>
      </div>
    </article>
  )
}
