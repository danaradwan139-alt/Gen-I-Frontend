
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem('geni-cart')
      return savedCart ? JSON.parse(savedCart) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('geni-cart', JSON.stringify(items))
  }, [items])

  function addToCart(product, variant) {
    if (!variant || variant.stock <= 0) return false

    const existingItem = items.find(
      (item) =>
        item.productId === product.id &&
        item.variantId === variant.id
    )

    if (existingItem && existingItem.quantity >= variant.stock) {
      return false
    }

    setItems((currentItems) => {
      const existing = currentItems.find(
        (item) =>
          item.productId === product.id &&
          item.variantId === variant.id
      )

      if (existing) {
        return currentItems.map((item) =>
          item.productId === product.id &&
          item.variantId === variant.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }

      return [
        ...currentItems,
        {
          productId: product.id,
          variantId: variant.id,
          quantity: 1,
        },
      ]
    })

    return true
  }

  function updateQuantity(productId, variantId, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }

    setItems((currentItems) =>
      currentItems.map((item) => {
        if (
          item.productId !== productId ||
          item.variantId !== variantId
        ) {
          return item
        }

        return { ...item, quantity }
      })
    )
  }

  function removeFromCart(productId, variantId) {
    setItems((currentItems) =>
      currentItems.filter(
        (item) =>
          item.productId !== productId ||
          item.variantId !== variantId
      )
    )
  }

  const cartCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        cartCount,
        addToCart,
        updateQuantity,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used inside CartProvider')
  }

  return context
}
