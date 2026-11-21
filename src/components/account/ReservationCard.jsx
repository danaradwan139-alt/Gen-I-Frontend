import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { getIphoneImage } from '@/data/iphoneImages'
import { products } from '@/data/products'
import { formatDayTime, formatEgp } from '@/utils/format'
import { ClockIcon, StoreIcon, UserIcon } from './icons'

const statusLabels = { active: 'Ready for pickup', collected: 'Collected', expired: 'Expired' }

export default function ReservationCard({ reservation, onExtend, onCancel }) {
  const [confirming, setConfirming] = useState(false)
  const product = products.find((item) => item.id === reservation.productId)
  const image = product && (product.image || getIphoneImage(product))
  const isActive = reservation.status === 'active'
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(reservation.store)}`

  return (
    <article className="resv">
      <header className="resv-head">
        <h3 className="resv-id">#{reservation.id}</h3>
        <p className="resv-when">Reserved {formatDayTime(reservation.reservedAt)}</p>
        <span className={`resv-status is-${reservation.status}`}>{statusLabels[reservation.status]}</span>
      </header>

      <div className="resv-item">
        <div className="resv-thumb">{image && <img src={image} alt="" loading="lazy" />}</div>
        <div>
          <h4 className="resv-name">{reservation.name} · {reservation.variantLabel}</h4>
          <p className="resv-price">{formatEgp(reservation.price)} · {reservation.paymentNote}</p>
        </div>
      </div>

      <ul className="resv-facts">
        <li><StoreIcon size={20} />{reservation.store}</li>
        {isActive && <li><ClockIcon size={20} />Held for you until {formatDayTime(reservation.heldUntil)}</li>}
        {isActive && <li><UserIcon size={20} />Bring your ID — or share the code with someone you trust</li>}
      </ul>

      {isActive && (
        <div className="resv-actions">
          <Button size="md" href={directions} target="_blank" rel="noreferrer">Get directions</Button>
          <Button variant="outline-teal" size="md" onClick={() => onExtend(reservation.id)}>Extend hold</Button>
          <Button variant="outline-teal" size="md" onClick={() => setConfirming(true)}>Cancel reservation</Button>
        </div>
      )}

      <ConfirmDialog
        open={confirming}
        title="Cancel this reservation?"
        message={`${reservation.name} will go back on the shelf and #${reservation.id} will be released.`}
        confirmLabel="Cancel reservation"
        cancelLabel="Keep it"
        secondStep={{
          title: 'Release this device?',
          message: 'Someone else may buy it as soon as the hold is released. This can’t be undone.',
          confirmLabel: 'Yes, cancel reservation',
        }}
        onClose={() => setConfirming(false)}
        onConfirm={() => { setConfirming(false); onCancel(reservation.id) }}
      />
    </article>
  )
}
