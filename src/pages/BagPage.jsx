
import { Link } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'
import './store.css'

export default function BagPage() {
  const { items, updateQuantity, removeFromCart } = useCart()

  const bagItems = items
    .map((item) => {
      const product = products.find(
        (entry) => entry.id === item.productId
      )

      const variant = product?.variants.find(
        (entry) => entry.id === item.variantId
      )

      if (!product || !variant) return null

      return { ...item, product, variant, image: getIphoneImage(product) || product.image }
    })
    .filter(Boolean)

  const total = bagItems.reduce(
    (sum, item) => sum + item.variant.price * item.quantity,
    0
  )

  if (bagItems.length === 0) {
    return (
      <section className="store-page" aria-labelledby="bag-title">
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">Shopping bag</span>
        </nav>

        <div className="catalog-message">
          <h1 id="bag-title">Your bag is empty</h1>
          <p>Browse the GEN-I catalog to find your next favorite.</p>
          <Link className="store-button" to="/shop">
            Browse the store
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className="store-page" aria-labelledby="bag-title">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">Shopping bag</span>
      </nav>

      <h1 id="bag-title">Your shopping bag</h1>

      <div className="bag-items">
        {bagItems.map((item) => (
          <article
            className="bag-item"
            key={`${item.productId}-${item.variantId}`}
          >
            <div className="bag-item-image">
              {item.image ? (
                <img src={item.image} alt={item.product.name} />
              ) : (
                <span>{item.product.name}</span>
              )}
            </div>

            <div className="bag-item-details">
              <h2>{item.product.name}</h2>
              <p>{item.variant.label}</p>
              <p>{formatPrice(item.variant.price)} each</p>

              <div className="bag-quantity">
                <button
                  type="button"
                  aria-label={`Decrease ${item.product.name} quantity`}
                  disabled={item.quantity <= 1}
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.variantId,
                      item.quantity - 1
                    )
                  }
                >
                  −
                </button>

                <span>{item.quantity}</span>

                <button
                  type="button"
                  aria-label={`Increase ${item.product.name} quantity`}
                  disabled={item.quantity >= item.variant.stock}
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.variantId,
                      Math.min(item.quantity + 1, item.variant.stock)
                    )
                  }
                >
                  +
                </button>
              </div>

              <button
                className="bag-remove"
                type="button"
                onClick={() =>
                  removeFromCart(item.productId, item.variantId)
                }
              >
                Remove
              </button>
            </div>

            <strong className="bag-item-total">
              {formatPrice(item.variant.price * item.quantity)}
            </strong>
          </article>
        ))}
      </div>

      <div className="bag-summary">
        <p>
          <span>Subtotal</span>
          <strong>{formatPrice(total)}</strong>
        </p>
        <p className="catalog-notice">
          Demo bag: prices and stock are sample data. Checkout is not connected.
        </p>
        <Link className="store-button" to="/shop">
          Continue shopping
        </Link>
      </div>
    </section>
  )
}
