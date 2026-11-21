import { useState } from 'react'
import FilterTabs from '@/components/account/FilterTabs'
import RecordCard from '@/components/account/RecordCard'
import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'

const filters = [
  { id: 'all', label: 'All', empty: 'No trade-ins yet.' },
  { id: 'in-progress', label: 'In progress', empty: 'No trade-ins in progress.' },
  { id: 'completed', label: 'Completed', empty: 'No completed trade-ins.' },
]

export default function TradeInsPage() {
  const { tradeIns, tradeInCredit } = useAccount()
  const [filter, setFilter] = useState('all')
  const visible = tradeIns.filter((tradeIn) => filter === 'all' || tradeIn.filter === filter)

  return (
    <div className="acct-stack">
      <FilterTabs
        filters={filters} value={filter} onChange={setFilter} label="Trade-in status"
        action={{ label: 'Get a new estimate', to: '/#trade-in' }}
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
        visible.map((tradeIn) => <RecordCard key={tradeIn.id} {...tradeIn} muted />)
      )}
    </div>
  )
}
