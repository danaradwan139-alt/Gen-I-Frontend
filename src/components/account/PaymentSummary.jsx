import './records.css'

export default function PaymentSummary({ payment }) {
  return (
    <section className="paysum">
      <h3 className="paysum-title">Payment summary</h3>
      <p className="paysum-row"><span className="paysum-label">Subtotal</span><span className="paysum-value">{payment.subtotal}</span></p>
      <p className="paysum-row"><span className="paysum-label">Delivery</span><span className="paysum-value is-free">{payment.delivery}</span></p>
      <p className="paysum-row paysum-total"><span>Total</span><span>{payment.total}</span></p>
      <p className="paysum-method">{payment.method}</p>
    </section>
  )
}
