import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'
import { downloadInvoices } from '@/utils/invoicePdf'
import { repairRow } from '@/utils/invoiceRows'
import StatusBadge from './StatusBadge'
import Thumb from './Thumb'
import './records.css'

export default function PastRepairCard({ repair }) {
  const { addresses } = useAccount()
  const [service, device] = repair.summary.split(' · ')
  const download = () => downloadInvoices(
    [repairRow({ id: repair.id, amount: repair.amount ?? 0, service, device, date: repair.date }, addresses)],
    `INV-${repair.id.replace('#', '')}.pdf`,
  )
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
      <Button variant="outline-teal" size="md" className="acct-btn" onClick={download}>View invoice</Button>
    </article>
  )
}
