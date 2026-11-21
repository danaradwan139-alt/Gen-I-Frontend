import { useState } from 'react'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { TrashIcon } from './icons'

export default function CardTile({ card, onSetDefault, onRemove }) {
  const [confirming, setConfirming] = useState(false)
  const label = `${card.brand} card ending in ${card.last4}`

  return (
    <article className={`pcard ${card.isDefault ? 'is-default' : ''}`} aria-label={label}>
      <header className="pcard-top">
        <span className="pcard-brand">{card.brand}</span>
        {card.isDefault && <span className="addr-badge">Default</span>}
      </header>
      <p className="pcard-number"><span aria-hidden="true">••••</span> {card.last4}</p>
      <footer className="pcard-bottom">
        <span>{card.holder}</span>
        <span>Expires {card.expiry}</span>
      </footer>

      {!card.isDefault && (
        <button type="button" className="pcard-btn pcard-default" onClick={() => onSetDefault(card.id)}>Set as default</button>
      )}
      <button type="button" className="pcard-btn pcard-remove" onClick={() => setConfirming(true)} aria-label={`Remove ${label}`}>
        <TrashIcon size={20} />
      </button>

      <ConfirmDialog
        open={confirming}
        title="Remove this card?"
        message={`${label} will be removed from your saved payment methods.`}
        confirmLabel="Remove"
        onClose={() => setConfirming(false)}
        onConfirm={() => onRemove(card.id)}
      />
    </article>
  )
}
