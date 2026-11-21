import { Button } from '@/components/ui/Button'
import { InvoicesIcon } from './icons'
import ProgressSteps from './ProgressSteps'
import StatusBadge from './StatusBadge'
import Thumb from './Thumb'
import './records.css'

export default function ActiveRepairCard({ repair }) {
  return (
    <article className="rpr">
      <header className="rpr-head">
        <div className="rpr-heading">
          <h3 className="rpr-id">{repair.id}</h3>
          <p className="rpr-meta">{repair.meta}</p>
        </div>
        <StatusBadge tone={repair.status.tone}>{repair.status.label}</StatusBadge>
      </header>

      <div className="rpr-device">
        <Thumb src={repair.image} />
        <div className="rpr-device-text">
          <h4 className="rpr-name">{repair.device}</h4>
          <p className="rpr-spec">{repair.spec}</p>
        </div>
      </div>

      <ProgressSteps steps={repair.steps} current={repair.currentStep} label={`Progress of repair ${repair.id}`} />

      <div className="rpr-quote">
        <span className="rpr-quote-icon"><InvoicesIcon size={22} /></span>
        <div className="rpr-quote-text">
          <p className="rpr-quote-title">{repair.quote.title}</p>
          <p className="rpr-quote-note">{repair.quote.note}</p>
        </div>
        <div className="rpr-quote-actions">
          <Button size="md" className="acct-btn">Approve &amp; start repair</Button>
          <Button variant="outline-teal" size="md" className="acct-btn">Decline</Button>
        </div>
      </div>
    </article>
  )
}
