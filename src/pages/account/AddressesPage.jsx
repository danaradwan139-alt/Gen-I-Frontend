import { useState } from 'react'
import AddressCard from '@/components/account/AddressCard'
import AddressModal from '@/components/account/AddressModal'
import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'

export default function AddressesPage() {
  const { addresses, saveAddress, removeAddress, setDefaultAddress } = useAccount()
  const [editing, setEditing] = useState(null)
  const [open, setOpen] = useState(false)

  function openModal(address = null) {
    setEditing(address)
    setOpen(true)
  }

  return (
    <>
      <div className="acct-bar">
        <h2 className="acct-h acct-h-lg">Saved addresses</h2>
        <Button size="md" onClick={() => openModal()}>Add new address</Button>
      </div>
      {addresses.length === 0 ? (
        <p className="acct-empty">You haven’t saved an address yet.</p>
      ) : (
        <div className="acct-grid">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} onEdit={openModal} onRemove={removeAddress} onSetDefault={setDefaultAddress} />
          ))}
        </div>
      )}
      <AddressModal open={open} address={editing} onSave={saveAddress} onClose={() => setOpen(false)} />
    </>
  )
}
