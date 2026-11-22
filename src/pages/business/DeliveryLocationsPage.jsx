import { useState } from 'react'
import AddressCard from '@/components/account/AddressCard'
import AddressModal from '@/components/account/AddressModal'
import { Button } from '@/components/ui/Button'
import { useBusiness } from '@/context/BusinessContext'

// Figma "04.4 Delivery locations" + "popup · Add Delivery locations".
export default function DeliveryLocationsPage() {
  const { locations, saveLocation, removeLocation, setDefaultLocation } = useBusiness()
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)
  const openModal = (location = null) => { setEditing(location); setOpen(true) }

  return (
    <>
      <div className="acct-bar">
        <h2 className="acct-h acct-h-lg">Delivery locations</h2>
        <Button size="md" onClick={() => openModal()}>+ Add location</Button>
      </div>
      {locations.length === 0 ? (
        <p className="acct-empty">Add the branches and offices we deliver to.</p>
      ) : (
        <div className="acct-grid">
          {locations.map((l) => <AddressCard key={l.id} address={l} onEdit={openModal} onRemove={removeLocation} onSetDefault={setDefaultLocation} />)}
        </div>
      )}
      <AddressModal location open={open} address={editing} onSave={(l) => saveLocation(editing ? { ...l, id: editing.id } : l)} onClose={() => setOpen(false)} />
    </>
  )
}
