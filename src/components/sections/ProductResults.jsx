import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { Dropdown } from '@/components/ui/Dropdown'
import './ProductResults.css'

function toCard(item) {
  const prices = item.variants?.map((v) => v.price)
  const stock = item.variants?.reduce((t, v) => t + v.stock, 0)
  return {
    id: item.id,
    name: item.name,
    image: getIphoneImage(item) || item.image,
    price: prices ? Math.min(...prices) : item.price,
    inStock: stock === undefined ? item.inStock : stock > 0,
  }
}

function ProductCard({ item }) {
  return (
    <article className="result-card">
      <Link className="result-phone" to={`/shop/${item.id}`} aria-label={item.name}>
        {item.image && <img src={item.image} alt="" />}
      </Link>
      <span className="result-badge">Best for photos</span>
      <h3>{item.name}</h3>
      <p>
        From {formatPrice(item.price)} · {item.inStock ? 'In stock' : 'Out of stock'}
      </p>
      <div className="result-actions">
        <Link className="result-view" to={`/shop/${item.id}`}>View</Link>
        <button
          type="button"
          className="result-compare"
          onClick={() => window.alert('Product comparison will be available soon.')}
        >
          Compare
        </button>
      </div>
    </article>
  )
}

export default function ProductResults({ currentProduct = {} }) {
  const [sort, setSort] = useState('featured')

  let cards = products
    .map(toCard)
    .filter((card) => card.id !== currentProduct.id && card.name !== currentProduct.name)
    .slice(0, 6)

  if (sort === 'price') cards = [...cards].sort((a, b) => a.price - b.price)

  return (
    <section className="results">
      <div className="results-toolbar">
        <h2>{cards.length} products</h2>
        <div className="results-sort">
          <span aria-hidden="true">Sort by</span>
          <Dropdown
            variant="pill"
            aria-label="Sort by"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'price', label: 'Price: low to high' },
            ]}
          />
        </div>
      </div>

      <div className="results-grid">
        {cards.map((item) => (
          <ProductCard item={item} key={item.id} />
        ))}
      </div>
    </section>
  )
}