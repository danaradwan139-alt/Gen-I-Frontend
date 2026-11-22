import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'
import { useConfirm } from '@/context/ConfirmContext'
import { assets as A } from '@/assets/assets'
import { Button } from '@/components/ui/Button'
import { Check } from '@/components/ui/Check'
import { Arrow } from '@/components/ui/Icon'
import './BagPage.css'

const INSTALLMENT_MONTHS = 12
const reassurances = ['Secure checkout', 'Free 14‑day returns', 'Official warranty']

function resolve(item) {
  const product = products.find((p) => p.id === item.productId)
  const variant = product?.variants.find((v) => v.id === item.variantId)
  if (!product || !variant) return null
  return { ...item, product, variant, image: getIphoneImage(product) || product.image }
}

export default function BagPage() {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart()
  const [saved, setSaved] = useState([])
  const confirm = useConfirm()

  async function confirmRemove(item) {
    const ok = await confirm({
      title: 'Remove from your bag?',
      message: `${item.product.name} (${item.variant.label}) will be taken out of your bag.`,
      confirmLabel: 'Remove',
      cancelLabel: 'Keep it',
    })
    if (ok) removeFromCart(item.productId, item.variantId)
  }

  const bagItems = items.map(resolve).filter(Boolean)
  const savedItems = saved.map(resolve).filter(Boolean)
  const count = bagItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = bagItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

  function saveForLater(item) {
    setSaved((current) => [...current.filter((s) => !(s.productId === item.productId && s.variantId === item.variantId)), { productId: item.productId, variantId: item.variantId, quantity: 1 }])
    removeFromCart(item.productId, item.variantId)
  }

  function moveToBag(item) {
    if (addToCart(item.product, item.variant)) {
      setSaved((current) => current.filter((s) => !(s.productId === item.productId && s.variantId === item.variantId)))
    }
  }

  return (
    <div className="bag-page">
      <section className="bag-header">
        <h1 className="bag-title">Your bag.</h1>
        <p className="bag-sub">Every model, every color — with 0% installments and next‑day delivery.</p>
      </section>

      {bagItems.length === 0 ? (
        <section className="bag-body">
          <div className="bag-empty">
            <h2>Your bag is empty</h2>
            <p>Browse the GEN-I catalog to find your next favorite.</p>
            <Button to="/shop">Browse the store</Button>
          </div>
        </section>
      ) : (
        <section className="bag-body" aria-label="Bag contents">
          <div className="bag-items">
            {bagItems.map((item) => (
              <article className="bag-row" key={`${item.productId}-${item.variantId}`}>
                <Link to={`/shop/${item.productId}`} className="bag-thumb" aria-label={item.product.name}>
                  {item.image ? <img src={item.image} alt="" /> : <span>{item.product.name}</span>}
                </Link>

                <div className="bag-info">
                  <h2>{item.product.name}</h2>
                  <p className="bag-variant">{item.variant.label}</p>
                  <p className={item.variant.stock > 0 ? 'bag-stock' : 'bag-stock is-out'}>
                    {item.variant.stock > 0 ? 'In stock · Delivers tomorrow' : 'Out of stock'}
                  </p>
                  <div className="bag-links">
                    <Button variant="text" size="xs" className="tight" onClick={() => saveForLater(item)}>Save for later</Button>
                    <Button variant="danger-text" size="xs" className="tight" onClick={() => confirmRemove(item)}>Remove</Button>
                  </div>
                </div>

                <div className="bag-right">
                  <p className="bag-price">{formatPrice(item.variant.price * item.quantity)}</p>
                  <div className="qty-stepper" role="group" aria-label={`${item.product.name} quantity`}>
                    <button
                      type="button"
                      aria-label={`Decrease ${item.product.name} quantity`}
                      disabled={item.quantity <= 1}
                      onClick={() => updateQuantity(item.productId, item.variantId, item.quantity - 1)}
                    >
                      −
                    </button>
                    <span aria-live="polite">{item.quantity}</span>
                    <button
                      type="button"
                      aria-label={`Increase ${item.product.name} quantity`}
                      disabled={item.quantity >= item.variant.stock}
                      onClick={() => updateQuantity(item.productId, item.variantId, Math.min(item.quantity + 1, item.variant.stock))}
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            ))}

            {savedItems.length > 0 && (
              <div className="bag-saved">
                <h2>Saved for later</h2>
                {savedItems.map((item) => (
                  <div className="bag-saved-row" key={`${item.productId}-${item.variantId}`}>
                    <span>{item.product.name} · {item.variant.label}</span>
                    <Button variant="outline-teal" size="xs" onClick={() => moveToBag(item)}>Move to bag</Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <aside className="bag-summary" aria-labelledby="summary-title">
            <h2 id="summary-title">Order summary</h2>
            <dl className="bag-lines">
              <div><dt>Subtotal ({count} {count === 1 ? 'item' : 'items'})</dt><dd>{formatPrice(total)}</dd></div>
              <div><dt>Delivery</dt><dd className="is-free">Free</dd></div>
            </dl>
            <hr className="bag-divider" />
            <div className="bag-total">
              <span>Total</span>
              <strong>{formatPrice(total)}</strong>
            </div>
            <p className="bag-installments">
              or {formatPrice(Math.ceil(total / INSTALLMENT_MONTHS))}/month for {INSTALLMENT_MONTHS} months at 0%
            </p>

            <Button className="block bag-checkout" to="/checkout">
              Checkout <Arrow src={A.arrowWhite} />
            </Button>

            <ul className="bag-checks">
              {reassurances.map((r) => (
                <li key={r}><Check />{r}</li>
              ))}
            </ul>
          </aside>
        </section>
      )}
    </div>
  )
}
