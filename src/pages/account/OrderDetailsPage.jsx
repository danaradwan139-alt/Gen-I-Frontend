import { Link, Navigate, useParams } from 'react-router-dom'
import AskAssistantButton from '@/components/account/AskAssistantButton'
import Breadcrumb from '@/components/account/Breadcrumb'
import DeliveryCard from '@/components/account/DeliveryCard'
import ItemsCard from '@/components/account/ItemsCard'
import PaymentSummary from '@/components/account/PaymentSummary'
import ProgressSteps from '@/components/account/ProgressSteps'
import StatusBadge from '@/components/account/StatusBadge'
import { Button } from '@/components/ui/Button'
import { useAccount } from '@/context/AccountContext'

// Reached from "Track order" / "View details" on the Orders page: /account/orders/:orderId
// A delivered order (`completed`) shows every step as done and, while it is `returnable`, a "Start a return" button.
export default function OrderDetailsPage() {
  const { orderId } = useParams()
  const { orderDetails } = useAccount()
  const order = orderDetails[orderId]

  if (!order) return <Navigate to="/account/orders" replace />

  const { returnable, returnRequest, completed } = order

  return (
    <div className="od">
      <div className="od-crumb">
        <Breadcrumb parent={{ label: 'Orders', to: '/account/orders' }} current="Order details & tracking" />
      </div>

      <div className="od-head">
        <div className="od-title">
          <h2 className="od-id">{order.id}</h2>
          <StatusBadge tone={order.status.tone}>{order.status.label}</StatusBadge>
        </div>
        <p className="od-placed">{order.placed}</p>
      </div>

      <section className="acct-card od-track">
        <div className="od-track-head">
          <h3 className="od-arriving">{order.arriving}</h3>
          {!completed && <Link to="/account/orders" className="od-slot">Change delivery slot</Link>}
        </div>
        <ProgressSteps
          steps={order.steps} current={order.currentStep} complete={completed}
          label={`Progress of order ${order.id}`}
        />
      </section>

      <div className="od-grid">
        <div className="od-main">
          {returnRequest && (
            <section className="acct-card acct-card-tight" aria-labelledby="return-request-title">
              <h3 id="return-request-title" className="acct-card-title">Return requested · {returnRequest.id}</h3>
              <p className="od-line">Items: {returnRequest.items.join(', ')}</p>
              <p className="od-line">Reason: {returnRequest.reason}</p>
              {returnRequest.note && <p className="od-line">Your note: {returnRequest.note}</p>}
              <p className="od-line">Refund and collection: {returnRequest.refund}</p>
            </section>
          )}
          <ItemsCard items={order.items} />
          <DeliveryCard lines={order.delivery} />
        </div>
        <div className="od-side">
          {returnable && !returnRequest && (
            <div className="od-return">
              <Button size="md" className="acct-btn block" to={`/account/orders/${orderId}/return`}>Start a return</Button>
              <p className="od-return-note">Free returns until {returnable.until}</p>
            </div>
          )}
          <PaymentSummary payment={order.payment} />
          <Button variant="outline-teal" size="md" className="acct-btn block">Download invoice</Button>
          {!completed && <Button variant="outline-teal" size="md" className="acct-btn block">Cancel order</Button>}
          <AskAssistantButton>Ask GEN-I about this order</AskAssistantButton>
        </div>
      </div>
    </div>
  )
}
