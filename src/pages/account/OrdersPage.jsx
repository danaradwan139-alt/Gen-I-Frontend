import { useState } from 'react'
import FilterTabs from '@/components/account/FilterTabs'
import RecordCard from '@/components/account/RecordCard'
import { useAccount } from '@/context/AccountContext'

const filters = [
  { id: 'all', label: 'All', empty: 'No orders yet.' },
  { id: 'in-progress', label: 'In progress', empty: 'No orders in progress.' },
  { id: 'delivered', label: 'Delivered', empty: 'Nothing delivered yet.' },
  { id: 'returns', label: 'Returns', empty: 'No returns.' },
]

export default function OrdersPage() {
  const { orders } = useAccount()
  const [filter, setFilter] = useState('all')
  const visible = orders.filter((order) => filter === 'all' || order.filter === filter)

  return (
    <div className="acct-stack">
      <FilterTabs filters={filters} value={filter} onChange={setFilter} label="Order status" />
      {visible.length === 0 ? (
        <p className="acct-empty">{filters.find((item) => item.id === filter).empty}</p>
      ) : (
        visible.map((order) => <RecordCard key={order.id} {...order} />)
      )}
    </div>
  )
}
