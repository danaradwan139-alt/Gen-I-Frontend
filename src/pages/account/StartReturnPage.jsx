import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Breadcrumb from '@/components/account/Breadcrumb'
import FormSection from '@/components/account/FormSection'
import RadioOption from '@/components/account/RadioOption'
import Thumb from '@/components/account/Thumb'
import { CheckIcon } from '@/components/account/icons'
import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'
import { returnReasons, returnRefunds } from '@/data/account'

// /account/orders/:orderId/return. The order (and its products) come from the order in AccountContext.
export default function StartReturnPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { orderDetails, submitReturn } = useAccount()
  const [selected, setSelected] = useState([])
  const [reason, setReason] = useState(returnReasons[0].id)
  const [note, setNote] = useState('')
  const [refund, setRefund] = useState(returnRefunds[0].id)
  const [error, setError] = useState('')

  const order = orderDetails[orderId]
  const detailsPath = `/account/orders/${orderId}`

  // Unknown order, an order that can't be returned yet, or one that already has a request: back to the order.
  if (!order) return <Navigate to="/account/orders" replace />
  if (!order.returnable || order.returnRequest) return <Navigate to={detailsPath} replace />

  const toggleItem = (id) => {
    setError('')
    setSelected((current) => (current.includes(id) ? current.filter((value) => value !== id) : [...current, id]))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (selected.length === 0) {
      setError('Select at least one item to return.')
      return
    }
    submitReturn(orderId, {
      items: order.items.filter((item) => selected.includes(item.id)).map((item) => item.name),
      reason: returnReasons.find((option) => option.id === reason).label,
      note: note.trim(),
      refund: returnRefunds.find((option) => option.id === refund).label,
    })
    navigate(detailsPath)
  }

  return (
    <form onSubmit={handleSubmit} className="rf-page" noValidate>
      <div className="od-crumb">
        <Breadcrumb
          parent={{ label: 'Orders', to: '/account/orders' }}
          current="Order details & tracking"
          currentTo={detailsPath}
        />
      </div>

      <h2 className="od-id">Start a return</h2>
      <p className="od-placed">
        Order {order.id} · Free returns within 14 days of delivery. Eligible until {order.returnable.until}.
      </p>

      <FormSection title="1. Which item are you returning?">
        {order.items.map((item) => (
          <label key={item.id} className="rf-item">
            <input
              type="checkbox" className="sr-only"
              checked={selected.includes(item.id)} onChange={() => toggleItem(item.id)}
            />
            <span className={`rf-box ${selected.includes(item.id) ? 'is-checked' : ''}`} aria-hidden="true">
              {selected.includes(item.id) && <CheckIcon size={12} strokeWidth={2.5} />}
            </span>
            <Thumb src={item.image} />
            <span className="rf-item-text">
              <span className="od-item-name">{item.name}</span>
              <span className="od-item-spec">{item.spec}</span>
            </span>
          </label>
        ))}
        {error && <p className="rf-error" role="alert">{error}</p>}
      </FormSection>

      <FormSection title="2. Why are you returning it?">
        <div className="rf-options">
          {returnReasons.map((option) => (
            <RadioOption
              key={option.id} name="reason" value={option.id} label={option.label}
              checked={reason === option.id} onChange={() => setReason(option.id)}
            />
          ))}
        </div>
        <label className="field rf-note">
          <span className="field-label">Tell us more (optional)</span>
          <textarea
            className="field-input rf-textarea" value={note} maxLength={300}
            onChange={(event) => setNote(event.target.value)} placeholder="Anything we should know?"
          />
        </label>
      </FormSection>

      <FormSection title="3. How should we refund and collect it?">
        <div className="rf-options rf-options-2">
          {returnRefunds.map((option) => (
            <RadioOption
              key={option.id} name="refund" value={option.id} label={option.label} note={option.note}
              checked={refund === option.id} onChange={() => setRefund(option.id)}
            />
          ))}
        </div>
      </FormSection>

      <div className="rf-actions">
        <Button type="submit" size="lg">Submit return request</Button>
        <Button variant="text" size="lg" to={detailsPath}>Cancel</Button>
      </div>
    </form>
  )
}
