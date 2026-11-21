import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { ConfirmDialog } from '@/components/ui/ConfirmDialog'
import { PinIcon } from './icons'

export default function AddressCard({ address, onEdit, onRemove, onSetDefault }) {
  const [confirming, setConfirming] = useState(false)
  const line = [address.street, address.floor, address.area, address.governorate].filter(Boolean).join(', ')

  return (
    <article className={`addr ${address.isDefault ? 'is-default' : ''}`}>
      <header className="addr-head">
        <PinIcon size={20} />
        <h3 className="addr-type">{address.type}</h3>
        {address.isDefault && <span className="addr-badge">Default</span>}
      </header>
      <p className="addr-name">{address.fullName}</p>
      <p className="addr-line">{line}</p>
      <p className="addr-line">{address.mobile}</p>
      <div className="addr-actions">
        <Button variant="outline-teal" size="xs" onClick={() => onEdit(address)}>Edit</Button>
        {!address.isDefault && <Button variant="outline-teal" size="xs" onClick={() => onSetDefault(address.id)}>Set as default</Button>}
        <Button variant="outline-teal" size="xs" onClick={() => setConfirming(true)}>Remove</Button>
      </div>

      <ConfirmDialog
        open={confirming}
        title="Remove this address?"
        message={`${address.type} (${line}) will be deleted from your saved addresses.`}
        confirmLabel="Remove"
        onClose={() => setConfirming(false)}
        onConfirm={() => onRemove(address.id)}
      />
    </article>
  )
}
