import { Link } from 'react-router-dom'
import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { HeartButton } from '@/components/ui/Heart'
import { useFavorites } from '@/hooks/useFavorites'
import './ComparePage.css'

// features: [label, value, optional badge]
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
      ['Camera', 'Pro triple-camera system', 'Better for photos'],
      ['Display', 'Advanced Super Retina XDR'],
      ['Chip', 'Latest Pro chip'],
      ['Battery', 'Long-lasting battery life'],
      ['Connector', 'USB-C'],
    ],
  },
]

const lineup = [
  { id: 'iphone-air', name: 'iPhone Air', description: 'Incredibly light and thin with pro performance.', image: '/assets/iphone-air.png', theme: 'dark' },
  { id: 'iphone-18-pro', name: 'iPhone 18 Pro', description: 'Pro performance. Pro camera.', image: '/assets/iphone-18-pro.png', theme: 'light' },
  { id: 'iphone-16', name: 'iPhone 16', description: 'A great everyday iPhone.', image: '/assets/iphone-16.png', theme: 'light' },
]

const followups = ['Which has the better camera?', 'Which one has better battery?', 'Show me the main differences']

function askAssistant(message) {
  window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } }))
}

function ModelColumn({ product }) {
  const { isFavorite: isSaved, toggleFavorite } = useFavorites()
  const isFavorite = isSaved(product.id)
  const productPage = `/shop/${product.id}`

  return (
    <article className="cmp-column">
      <div className="cmp-card">
        <div className="cmp-phone">
          <img src={product.image} alt={product.name} onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
        <span className="badge">{product.badge}</span>
        <h2>{product.name}</h2>
        <p className="cmp-price">{product.price}</p>
        <div className="cmp-actions">
          <Button to={productPage}>Buy</Button>
          <Button variant="outline-teal" to={`${productPage}?method=pickup`}>Reserve in store</Button>
          <HeartButton
            pressed={isFavorite}
            onToggle={() => toggleFavorite(product.id)}
            label={isFavorite ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          />
        </div>
      </div>

      <dl className="cmp-options">
        {product.features.map(([label, value, badge]) => (
          <div className="cmp-option" key={label}>
            <dt>{label}</dt>
            <dd>
              <span>{value}</span>
              {badge && <span className="badge">{badge}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function AddModelCard() {
  return (
    <Link to="/shop" className="cmp-add">
      <span className="cmp-add-icon" aria-hidden="true">+</span>
      <strong>Add a model</strong>
      <span>Or ask the assistant to suggest one for you</span>
    </Link>
  )
}

function LineupCard({ product }) {
  return (
    <article className={`lineup-card is-${product.theme}`}>
      <div className="lineup-copy">
        <h3>{product.name}</h3>
        <p>{product.description}</p>
        <div className="lineup-actions">
          <Button size="md" variant={product.theme === 'dark' ? 'outline-white' : 'outline-teal'} to="/compare">Compare</Button>
          <Button size="md" to={`/shop/${product.id}`}>Buy</Button>
        </div>
      </div>
      <div className="lineup-image">
        <img src={product.image} alt={product.name} />
      </div>
    </article>
  )
}

export default function ComparePage() {
  return (
    <div className="cmp-page">
      <section className="cmp-header">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/shop" className="crumb-link">
            Shop <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" />
          </Link>
          <span aria-current="page">Compare</span>
        </nav>

        <button type="button" className="assistant-pill" onClick={() => askAssistant('Help me compare iPhone 16 and iPhone 18 Pro')}>
          <Avatar />
          <span>Ask anything about these iPhone models…</span>
        </button>

        <h1 className="cmp-title">iPhone 16 vs iPhone 18 Pro</h1>
      </section>

      <section className="cmp-summary">
        <div className="assistant-box">
          <div className="assistant-box-title">
            <Avatar />
            <h2>Our take for you</h2>
          </div>
          <p>
            Choose iPhone 16 for a great everyday experience. Choose iPhone 18 Pro if you want a more advanced
            camera system and pro-level performance.
          </p>
          <div className="assistant-box-chips">
            {followups.map((prompt) => (
              <button key={prompt} type="button" className="chip" onClick={() => askAssistant(prompt)}>{prompt}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="cmp-models" aria-label="Side by side">
        {products.map((product) => <ModelColumn key={product.id} product={product} />)}
        <AddModelCard />
      </section>

      <section className="cmp-lineup">
        <div className="cmp-lineup-head">
          <h2>The lineup.</h2>
          <Button variant="text" size="md" to="/shop">
            Shop all iPhone models <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" />
          </Button>
        </div>
        <div className="cmp-lineup-grid">
          {lineup.map((product) => <LineupCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  )
}
