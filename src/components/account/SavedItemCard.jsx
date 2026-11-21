import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { useCart } from '@/context/CartContext'
import { getIphoneImage } from '@/data/iphoneImages'
import { HeartIcon } from './icons'

export default function SavedItemCard({ product, variant, onRemove }) {
  const { addToCart } = useCart()
  const [feedback, setFeedback] = useState('')
  const image = product.image || getIphoneImage(product)
  const inStock = variant.stock > 0

  useEffect(() => {
    if (!feedback) return undefined
    const timer = window.setTimeout(() => setFeedback(''), 2000)
    return () => window.clearTimeout(timer)
  }, [feedback])

  function handleAdd() {
    setFeedback(addToCart(product, variant) ? 'Added to bag' : 'Max in bag')
  }

  return (
    <article className="saved">
      <div className="saved-top">
        <div className="saved-img">
          {image && <img src={image} alt={`${product.name}, ${variant.label}`} loading="lazy" />}
        </div>
        <div className="saved-info">
          <h3 className="saved-name">{product.name}</h3>
          <p className="saved-meta">{variant.label}</p>
          <p className={`saved-stock ${inStock ? '' : 'is-out'}`}>{inStock ? 'In stock · Delivers tomorrow' : 'Out of stock'}</p>
        </div>
        <button type="button" className="saved-heart" onClick={onRemove} aria-label={`Remove ${product.name} from saved items`}>
          <HeartIcon size={20} />
        </button>
      </div>
      <div className="saved-actions">
        <Button  onClick={handleAdd} disabled={!inStock}>{feedback || 'Add to bag'}</Button>
        <Button variant="outline-teal"  to={`/shop/${product.id}#store-info-title`}>Reserve in store</Button>
      </div>
      <p className="sr-only" role="status">{feedback}</p>
    </article>
  )
}
