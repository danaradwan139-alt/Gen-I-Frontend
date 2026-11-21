import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Link } from 'react-router-dom'
import './CategoryStrip.css'

const Glyph = ({ children }) => (
  <svg className="cat-glyph" viewBox="0 0 48 48" fill="none" stroke="#212121" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
)

const WatchGlyph = () => (
  <Glyph>
    <rect x="12" y="13" width="24" height="22" rx="7" />
    <path d="M18 13l1.5-7h9L30 13M18 35l1.5 7h9L30 35" />
  </Glyph>
)
const LaptopGlyph = () => (
  <Glyph>
    <rect x="10" y="11" width="28" height="21" rx="3" />
    <path d="M5 38h38" />
  </Glyph>
)
const ApplianceGlyph = () => (
  <Glyph>
    <path d="M30 6l-6 24M16 42h16l-3-11H19z" />
    <path d="M24 30l-7 5" />
  </Glyph>
)

const cats = [
  { label: 'iPhone', to: '/shop?category=iPhone', icon: <Icon src={A.smartphone} size={48} inset="5.21% 17.71%" /> },
  { label: 'Apple Watch', to: '/shop?category=Apple%20Watch', icon: <WatchGlyph /> },
  { label: 'Laptops', to: '/shop?category=Laptops', icon: <LaptopGlyph /> },
  { label: 'Home Appliances', to: '/shop?category=Home%20Appliances', icon: <ApplianceGlyph /> },
  { label: 'Audio', to: '/shop?category=Accessories', icon: <Icon src={A.audio} size={48} /> },
  { label: 'Repairs', to: '/#repair', icon: <Icon src={A.repair} size={48} inset="8.33%" /> },
]

export default function CategoryStrip() {
  return (
    <nav className="cats" aria-label="Shop by category">
      {cats.map(({ label, to, icon }) => (
        <Link key={label} to={to} className="cat">
          {icon}
          <span>{label}</span>
        </Link>
      ))}
    </nav>
  )
}
