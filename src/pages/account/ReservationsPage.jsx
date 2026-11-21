import { useState } from 'react'
import ReservationCard from '@/components/account/ReservationCard'
import { Chip } from '@/components/ui/Chip'
import { useAccount } from '@/context/AccountContext'

const tabs = [
  { id: 'active', label: 'Active', empty: 'You have no active reservations.' },
  { id: 'collected', label: 'Collected', empty: 'Nothing collected yet.' },
  { id: 'expired', label: 'Expired', empty: 'No expired reservations.' },
]

export default function ReservationsPage() {
  const { reservations, extendReservation, cancelReservation } = useAccount()
  const [tab, setTab] = useState('active')
  const visible = reservations.filter((item) => item.status === tab)

  return (
    <>
      <div className="acct-tabs" role="group" aria-label="Reservation status">
        {tabs.map(({ id, label }) => (
          <Chip key={id} active={tab === id} onClick={() => setTab(id)}>{label}</Chip>
        ))}
      </div>
      {visible.length === 0 ? (
        <p className="acct-empty">{tabs.find((item) => item.id === tab).empty}</p>
      ) : (
        <div className="acct-stack">
          {visible.map((reservation) => (
            <ReservationCard key={reservation.id} reservation={reservation} onExtend={extendReservation} onCancel={cancelReservation} />
          ))}
        </div>
      )}
    </>
  )
}
