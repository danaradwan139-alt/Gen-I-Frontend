import SavedItemCard from '@/components/account/SavedItemCard'
import { useAccount } from '@/context/AccountContext'
import { useConfirm } from '@/context/ConfirmContext'
import { products } from '@/data/products'

export default function SavedItemsPage() {
  const { savedItems, removeSavedItem } = useAccount()
  const confirm = useConfirm()

  async function handleRemove(product, variant) {
    const ok = await confirm({
      title: 'Remove from saved items?',
      message: `${product.name} (${variant.label}) will be removed from your saved items.`,
      confirmLabel: 'Remove',
      cancelLabel: 'Keep it',
    })
    if (ok) removeSavedItem(product.id, variant.id)
  }

  const rows = savedItems
    .map(({ productId, variantId }) => {
      const product = products.find((item) => item.id === productId)
      const variant = product?.variants.find((item) => item.id === variantId)
      return product && variant ? { product, variant } : null
    })
    .filter(Boolean)

  return (
    <>
      <h2 className="acct-h">Saved items ({rows.length})</h2>
      {rows.length === 0 ? (
        <p className="acct-empty">Tap the heart on any product to save it here.</p>
      ) : (
        <div className="acct-grid">
          {rows.map(({ product, variant }) => (
            <SavedItemCard
              key={`${product.id}-${variant.id}`}
              product={product}
              variant={variant}
              onRemove={() => handleRemove(product, variant)}
            />
          ))}
        </div>
      )}
    </>
  )
}
