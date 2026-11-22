import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { products, formatPrice } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'
import AssistantSummary from '@/components/sections/AssistantSummary'
import ProductResults from '@/components/sections/ProductResults'
import './ProductPage.css'

function CheckIcon() {
  return (
    <span className="detail-check-icon">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 8.2 6.5 11l6-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

function TruckIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M3 8h17v15H3zM20 13h5l4 5v5h-9z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx="9" cy="24" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="24" cy="24" r="2.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function StoreIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M5 13h22l-2-8H7l-2 8Zm2 0v14h18V13M12 27v-8h8v8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  )
}

function ProductDetails() {
  const [activeTab, setActiveTab] = useState('Specifications')
  const tabs = ['Overview', 'Specifications', 'In the box', 'Reviews']

  const specs = [
    { label: 'Display', value: 'Product display details' },
    { label: 'Processor', value: 'Processor details' },
    { label: 'Camera', value: 'Camera details' },
    { label: 'Battery', value: 'Battery details' },
    { label: 'Storage', value: 'Available storage options' },
    { label: 'Connectivity', value: 'Connectivity details' },
  ]

  return (
    <section className="product-details-section">
      <div className="product-details-tabs" role="tablist" aria-label="Product details">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            className={`product-details-tab ${activeTab === tab ? 'is-active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="product-spec-grid">
        {activeTab === 'Specifications' ? (
          specs.map((spec) => (
            <div className="product-spec-item" key={spec.label}>
              <span className="product-spec-label">{spec.label}</span>
              <strong className="product-spec-value">{spec.value}</strong>
            </div>
          ))
        ) : (
          <div className="product-details-tab-content">
            {activeTab === 'Overview' && 'Product overview information will appear here.'}
            {activeTab === 'In the box' && 'Box contents information will appear here.'}
            {activeTab === 'Reviews' && 'Customer reviews will appear here when available.'}
          </div>
        )}
      </div>
    </section>
  )
}

export default function ProductPage() {
  const { productId } = useParams()
  const product = products.find((item) => item.id === productId)

  const [selectedVariantId, setSelectedVariantId] = useState('')
  const [purchaseMethod, setPurchaseMethod] = useState('delivery')
  const [saved, setSaved] = useState(false)
  const [cartFeedback, setCartFeedback] = useState(null)
  const { addToCart } = useCart()

  useEffect(() => {
    setSelectedVariantId(product?.variants?.[0]?.id || '')
    setPurchaseMethod('delivery')
    setSaved(false)
    setCartFeedback(null)
  }, [productId, product])

  if (!product) {
    return (
      <section className="product-not-found">
        <h1>Product not found</h1>
        <p>We couldn't find this product in the current catalog.</p>
        <a href="/shop">Back to shop</a>
      </section>
    )
  }

  const productImage = getIphoneImage(product) || product.image
  const selectedVariant =
    product.variants.find((variant) => variant.id === selectedVariantId) || product.variants[0]

  const colors = [...new Set(product.variants.map((variant) => variant.color))]
  const storageOptions = product.variants

  function handleAddToBag() {
    const added = addToCart(product, selectedVariant)
    setCartFeedback(
      added
        ? { type: 'success', message: `${product.name} added to your bag.` }
        : { type: 'error', message: 'This variant is out of stock or its stock limit has been reached.' }
    )
  }

  function handleCompare() {
    window.alert('Product comparison will be available soon.')
  }

  return (
    <main className="product-detail-page">
      <AssistantSummary />

      <div className="product-detail-layout">
        <section className="product-gallery" aria-label="Product images">
          <div className="product-main-image">
            {productImage ? (
              <img src={productImage} alt={product.name} />
            ) : (
              <div className="product-detail-placeholder">{product.name}</div>
            )}
          </div>

          <div className="product-thumbnails">
            <button type="button" className="product-thumbnail is-active" aria-label="Selected product image">
              {productImage ? <img src={productImage} alt="" /> : <span>{product.name}</span>}
            </button>
          </div>
        </section>

        <section className="product-info">
          <span className="product-detail-badge">Best for photos</span>

          <h1 className="product-detail-title">{product.name}</h1>

          <div className="product-detail-price">
            <strong>From {formatPrice(selectedVariant.price)}</strong>
            <span>Price shown for the selected storage and finish</span>
          </div>

          <div className="product-detail-divider" />

          <section className="product-choice-section">
            <div className="product-choice-heading">
              <h2>Finish</h2>
              <span>{selectedVariant.color}</span>
            </div>

            <div className="product-color-options">
              {colors.map((color) => {
                const colorVariant = product.variants.find((variant) => variant.color === color)
                const isSelected = selectedVariant.color === color

                return (
                  <button
                    key={color}
                    type="button"
                    className={`product-color-swatch ${isSelected ? 'is-selected' : ''}`}
                    style={{
                      '--swatch-color':
                        color.toLowerCase() === 'black'
                          ? '#212121'
                          : color.toLowerCase() === 'teal'
                            ? '#65B8B0'
                            : '#C9C7C2',
                    }}
                    aria-label={`Select ${color}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedVariantId(colorVariant.id)
                      setCartFeedback(null)
                    }}
                  >
                    <span />
                  </button>
                )
              })}
            </div>
          </section>

          <section className="product-choice-section">
            <h2>Storage</h2>

            <div className="product-storage-options">
              {storageOptions.map((variant) => {
                const isSelected = selectedVariant.id === variant.id

                return (
                  <button
                    key={variant.id}
                    type="button"
                    className={`product-storage-option ${isSelected ? 'is-selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelectedVariantId(variant.id)
                      setCartFeedback(null)
                    }}
                  >
                    <strong>{variant.storage}</strong>
                    <span>{variant.color}</span>
                  </button>
                )
              })}
            </div>
          </section>

          <section className="product-choice-section">
            <h2>How do you want it?</h2>

            <div className="product-fulfilment-options">
              <button
                type="button"
                className={`product-fulfilment-option ${purchaseMethod === 'delivery' ? 'is-selected' : ''}`}
                aria-pressed={purchaseMethod === 'delivery'}
                onClick={() => setPurchaseMethod('delivery')}
              >
                <TruckIcon />
                <span>
                  <strong>Home delivery</strong>
                  <small>Delivery details confirmed at checkout</small>
                </span>
              </button>

              <button
                type="button"
                className={`product-fulfilment-option ${purchaseMethod === 'pickup' ? 'is-selected' : ''}`}
                aria-pressed={purchaseMethod === 'pickup'}
                onClick={() => setPurchaseMethod('pickup')}
              >
                <StoreIcon />
                <span>
                  <strong>Store pickup</strong>
                  <small>{selectedVariant.store}</small>
                </span>
              </button>
            </div>
          </section>

          <div className="product-detail-actions">
            <button type="button" className="product-add-button" onClick={handleAddToBag}>
              Add to bag
            </button>
            <button type="button" className="product-compare-button" onClick={handleCompare}>
              Compare
            </button>
          </div>
          {cartFeedback && (
            <p className={`product-cart-feedback is-${cartFeedback.type}`} role="status">
              {cartFeedback.message}
            </p>
          )}

          <div className="product-detail-links">
            <button type="button" onClick={() => setSaved((current) => !current)} aria-pressed={saved}>
              <span className="product-link-icon">{saved ? '♥' : '♡'}</span>
              {saved ? 'Saved' : 'Save'}
            </button>

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: product.name, url: window.location.href })
                } else {
                  window.alert('Sharing is not supported in this browser.')
                }
              }}
            >
              <span className="product-link-icon">↗</span>
              Share
            </button>

            <span className="product-store-link">
              <span className="product-link-icon">⌖</span>
              {selectedVariant.store}
            </span>
          </div>

          <div className="product-assurance">
            <div><CheckIcon /><span>Free two-day delivery on iPhones</span></div>
            <div><CheckIcon /><span>Easy returns</span></div>
            <div><CheckIcon /><span>Volume pricing from 10 units</span></div>
          </div>
        </section>
      </div>

      <ProductDetails />
      <ProductResults currentProduct={product} />
    </main>
  )
}
