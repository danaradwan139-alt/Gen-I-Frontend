import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Link } from 'react-router-dom'
import { formatPrice, products } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import './section.css'
import './Featured.css'

const featuredIds = ['iphone-16', 'samsung-qled-55', 'philips-hue-starter-kit', 'lg-front-load-washer']
const featured = featuredIds.map((id) => products.find((item) => item.id === id)).filter(Boolean)
export default function Featured() {
  return (
    <section className="sec feat">
      <div>
        <h2 className="t40">Featured this week</h2>
        <p className="featured-demo-note">Sample catalog prices and availability.</p>
      </div>
      <div className="products">
        {featured.map((item) => {
          const image = getIphoneImage(item) || item.image

          return (
            <article key={item.id} className="product">
            <Link to={`/shop/${item.id}`} className="phone" aria-label={`View ${item.name}`}>
              {image ? <img src={image} alt={item.name} /> : <span className="featured-art">{item.category}</span>}
            </Link>
            <Badge>New</Badge>
            <h3 className="t20">{item.name}</h3>
            <p className="stock">
              <Icon src={A.ellipse} size={8} />
              {item.variants.reduce((total, variant) => total + variant.stock, 0) > 0
                ? 'In stock'
                : 'Out of stock'}
            </p>
            <p className="price">From {formatPrice(Math.min(...item.variants.map((variant) => variant.price)))}</p>
            <div className="btns">
              <Button className="block" href={`/shop/${item.id}`}>View details</Button>
              <Button variant="outline-teal" className="block" href={`/shop/${item.id}#store-info-title`}>Store availability</Button>
            </div>
          </article>
          )
        })}
      </div>
    </section>
  )
}
