import './Marquee.css'

const moves = ['Free two-day delivery', 'Trade in and save', 'One-on-one setup', 'Easy returns', 'Fast And Secure Delivery', 'Find Your Perfect iPhone']

function Group({ hidden }) {
  return (
    <div className="move-group" aria-hidden={hidden || undefined}>
      {moves.map((m) => (
        <div key={m} className="move-item">
          <span className="move-label">{m}<i className="dot" /></span>
        </div>
      ))}
      <div className="move-item" /><div className="move-item" />
    </div>
  )
}

// Two identical groups scroll left in a seamless loop.
export default function Marquee() {
  return (
    <section className="move" aria-label="Highlights">
      <div className="move-track">
        <Group />
        <Group hidden />
      </div>
    </section>
  )
}
