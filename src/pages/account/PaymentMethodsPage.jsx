import { useState } from 'react'
import CardModal from '@/components/account/CardModal'
import CardTile from '@/components/account/CardTile'
import { PlusIcon } from '@/components/account/icons'
import { useAccount } from '@/context/AccountContext'

export default function PaymentMethodsPage() {
  const { cards, addCard, removeCard, setDefaultCard } = useAccount()
  const [open, setOpen] = useState(false)

  return (
    <>
      <h2 className="acct-h acct-h-lg acct-h-gap">Saved cards</h2>
      <div className="acct-cards">
        {cards.map((card) => (
          <CardTile key={card.id} card={card} onSetDefault={setDefaultCard} onRemove={removeCard} />
        ))}
        <button type="button" className="pcard-add" onClick={() => setOpen(true)}>
          <PlusIcon size={40} />
          <span>Add a new card</span>
        </button>
      </div>
      <CardModal open={open} onSave={addCard} onClose={() => setOpen(false)} />
    </>
  )
}
