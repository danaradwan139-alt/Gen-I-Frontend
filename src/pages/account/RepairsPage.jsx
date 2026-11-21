import { useState } from 'react'
import ActiveRepairCard from '@/components/account/ActiveRepairCard'
import FilterTabs from '@/components/account/FilterTabs'
import PastRepairCard from '@/components/account/PastRepairCard'
import { useAccount } from '@/context/AccountContext'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'completed', label: 'Completed' },
]

export default function RepairsPage() {
  const { activeRepair, pastRepairs } = useAccount()
  const [filter, setFilter] = useState('all')

  return (
    <div className="acct-stack">
      <FilterTabs
        filters={filters} value={filter} onChange={setFilter} label="Repair status"
        action={{ label: 'Book a new repair', to: '/#repair' }}
      />
      {filter !== 'completed' && <ActiveRepairCard repair={activeRepair} />}
      {filter !== 'active' && (
        <section aria-labelledby="past-repairs-title">
          <h2 id="past-repairs-title" className="acct-h">Past repairs</h2>
          <div className="rpast-list">
            {pastRepairs.map((repair) => <PastRepairCard key={repair.id} repair={repair} />)}
          </div>
        </section>
      )}
    </div>
  )
}
