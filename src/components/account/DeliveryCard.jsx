import './records.css'

export default function DeliveryCard({ lines }) {
  return (
    <section className="acct-card acct-card-tight">
      <h3 className="acct-card-title">Delivery details</h3>
      {lines.map((line) => <p key={line} className="od-line">{line}</p>)}
    </section>
  )
}
