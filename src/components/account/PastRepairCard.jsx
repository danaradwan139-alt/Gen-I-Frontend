import { Button } from '@/components/ui/Button'
import StatusBadge from './StatusBadge'
import Thumb from './Thumb'
import './records.css'

export default function PastRepairCard({ repair }) {
  return (
    <article className="rpast">
      <Thumb src={repair.image} />
      <div className="rpast-text">
        <div className="rpast-head">
          <h3 className="rpast-id">{repair.id}</h3>
          <p className="rpast-date">{repair.date}</p>
        </div>
        <p className="rpast-summary">{repair.summary}</p>
      </div>
      <StatusBadge tone={repair.status.tone}>{repair.status.label}</StatusBadge>
      <Button variant="outline-teal" size="md" className="acct-btn">View invoice</Button>
    </article>
  )
}
