import { products } from '@/data/products'
import { ProductCard, ProductGrid } from '@/components/shop/ProductCard'
import './section.css'
import './Featured.css'

// Same card as the Shop and Product pages (components/shop/ProductCard).
const featuredIds = ['iphone-16', 'samsung-qled-55', 'philips-hue-starter-kit', 'lg-front-load-washer']
const picked = featuredIds.map((id) => products.find((item) => item.id === id)).filter(Boolean)
// If any featured id is missing from the data, fill up to 4 with other products
const featured = [...picked, ...products.filter((p) => !picked.includes(p) && p.variants?.length)].slice(0, 4)

export default function Featured() {
  return (
    <section className="sec feat">
      <div>
        <h2 className="t40">Featured this week</h2>
        <p className="featured-demo-note">Sample catalog prices and availability.</p>
      </div>
      <ProductGrid>
        {featured.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </ProductGrid>
    </section>
  )
}
