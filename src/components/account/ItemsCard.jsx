import Thumb from './Thumb'
import './records.css'

export default function ItemsCard({ items }) {
  return (
    <section className="acct-card">
      <h3 className="acct-card-title">Items ({items.length})</h3>
      {items.map((item) => (
        <div key={item.name} className="od-item">
          <Thumb src={item.image} />
          <div className="od-item-text">
            <p className="od-item-name">{item.name}</p>
            <p className="od-item-spec">{item.spec}</p>
          </div>
          <p className="od-item-price">{item.price}</p>
        </div>
      ))}
    </section>
  )
}
