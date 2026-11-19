
import { useState } from 'react'
import { Link } from 'react-router-dom'
import './ComparePage.css'

const products = [
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    badge: 'Best for photos',
    image: '/assets/iphone-16.png',
    price: 'From 69,000 EGP · In stock',
    features: [
      ['Camera', 'Advanced dual-camera system'],
      ['Display', '6.1-inch Super Retina XDR'],
      ['Chip', 'A18 chip'],
      ['Battery', 'All-day battery life'],
      ['Connector', 'USB-C'],
    ],
  },
  {
    id: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    badge: 'Pro performance',
    image: '/assets/iphone-18-pro.png',
    price: 'From 99,000 EGP · In stock',
    features: [
      ['Camera', 'Pro triple-camera system'],
      ['Display', 'Advanced Super Retina XDR'],
      ['Chip', 'Latest Pro chip'],
      ['Battery', 'Long-lasting battery life'],
      ['Connector', 'USB-C'],
    ],
  },
]

const lineup = [
  {
    id: 'iphone-air',
    name: 'iPhone Air',
    description: 'Incredibly light and thin with pro performance.',
    image: '/assets/iphone-air.png',
    theme: 'dark',
  },
  {
    id: 'iphone-18-pro',
    name: 'iPhone 18 Pro',
    description: 'Pro performance. Pro camera.',
    image: '/assets/iphone-18-pro.png',
    theme: 'light',
  },
  {
    id: 'iphone-16',
    name: 'iPhone 16',
    description: 'A great everyday iPhone.',
    image: '/assets/iphone-16.png',
    theme: 'light',
  },
]

function HeartIcon({ filled }) {
  return (
    <svg
      viewBox="0 0 40 40"
      width="40"
      height="40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M20 33.33S5 24.17 5 14.17C5 9.58 8.58 6 13.17 6C16.08 6 18.67 7.5 20 9.75C21.33 7.5 23.92 6 26.83 6C31.42 6 35 9.58 35 14.17C35 24.17 20 33.33 20 33.33Z"
        fill={filled ? '#FC3A3A' : 'none'}
        stroke="#FC3A3A"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProductCard({ product }) {
  const [isFavorite, setIsFavorite] = useState(false)
  const productPage = `/shop/${product.id}`

  return (
    <article className="compare-product-column">
      <div className="compare-product-card">
        <div className="compare-product-image">
          <img
            src={product.image}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.style.display = 'none'
            }}
          />
        </div>

        <span className="compare-product-badge">
          {product.badge}
        </span>

        <h2>{product.name}</h2>

        <p className="compare-product-price">
          {product.price}
        </p>

        <div className="compare-product-actions">
          <Link
            to={productPage}
            className="compare-action-primary"
          >
            Buy
          </Link>

          <Link
            to={productPage}
            className="compare-action-secondary"
          >
            Learn more
          </Link>

          <button
            type="button"
            className={`compare-favorite-button ${
              isFavorite ? 'is-favorite' : ''
            }`}
            onClick={() => setIsFavorite((current) => !current)}
            aria-label={
              isFavorite
                ? `Remove ${product.name} from favorites`
                : `Add ${product.name} to favorites`
            }
            aria-pressed={isFavorite}
          >
            <HeartIcon filled={isFavorite} />
          </button>
        </div>
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
      <span>Or ask the assistant to suggest one for you</span>
    </Link>
  )
}

function LineupCard({ product }) {
  return (
    <article className={`lineup-card lineup-card-${product.theme}`}>
      <div className="lineup-card-content">
        <h3>{product.name}</h3>
        <p>{product.description}</p>

        <div className="lineup-card-actions">
          <Link
            to="/compare"
            className="lineup-compare-button"
          >
            Compare
          </Link>

          <Link
            to={`/shop/${product.id}`}
            className="lineup-buy-button"
          >
            Buy
          </Link>
        </div>
      </div>

      <div className="lineup-card-image">
        <img src={product.image} alt={product.name} />
      </div>
    </article>
  )
}

function ComparePage() {
  const followups = [
    'Which has the better camera?',
    'Which one has better battery?',
    'Show me the main differences',
  ]

  const sendAssistantMessage = (message) => {
    window.dispatchEvent(
      new CustomEvent('open-assistant', {
        detail: { message },
      })
    )
  }

  return (
    <main className="compare-page">
      <section className="compare-header">
        <div className="compare-breadcrumbs">
          <Link to="/shop">Shop</Link>
          <span className="breadcrumb-arrow">›</span>
          <span className="breadcrumb-current">Compare</span>
        </div>

        <button
          className="compare-assistant-prompt"
          type="button"
          onClick={() =>
            sendAssistantMessage(
              'Help me compare iPhone 16 and iPhone 18 Pro'
            )
          }
        >
          <span className="compare-assistant-avatar">✦</span>
          <span>Ask anything about these iPhone models...</span>
        </button>

        <h1>iPhone 16 vs iPhone 18 Pro</h1>
      </section>

      <section className="compare-summary-wrap">
        <div className="compare-assistant-summary">
          <div className="compare-summary-title">
            <span className="compare-assistant-avatar">✦</span>
            <h2>Our take for you</h2>
          </div>

          <p>
            Choose iPhone 16 for a great everyday experience.
            Choose iPhone 18 Pro if you want a more advanced camera
            system and pro-level performance.
          </p>

          <div className="compare-followups">
            {followups.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendAssistantMessage(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>
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
        <div className="lineup-heading">
          <h2>The lineup.</h2>

          <Link to="/shop" className="lineup-shop-link">
            Shop all iPhone models <span>→</span>
          </Link>
        </div>

        <div className="lineup-grid">
          {lineup.map((product) => (
            <LineupCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  )
}

export default ComparePage
