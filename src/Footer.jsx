import { assets as A } from './assets.js'
import { Arrow, Button } from './ui.jsx'

const cols = [
  ['Shop', ['iPhone', 'Apple Watch', 'Laptops', 'TV & Home', 'Home Appliances', 'Audio & Accessories']],
  ['Services', ['iPhone Repair', 'Trade In', 'Installments', 'Setup Help', 'Delivery']],
  ['Stores', ['Find a Store', 'Opening Hours', 'Book a Repair']],
]
const socials = [['Facebook', A.facebook], ['Instagram', A.instagram], ['LinkedIn', A.linkedin], ['WhatsApp', A.whatsapp]]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="f-top">
        {cols.map(([h, items]) => (
          <div key={h} className="f-col">
            <p className="f-head">{h}</p>
            <div className="f-list">{items.map((i) => <a key={i} href="#">{i}</a>)}</div>
          </div>
        ))}
        <div className="f-cta">
          <p className="f-head">Compare the details before you decide.</p>
          <Button href="#">Shop Now <Arrow src={A.arrowFooter} /></Button>
          <div className="socials">
            {socials.map(([n, s]) => <a key={n} href="#" aria-label={n}><img src={s} alt="" /></a>)}
          </div>
        </div>
      </div>
      <div className="fline"><div><img src={A.line} alt="" /></div></div>
      <div className="f-legal">
        <p>Copyright © 2026 GEN-I . All rights reserved.</p>
        <p>iPhone is a trademark of Apple Inc. GEN-I is an independent retailer.</p>
      </div>
    </footer>
  )
}
