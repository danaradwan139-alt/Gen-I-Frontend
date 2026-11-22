
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'
import { useConfirm } from '@/context/ConfirmContext'
import './BagPage.css'

export default function BagPage() {
  const { items, addToCart, updateQuantity, removeFromCart } = useCart()
  const [saved, setSaved] = useState([])

  const bagItems = items.map(resolve).filter(Boolean)
  const savedItems = saved.map(resolve).filter(Boolean)
  const count = bagItems.reduce((sum, item) => sum + item.quantity, 0)
  const total = bagItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0)

  function saveForLater(item) {
    setSaved((current) => [
      ...current.filter(
        (s) =>
          !(s.productId === item.productId && s.variantId === item.variantId)
      ),
      {
        productId: item.productId,
        variantId: item.variantId,
        quantity: 1,
      },
    ])

    removeFromCart(item.productId, item.variantId)
  }

  function moveToBag(item) {
    if (addToCart(item.product, item.variant)) {
      setSaved((current) =>
        current.filter(
          (s) =>
            !(s.productId === item.productId && s.variantId === item.variantId)
        )
      )
    }
  }

  return (
    <div className="bag-page">
      <section className="bag-header">
        <h1 className="bag-title">Your bag.</h1>
        <p className="bag-sub">
          Every model, every color — with 0% installments and next-day delivery.
        </p>
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
              <article
                className="bag-row"
                key={`${item.productId}-${item.variantId}`}
              >
                <Link
                  to={`/shop/${item.productId}`}
                  className="bag-thumb"
                  aria-label={item.product.name}
                >
                  {item.image ? (
                    <img src={item.image} alt="" />
                  ) : (
                    <span>{item.product.name}</span>
                  )}
                </Link>

                <div className="bag-info">
                  <h2>{item.product.name}</h2>

                  <p className="bag-variant">{item.variant.label}</p>

                  <p
                    className={
                      item.variant.stock > 0
                        ? 'bag-stock'
                        : 'bag-stock is-out'
                    }
                  >
                    {item.variant.stock > 0
                      ? 'In stock · Delivers tomorrow'
                      : 'Out of stock'}
                  </p>

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

                  <div className="bag-links">
                    <Button
                      variant="text"
                      size="xs"
                      className="tight"
                      onClick={() => saveForLater(item)}
                    >
                      Save for later
                    </Button>

                    <Button
                      variant="danger-text"
                      size="xs"
                      className="tight"
                      onClick={() =>
                        removeFromCart(item.productId, item.variantId)
                      }
                    >
                      Remove
                    </Button>
                  </div>
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
      )}
    </div>
  )
}
