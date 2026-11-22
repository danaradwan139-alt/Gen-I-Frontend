
import { Link } from 'react-router-dom'
import './ComparePage.css'

const products = [
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    subtitle: 'A great everyday iPhone.',
    image: '/assets/iphone-16.png',
    price: 'From $699',
    colors: ['#9bb9d5', '#d6b5a7', '#a9b9a6', '#242424'],
    features: [
      ['Display', '6.1-inch Super Retina XDR'],
      ['Chip', 'A18 chip'],
      ['Camera', 'Advanced dual-camera system'],
      ['Battery', 'All-day battery life'],
      ['Connector', 'USB-C'],
    ],
  },
  {
    id: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    subtitle: 'Pro performance. Pro camera.',
    image: '/assets/iphone-18-pro.png',
    price: 'From $999',
    colors: ['#b7a08b', '#343434', '#d5d5d5'],
    features: [
      ['Display', 'Advanced Super Retina XDR'],
      ['Chip', 'Latest Pro chip'],
      ['Camera', 'Pro camera system'],
      ['Battery', 'Long-lasting battery life'],
      ['Connector', 'USB-C'],
    ],
  },
]

const lineup = [
  {
    id: 'iphone-air',
    name: 'iPhone Air',
    image: '/assets/iphone-air.png',
    description: 'Thin. Light. Powerful.',
    link: '/shop',
  },
]

function ProductImage({ src, alt }) {
  return (
    <div className="compare-product-image">
      <img
        src={src}
        alt={alt}
        onError={(event) => {
          event.currentTarget.style.display = 'none'
        }}
      />
    </div>
  )
}

function ProductCard({ product }) {
  return (
    <article className="compare-product-card">
      <ProductImage src={product.image} alt={product.name} />

      <div className="compare-product-info">
        <p className="compare-eyebrow">GEN-I COMPARE</p>
        <h2>{product.name}</h2>
        <p className="compare-product-subtitle">{product.subtitle}</p>

        <div className="compare-colors" aria-label="Available colors">
          {product.colors.map((color) => (
            <span
              key={color}
              className="compare-color"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        <p className="compare-price">{product.price}</p>

        <Link to={`/shop/${product.id}`} className="compare-buy-link">
          View details <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div className="compare-features">
        {product.features.map(([label, value]) => (
          <div className="compare-feature" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </div>
        ))}
      </div>
    </article>
  )
}

function AddModelCard() {
  return (
    <Link to="/shop" className="compare-add-card">
      <span className="compare-add-icon">+</span>
      <strong>Add a model</strong>
      <span>Choose another iPhone to compare</span>
    </Link>
  )
}

function ComparePage() {
  return (
    <main className="compare-page">
      <section className="compare-intro">
        <p className="compare-eyebrow">FIND YOUR PERFECT IPHONE</p>
        <h1>Compare iPhone models.</h1>
        <p>
          See the differences, explore the features, and find the iPhone
          that is right for you.
        </p>
      </section>

      <section className="compare-summary">
        <div>
          <span className="compare-summary-number">01</span>
          <span>Choose your models</span>
        </div>
        <div>
          <span className="compare-summary-number">02</span>
          <span>Compare the features</span>
        </div>
        <div>
          <span className="compare-summary-number">03</span>
          <span>Find your iPhone</span>
        </div>
      </section>

      <section className="compare-models">
        <div className="compare-section-heading">
          <div>
            <p className="compare-eyebrow">SIDE BY SIDE</p>
            <h2>Which iPhone is right for you?</h2>
          </div>
          <p>Compare models and discover the differences.</p>
        </div>

        <div className="compare-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
          <AddModelCard />
        </div>
      </section>

      <section className="compare-lineup">
        <div className="compare-section-heading">
          <div>
            <p className="compare-eyebrow">EXPLORE THE LINEUP</p>
            <h2>There’s an iPhone for everyone.</h2>
          </div>
          <Link to="/shop" className="compare-text-link">
            Shop all iPhone models →
          </Link>
        </div>

        <div className="compare-lineup-grid">
          {lineup.map((product) => (
            <article className="compare-lineup-card" key={product.id}>
              <div className="compare-lineup-image">
                <img src={product.image} alt={product.name} />
              </div>
              <div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <Link to={product.link}>Explore {product.name} →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="compare-bottom-cta">
        <p className="compare-eyebrow">READY TO FIND YOURS?</p>
        <h2>Your next iPhone is waiting.</h2>
        <p>Explore the collection and find the one that fits your life.</p>
        <Link to="/shop" className="compare-cta-button">
          Shop iPhone
        </Link>
      </section>
    </main>
  )
}

export default ComparePage
