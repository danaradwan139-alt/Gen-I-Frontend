import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Link } from 'react-router-dom'
import './CategoryStrip.css'

const cats = [
  ['iPhone', A.smartphone, '5.21% 17.71%'],
  ['Apple Watch', A.smartphone, '5.21% 17.71%'],
  ['Laptops', A.smartphone, '5.21% 17.71%'],
  ['TV & Home', A.smartphone, '5.21% 17.71%'],
  ['Home Appliances', A.smartphone, '5.21% 17.71%'],
  ['Accessories', A.audio, '0'],
]
export default function CategoryStrip() {
  return (
    <nav className="cats" aria-label="Shop by category">
      {cats.map(([l, s, inset]) => (
        <Link key={l} to={`/shop?category=${encodeURIComponent(l)}`} className="cat">
          <Icon src={s} size={48} inset={inset} />
          <span>{l}</span>
        </Link>
      ))}
    </nav>
  )
}
