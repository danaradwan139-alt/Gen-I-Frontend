import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'
import { Button } from '@/components/ui/Button'
import { HeartButton } from '@/components/ui/Heart'
import { useFavorites } from '@/hooks/useFavorites'
import './ProductCard.css'

// Product card from the Figma "7 Shop – Category" frame, shared by the Shop page and the Product page.
// Buy adds the first in-stock variant to the bag and opens the "Pair it with" popup (prototype 7.1).

function Stepper({ value, min = 0, max, onChange, name }) {
  return (
    <div className="qty-stepper" role="group" aria-label={`${name} quantity`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= min} aria-label={`Decrease ${name}`}>−</button>
      <span aria-live="polite">{value}</span>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= max} aria-label={`Increase ${name}`}>+</button>
    </div>
  )
}

// Prototype 7.1: "Buy" → OVERLAY "Pair it with" (DISSOLVE 300ms ease-out) → "Buy now" goes to the bag.
function PairPopup({ product, onClose }) {
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const panelRef = useRef(null)

  const accessories = useMemo(
    () =>
      products
        .filter((p) => p.category === 'Accessories' && p.variants.some((v) => v.stock > 0))
        .slice(0, 2),
    []
  )
  const [qty, setQty] = useState(() => Object.fromEntries(accessories.map((a) => [a.id, 0])))

  useEffect(() => {
    panelRef.current?.focus()
    const onKey = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function buyNow() {
    accessories.forEach((accessory) => {
      const variant = accessory.variants.find((v) => v.stock > 0)
      for (let i = 0; i < (qty[accessory.id] || 0); i += 1) addToCart(accessory, variant)
    })
    navigate('/bag')
  }

  return (
    <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div
        className="overlay-panel pair-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pair-title"
        tabIndex={-1}
        ref={panelRef}
      >
        <div className="pair-head">
          <h2 id="pair-title">Pair it with</h2>
          <button type="button" className="pair-close" onClick={onClose} aria-label="Close">×</button>
        </div>

        <p className="pair-added" role="status">{product.name} was added to your bag.</p>

        {accessories.length > 0 && (
          <div className="pair-list">
            {accessories.map((accessory) => {
              const variant = accessory.variants.find((v) => v.stock > 0)
              const image = accessory.image
              return (
                <div className="pair-item" key={accessory.id}>
                  <div className="pair-thumb">
                    {image ? <img src={image} alt="" /> : <span>{accessory.name}</span>}
                  </div>
                  <div className="pair-info">
                    <p className="pair-name">{accessory.name}</p>
                    <p className="pair-sub">{variant.label}</p>
                    <p className="pair-stock">In stock</p>
                  </div>
                  <div className="pair-right">
                    <p className="pair-price">{formatPrice(variant.price)}</p>
                    <Stepper
                      name={accessory.name}
                      value={qty[accessory.id]}
                      max={variant.stock}
                      onChange={(value) => setQty((current) => ({ ...current, [accessory.id]: value }))}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <Button className="block" onClick={buyNow}>Buy now</Button>
      </div>
    </div>
  )
}

export function ProductCard({ product, variants = product.variants, index = 0 }) {
  const { addToCart } = useCart()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [pairOpen, setPairOpen] = useState(false)
  const [notice, setNotice] = useState('')

  const from = Math.min(...variants.map((v) => v.price))
  const inStock = variants.some((v) => v.stock > 0)
  const image = getIphoneImage(product) || product.image
  const saved = isFavorite(product.id)

  function handleBuy() {
    const variant = variants.find((v) => v.stock > 0)
    if (!variant || !addToCart(product, variant)) {
      setNotice('Out of stock or stock limit reached.')
      return
    }
    setNotice('')
    setPairOpen(true)
  }

  return (
    <article className="shop-card" style={{ '--i': index }}>
      <Link to={`/shop/${product.id}`} className="shop-card-phone" aria-label={product.name}>
        {image ? <img src={image} alt="" loading="lazy" /> : <span>{product.name}</span>}
      </Link>
      {product.badge && <span className="badge">{product.badge}</span>}
      <h3>{product.name}</h3>
      <p className="shop-card-meta">
        From {formatPrice(from)}<span aria-hidden="true">·</span>{inStock ? 'In stock' : 'Out of stock'}
      </p>
      <div className="shop-card-actions">
        <Button className="block shop-buy" onClick={handleBuy} disabled={!inStock}>Buy</Button>
        <div className="shop-card-row">
          <Button variant="outline-teal" className="shop-reserve" to={`/shop/${product.id}?method=pickup`}>
            Reserve in store
          </Button>
          <HeartButton
            pressed={saved}
            onToggle={() => toggleFavorite(product.id)}
            label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          />
        </div>
        {notice && <p className="shop-card-notice" role="status">{notice}</p>}
      </div>
      {/* Portal: the card's hover transform would otherwise trap the fixed overlay inside the card */}
      {pairOpen && createPortal(<PairPopup product={product} onClose={() => setPairOpen(false)} />, document.body)}
    </article>
  )
}

// Responsive grid of cards: 3 across at 1440, 2 on phones.
export function ProductGrid({ children }) {
  return <div className="shop-grid">{children}</div>
}
