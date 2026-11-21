import { useMemo, useState } from 'react'
import { products } from '@/data/products'
import { ProductCard, ProductGrid } from '@/components/shop/ProductCard'
import { Dropdown } from '@/components/ui/Dropdown'
import './ProductResults.css'

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const fromPrice = (p) => Math.min(...p.variants.map((v) => v.price))

// "More products" grid under the product details, using the same card as the Shop page.
export default function ProductResults({ currentProduct = {} }) {
  const [sort, setSort] = useState('featured')

  const cards = useMemo(() => {
    const others = products.filter((p) => p.id !== currentProduct.id && p.variants?.length)
    // Same category first, then everything else
    const ranked = [
      ...others.filter((p) => p.category === currentProduct.category),
      ...others.filter((p) => p.category !== currentProduct.category),
    ].slice(0, 6)
    if (sort === 'price-asc') ranked.sort((a, b) => fromPrice(a) - fromPrice(b))
    if (sort === 'price-desc') ranked.sort((a, b) => fromPrice(b) - fromPrice(a))
    return ranked
  }, [currentProduct.id, currentProduct.category, sort])

  if (cards.length === 0) return null

  return (
    <section className="results" aria-labelledby="results-title">
      <div className="results-toolbar">
        <h2 id="results-title">You might also like</h2>
        <div className="results-sort">
          <span aria-hidden="true">Sort by</span>
          <Dropdown variant="pill" aria-label="Sort by" value={sort} options={sortOptions} onChange={(e) => setSort(e.target.value)} />
        </div>
      </div>

      <ProductGrid>
        {cards.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </ProductGrid>
    </section>
  )
}
