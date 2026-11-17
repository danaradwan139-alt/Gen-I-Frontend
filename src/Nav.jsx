import { assets as A } from './assets.js'
import { Icon, Arrow, Button } from './ui.jsx'

const links = ['iPhone', 'Apple Watch', 'Laptops', 'TV & Home', 'Home Appliances', 'Accessories', 'Repairs', 'Business']

export default function Nav() {
  return (
    <header className="nav">
      <div className="promo">
        <p>Free two-day delivery and easy returns on every iPhone.</p>
        <Button variant="text" size="xs" className="tight" href="#">
          Shop now <Arrow src={A.arrowTint} />
        </Button>
      </div>
      <div className="bar">
        <a href="#" className="logo" aria-label="GEN-I">
          <span className="lg-a"><img src={A.logoA} alt="" /></span>
          <span className="lg-b"><img src={A.logoB} alt="" /></span>
        </a>
        <nav className="bar-links" aria-label="Main">
          {links.map((l) => <a key={l} href="#" className="link">{l}</a>)}
        </nav>
        <div className="bar-right">
          <div className="search">
            <Icon src={A.search} inset="5.21%" kind="flip" />
            <span>Find your perfect tech...</span>
          </div>
          <Button size="md" href="#">login</Button>
        </div>
      </div>
    </header>
  )
}
