import { useMemo } from 'react'
import { products } from '@/data/products'
import { getIphoneImage } from '@/data/iphoneImages'
import { useCart } from '@/context/CartContext'

export const VAT_RATE = 0.14 // Egypt VAT, prices are VAT-inclusive

// Cart lines joined with their product/variant data, plus totals. Used by the Bag and Checkout pages.
export function useBagItems() {
  const { items, ...cart } = useCart()

  const lines = useMemo(
    () =>
      items
        .map((item) => {
          const product = products.find((p) => p.id === item.productId)
          const variant = product?.variants.find((v) => v.id === item.variantId)
          if (!product || !variant) return null
          return { ...item, product, variant, image: getIphoneImage(product) || product.image }
        })
        .filter(Boolean),
    [items]
  )

  const count = lines.reduce((sum, line) => sum + line.quantity, 0)
  const total = lines.reduce((sum, line) => sum + line.variant.price * line.quantity, 0)
  const vat = Math.round(total - total / (1 + VAT_RATE))

  function clearBag() {
    lines.forEach((line) => cart.removeFromCart(line.productId, line.variantId))
  }

  return { lines, count, total, vat, clearBag, ...cart }
}
