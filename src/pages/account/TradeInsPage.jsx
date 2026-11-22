import { useState } from 'react'
import FilterTabs from '@/components/account/FilterTabs'
import RecordCard from '@/components/account/RecordCard'
import SlotPickerModal from '@/components/account/SlotPickerModal'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'
import { askAssistant } from '@/utils/assistant'

const filters = [
  { id: 'all', label: 'All', empty: 'No trade-ins yet.' },
  { id: 'in-progress', label: 'In progress', empty: 'No trade-ins in progress.' },
  { id: 'completed', label: 'Completed', empty: 'No completed trade-ins.' },
]

export default function TradeInsPage() {
  const { tradeIns, tradeInCredit, rescheduleTradeIn } = useAccount()
  const [rescheduling, setRescheduling] = useState(null)
  const [viewing, setViewing] = useState(null)
  const [filter, setFilter] = useState('all')
  const visible = tradeIns.filter((tradeIn) => filter === 'all' || tradeIn.filter === filter)

  return (
    <div className="acct-stack">
      <FilterTabs
        filters={filters} value={filter} onChange={setFilter} label="Trade-in status"
        action={{ label: 'Get a new estimate', onClick: () => askAssistant('I want a trade-in estimate for my phone') }}
      />

      <div className="credit">
        <div className="credit-text">
          <p className="credit-label">{tradeInCredit.label}</p>
          <p className="credit-amount">{tradeInCredit.amount}</p>
          <p>{tradeInCredit.note}</p>
        </div>
        <Button size="md" className="acct-btn" to="/shop">Shop with credit</Button>
      </div>

      {visible.length === 0 ? (
        <p className="acct-empty">{filters.find((item) => item.id === filter).empty}</p>
      ) : (
        visible.map((tradeIn) => (
          <RecordCard
            key={tradeIn.id}
            {...tradeIn}
            muted
            onAction={(action) => (action.kind === 'reschedule' ? setRescheduling(tradeIn) : setViewing(tradeIn))}
          />
        ))
      )}

      <SlotPickerModal
        open={Boolean(rescheduling)}
        title={`Reschedule inspection ${rescheduling?.id ?? ''}`}
        times={['10 AM – 1 PM', '1 PM – 5 PM', '5 PM – 9 PM']}
        onSave={(slot) => rescheduleTradeIn(rescheduling.id, slot)}
        onClose={() => setRescheduling(null)}
      />
      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title={`Trade-in ${viewing?.id ?? ''}`} className="modal-sm">
        {viewing && (
          <dl className="ti-details">
            {(viewing.details ?? [['Device', viewing.meta], ['Status', viewing.status.label], ['Value', viewing.total]]).map(([k, v]) => (
              <div key={k} style={{ display: 'contents' }}><dt>{k}</dt><dd>{v}</dd></div>
            ))}
          </dl>
        )}
      </Modal>
    </div>
  )
}
