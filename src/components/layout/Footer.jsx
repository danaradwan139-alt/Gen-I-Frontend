import { assets as A } from '@/assets/assets'
import { Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Link } from 'react-router-dom'
import './footer.css'

const cols = [
  ['Shop', ['iPhone', 'Apple Watch', 'Laptops', 'TV & Home', 'Home Appliances', 'Audio & Accessories']],
  ['Services', ['iPhone Repair', 'Trade In', 'Installments', 'Setup Help', 'Delivery']],
  ['Stores', ['Find a Store', 'Opening Hours', 'Book a Repair']],
]
const socials = [['Facebook', A.facebook], ['Instagram', A.instagram], ['LinkedIn', A.linkedin], ['WhatsApp', A.whatsapp]]
const sectionPaths = {
  'iPhone Repair': '/#repair',
  'Trade In': '/#trade-in',
  Installments: '/#installments',
  'Setup Help': '/#setup-help',
  Delivery: '/#delivery',
  'Find a Store': '/#stores',
  'Opening Hours': '/#stores',
  'Book a Repair': '/#repair',
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="f-top">
        {cols.map(([h, items]) => (
          <div key={h} className="f-col">
            <p className="f-head">{h}</p>
            <div className="f-list">
              {items.map((item) => {
                const path = h === 'Shop'
                  ? `/shop?category=${encodeURIComponent(item === 'Audio & Accessories' ? 'Accessories' : item)}`
                  : sectionPaths[item]
                return <Link key={item} to={path}>{item}</Link>
              })}
            </div>
          </div>
        ))}
        <div className="f-cta">
          <p className="f-head">Compare the details before you decide.</p>
          <Button href="/shop">Shop Now <Arrow src={A.arrowFooter} /></Button>
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
