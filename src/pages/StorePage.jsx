import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { categories, formatPrice, getCatalog } from '@/data/products'
import './store.css'

function ProductArtwork({ product }) {
  if (product.image) {
    return <img className="store-product-image" src={product.image} alt="" />
  }

  return (
    <div className="store-product-art" aria-hidden="true">
      <span>{product.category}</span>
      <strong>{product.brand}</strong>
    </div>
  )
}

export default function StorePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [items, setItems] = useState([])
  const [loadState, setLoadState] = useState('loading')
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const brand = searchParams.get('brand') || ''
  const availability = searchParams.get('availability') === 'in-stock'
  const sort = searchParams.get('sort') || 'featured'
  const hasActiveFilters = Boolean(query || category || brand || availability || sort !== 'featured')

  async function loadItems() {
    setLoadState('loading')
    try {
      const catalog = await getCatalog()
      if (!Array.isArray(catalog)) {
        throw new Error('The product catalog response must be a list.')
      }
      setItems(catalog)
      setLoadState('ready')
    } catch (error) {
      console.error('Unable to load the product catalog.', error)
      setItems([])
      setLoadState('error')
    }
  }

  useEffect(() => {
    loadItems()
  }, [])

  const brands = useMemo(
    () => [...new Set(items.map((item) => item.brand))].sort(),
    [items],
  )

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    const matching = items.filter((product) => {
      const matchesQuery = !normalizedQuery
        || `${product.name} ${product.brand} ${product.category}`.toLowerCase().includes(normalizedQuery)
      const matchesCategory = !category || product.category === category
      const matchesBrand = !brand || product.brand === brand
      const matchesAvailability = !availability || product.variants.some((variant) => variant.stock > 0)
      return matchesQuery && matchesCategory && matchesBrand && matchesAvailability
    })

    if (sort === 'price-low') {
      return matching.sort((a, b) => (
        Math.min(...a.variants.map((variant) => variant.price))
        - Math.min(...b.variants.map((variant) => variant.price))
      ))
    }
    if (sort === 'price-high') {
      return matching.sort((a, b) => (
        Math.min(...b.variants.map((variant) => variant.price))
        - Math.min(...a.variants.map((variant) => variant.price))
      ))
    }
    return matching
  }, [availability, brand, category, items, query, sort])

  function updateFilter(key, value) {
    const next = new URLSearchParams(searchParams)
    if (value) next.set(key, value)
    else next.delete(key)
    setSearchParams(next)
  }

  function clearFilters() {
    setSearchParams({})
  }

  return (
    <section className="store-page" aria-labelledby="store-title">
      <div className="store-heading">
        <p className="store-eyebrow">GEN-I ONLINE STORE</p>
        <h1 id="store-title">Find your next favorite.</h1>
        <p>Browse the catalog, compare variants and check sample availability by store.</p>
      </div>

      <p className="catalog-notice" role="note">
        Demo catalog: prices and stock are sample data, not live store inventory.
      </p>

      <div className="store-toolbar">
        <label className="store-filter">
          <span>Category</span>
          <select value={category} onChange={(event) => updateFilter('category', event.target.value)}>
            <option value="">All categories</option>
            {categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="store-filter">
          <span>Brand</span>
          <select value={brand} onChange={(event) => updateFilter('brand', event.target.value)}>
            <option value="">All brands</option>
            {brands.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </label>

        <label className="store-filter">
          <span>Sort by</span>
          <select value={sort} onChange={(event) => updateFilter('sort', event.target.value)}>
            <option value="featured">Featured</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </label>

        <label className="stock-filter">
          <input
            type="checkbox"
            checked={availability}
            onChange={(event) => updateFilter('availability', event.target.checked ? 'in-stock' : '')}
          />
          <span>In stock only</span>
        </label>
        {hasActiveFilters && (
          <button type="button" className="filter-reset" onClick={clearFilters}>
            Clear filters
          </button>
        )}
      </div>

      {query && (
        <div className="query-summary">
          <p>Search results for <strong>“{query}”</strong></p>
          <button type="button" className="text-button" onClick={() => updateFilter('q', '')}>Clear search</button>
        </div>
      )}

      {loadState === 'loading' && (
        <p className="catalog-message catalog-loading" role="status">
          <span className="catalog-spinner" aria-hidden="true" />
          Loading products…
        </p>
      )}

      {loadState === 'error' && (
        <div className="catalog-message catalog-error" role="alert">
          <h2>We couldn’t load the catalog.</h2>
          <p>Please try again.</p>
          <button className="store-button" type="button" onClick={loadItems}>Try again</button>
        </div>
      )}

      {loadState === 'ready' && filteredProducts.length === 0 && (
        <div className="catalog-message" role="status">
          <h2>No products found</h2>
          <p>Try a different search or remove one of your filters.</p>
          <button className="text-button" type="button" onClick={clearFilters}>Clear all filters</button>
        </div>
      )}

      {loadState === 'ready' && filteredProducts.length > 0 && (
        <>
          <p className="catalog-count" aria-live="polite">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
          <div className="store-grid">
            {filteredProducts.map((product) => {
              const startingPrice = Math.min(...product.variants.map((variant) => variant.price))
              const inStock = product.variants.some((variant) => variant.stock > 0)
              return (
                <article className="store-card" key={product.id}>
                  <Link className="store-card-link" to={`/shop/${product.id}`} aria-label={`View ${product.name}`}>
                    <ProductArtwork product={product} />
                    <span className="store-card-category">{product.category}</span>
                    <h2>{product.name}</h2>
                    <p className="store-card-brand">{product.brand}</p>
                  </Link>
                  <div className="store-card-bottom">
                    <p className="store-card-price">From {formatPrice(startingPrice)}</p>
                    <p className={inStock ? 'inventory-available' : 'inventory-unavailable'}>
                      {inStock ? 'Available in sample listing' : 'Currently unavailable'}
                    </p>
                    <Link className="store-button" to={`/shop/${product.id}`}>View details</Link>
                  </div>
                </article>
              )
            })}
          </div>
        </>
      )}
    </section>
  )
}
