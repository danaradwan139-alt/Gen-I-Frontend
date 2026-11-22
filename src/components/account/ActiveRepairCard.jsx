import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'
import { useConfirm } from '@/context/ConfirmContext'
import { InvoicesIcon } from './icons'
import ProgressSteps from './ProgressSteps'
import StatusBadge from './StatusBadge'
import Thumb from './Thumb'
import './records.css'

export default function ActiveRepairCard({ repair }) {
  const { approveRepair, declineRepair } = useAccount()
  const confirm = useConfirm()
  const price = repair.quote.title.replace(/^Quote ready:\s*/, '')
  const decision = repair.quote.decision

  async function handleApprove() {
    const ok = await confirm({ tone: 'save', icon: 'save', title: `Approve the ${price} quote?`, message: 'Our technician will start the repair straight away. You pay when you collect your device.', confirmLabel: 'Approve & start' })
    if (ok) approveRepair()
  }
  async function handleDecline() {
    const ok = await confirm({ title: 'Decline this quote?', message: 'We won’t repair the device and there’s no charge. You can collect it from the store any time.', confirmLabel: 'Decline quote', cancelLabel: 'Keep quote' })
    if (ok) declineRepair()
  }
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

      <div className={`rpr-quote ${decision ? `is-decided is-${decision}` : ''}`}>
        <span className="rpr-quote-icon"><InvoicesIcon size={22} /></span>
        <div className="rpr-quote-text">
          <p className="rpr-quote-title">{repair.quote.title}</p>
          <p className="rpr-quote-note">{repair.quote.note}</p>
        </div>
        {!decision && (
          <div className="rpr-quote-actions">
            <Button size="md" className="acct-btn" onClick={handleApprove}>Approve &amp; start repair</Button>
            <Button variant="outline-teal" size="md" className="acct-btn" onClick={handleDecline}>Decline</Button>
          </div>
        )}
      </div>
    </article>
  )
}
