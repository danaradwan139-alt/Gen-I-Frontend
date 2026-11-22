import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { products, categories } from '@/data/products'
import { assets as A } from '@/assets/assets'
import { Icon } from '@/components/ui/Icon'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { Dropdown } from '@/components/ui/Dropdown'
import { HeartIcon } from '@/components/ui/Heart'
import { ProductCard, PairCard, ProductGrid } from '@/components/shop/ProductCard'
import { useFavorites } from '@/hooks/useFavorites'
import './ShopPage.css'

const PAGE_SIZE = 6

// Product swatch colours from the Figma file ("… – product" colour styles)
const swatchColors = {
  Black: '#212121',
  Grey: '#C9C7C2',
  Gray: '#C9C7C2',
  'Natural Titanium': '#C9C7C2',
  Blue: '#3557C8',
  Pink: '#F3C6CF',
  'Light Blue': '#C8D7E8',
  Teal: '#8BBDB8',
  Purple: '#C9BCE6',
  White: '#F4F4F2',
}

const sortOptions = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'price-desc', label: 'Price: high to low' },
]

const assistantChips = ['Best for photos', 'Best battery', 'Under 50,000 EGP']

function askAssistant(message) {
  window.dispatchEvent(new CustomEvent('open-assistant', { detail: { message } }))
}

function Checkbox({ checked, onChange, label, count }) {
  return (
    <label className="shop-check">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <span className="shop-check-box" aria-hidden="true">
        {checked && <Icon src={A.tick} size={14} inset="23.96% 17.7%" />}
      </span>
      <span className="shop-check-label">{label}</span>
      {count != null && <span className="shop-check-count">{count}</span>}
    </label>
  )
}

export default function ShopPage() {
  const [searchParams] = useSearchParams()

  const requestedCategory = searchParams.get('category')
  const category = categories.includes(requestedCategory) ? requestedCategory : 'iPhone'
  const query = (searchParams.get('q') || '').trim().toLowerCase()

  const [models, setModels] = useState([])
  const [storage, setStorage] = useState([])
  const [colors, setColors] = useState([])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [pickupToday, setPickupToday] = useState(false)
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [sort, setSort] = useState('featured')
  const [page, setPage] = useState(1)
  const { favorites } = useFavorites()
  const [savedOnly, setSavedOnly] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const inCategory = useMemo(
    () =>
      products.filter(
        (p) =>
          (query ? `${p.name} ${p.brand} ${p.category}`.toLowerCase().includes(query) : p.category === category)
      ),
    [category, query]
  )

  const modelCounts = useMemo(() => inCategory.map((p) => [p.name, p.variants.length]), [inCategory])
  const storageOptions = useMemo(
    () => [...new Set(inCategory.flatMap((p) => p.variants.map((v) => v.storage)).filter(Boolean))],
    [inCategory]
  )
  const colorOptions = useMemo(
    () => [...new Set(inCategory.flatMap((p) => p.variants.map((v) => v.color)).filter(Boolean))],
    [inCategory]
  )

  const results = useMemo(() => {
    const min = minPrice === '' ? -Infinity : Number(minPrice)
    const max = maxPrice === '' ? Infinity : Number(maxPrice)

    const list = inCategory
      .filter((p) => models.length === 0 || models.includes(p.name))
      .filter((p) => !savedOnly || favorites.includes(p.id))
      .map((p) => ({
        ...p,
        visibleVariants: p.variants.filter(
          (v) =>
            (storage.length === 0 || storage.includes(v.storage)) &&
            (colors.length === 0 || colors.includes(v.color)) &&
            (!inStockOnly || v.stock > 0) &&
            (!pickupToday || (v.stock > 0 && v.store)) &&
            v.price >= min &&
            v.price <= max
        ),
      }))
      .filter((p) => p.visibleVariants.length > 0)

    const fromPrice = (p) => Math.min(...p.visibleVariants.map((v) => v.price))
    if (sort === 'price-asc') list.sort((a, b) => fromPrice(a) - fromPrice(b))
    if (sort === 'price-desc') list.sort((a, b) => fromPrice(b) - fromPrice(a))
    return list
  }, [inCategory, models, storage, colors, inStockOnly, pickupToday, minPrice, maxPrice, sort, savedOnly, favorites])

  // Any filter change goes back to page 1
  useEffect(() => setPage(1), [category, query, models, storage, colors, inStockOnly, pickupToday, minPrice, maxPrice, sort, savedOnly])

  // Mobile filter drawer: Escape closes it and the page behind doesn't scroll
  useEffect(() => {
    if (!filtersOpen) return undefined
    const onKey = (event) => event.key === 'Escape' && setFiltersOpen(false)
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [filtersOpen])

  const activeFilters =
    models.length + storage.length + colors.length + (inStockOnly ? 1 : 0) + (pickupToday ? 1 : 0) + (minPrice ? 1 : 0) + (maxPrice ? 1 : 0)

  const pageCount = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const toggle = (value, setter) =>
    setter((current) => (current.includes(value) ? current.filter((x) => x !== value) : [...current, value]))

  function clearAll() {
    setModels([]); setStorage([]); setColors([])
    setInStockOnly(false); setPickupToday(false)
    setMinPrice(''); setMaxPrice('')
  }


  // Search results: "Pair it with" accessories that aren't already in the results (Figma "4 · Search results")
  const pairProducts = useMemo(() => {
    if (!query) return []
    const shown = new Set(results.map((p) => p.id))
    return products.filter((p) => p.category === 'Accessories' && !shown.has(p.id) && p.variants?.length).slice(0, 4)
  }, [query, results])

  const title = query ? `Results for “${searchParams.get('q')}”` : category

  return (
    <div className="shop-page">
      <section className="shop-header">
        <nav className="crumbs" aria-label="Breadcrumb">
          <Link to="/" className="crumb-link">
            Home <Icon src={A.chevronTeal} inset="21.49% 33.66% 21.48% 33.68%" kind="chev" />
          </Link>
          <span aria-current="page">{query ? 'Search' : category}</span>
        </nav>

        <h1 className="shop-title">{title}</h1>
        <p className="shop-sub">Every model, every color — with 0% installments and next‑day delivery.</p>

        {!query && (
          <div className="shop-quick" role="group" aria-label="Quick filters">
            <Button
              size="md"
              variant={models.length === 0 ? 'primary' : 'outline-teal'}
              aria-pressed={models.length === 0}
              onClick={() => setModels([])}
            >
              All {category}
            </Button>
            {modelCounts.map(([name]) => {
              const active = models.length === 1 && models[0] === name
              return (
                <Button
                  key={name}
                  size="md"
                  variant={active ? 'primary' : 'outline-teal'}
                  aria-pressed={active}
                  onClick={() => setModels(active ? [] : [name])}
                >
                  {name}
                </Button>
              )
            })}
            {category !== 'Accessories' && (
              <Button size="md" variant="outline-teal" to="/shop?category=Accessories">Accessories</Button>
            )}
          </div>
        )}
      </section>

      <section className="shop-body">
        {filtersOpen && <div className="shop-scrim" onClick={() => setFiltersOpen(false)} aria-hidden="true" />}
        <aside id="shop-filters" className={`shop-filters${filtersOpen ? ' is-open' : ''}`} aria-label="Filters">
          <div className="shop-filters-head">
            <h2>Filters</h2>
            <Button variant="text" size="xs" onClick={clearAll}>Clear all</Button>
            <button type="button" className="shop-filters-close" onClick={() => setFiltersOpen(false)} aria-label="Close filters">×</button>
          </div>

          {modelCounts.length > 0 && (
            <fieldset className="shop-group">
              <legend>Model</legend>
              {modelCounts.map(([name, count]) => (
                <Checkbox
                  key={name}
                  label={name}
                  count={count}
                  checked={models.includes(name)}
                  onChange={() => toggle(name, setModels)}
                />
              ))}
            </fieldset>
          )}

          {storageOptions.length > 0 && (
            <fieldset className="shop-group">
              <legend>Storage</legend>
              <div className="shop-pills">
                {storageOptions.map((s) => (
                  <Button
                    key={s}
                    size="xs"
                    variant={storage.includes(s) ? 'soft' : 'outline-grey'}
                    aria-pressed={storage.includes(s)}
                    onClick={() => toggle(s, setStorage)}
                  >
                    {s.replace(' ', '')}
                  </Button>
                ))}
              </div>
            </fieldset>
          )}

          {colorOptions.length > 0 && (
            <fieldset className="shop-group">
              <legend>Color</legend>
              <div className="shop-swatches">
                {colorOptions.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className="shop-swatch"
                    style={{ '--swatch': swatchColors[c] || 'var(--light)' }}
                    aria-pressed={colors.includes(c)}
                    aria-label={c}
                    title={c}
                    onClick={() => toggle(c, setColors)}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="shop-group">
            <legend>Price (EGP)</legend>
            <div className="shop-price">
              <label>
                <span>Min</span>
                <input inputMode="numeric" placeholder="20,000" value={minPrice} onChange={(e) => setMinPrice(e.target.value.replace(/\D/g, ''))} />
              </label>
              <label>
                <span>Max</span>
                <input inputMode="numeric" placeholder="90,000" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value.replace(/\D/g, ''))} />
              </label>
            </div>
          </fieldset>

          <fieldset className="shop-group">
            <legend>Availability</legend>
            <Checkbox label="In stock" checked={inStockOnly} onChange={() => setInStockOnly((v) => !v)} />
            <Checkbox label="Pick up today" checked={pickupToday} onChange={() => setPickupToday((v) => !v)} />
          </fieldset>

          <div className="shop-filters-foot">
            <Button className="block" onClick={() => setFiltersOpen(false)}>
              Show {results.length} {results.length === 1 ? 'product' : 'products'}
            </Button>
          </div>
        </aside>

        <div className="shop-results">
          <div className="assistant-box">
            <div className="assistant-box-title">
              <Avatar />
              <h2>Not sure which {category === 'iPhone' ? 'iPhone' : 'one'} to pick?</h2>
            </div>
            <p>Tell GEN-I how you use your phone and get a personal recommendation.</p>
            <div className="assistant-box-chips">
              {assistantChips.map((chip) => (
                <button key={chip} type="button" className="chip" onClick={() => askAssistant(chip)}>{chip}</button>
              ))}
            </div>
          </div>

          <div className="shop-toolbar">
            <p className="shop-count">{results.length} {results.length === 1 ? 'product' : 'products'}</p>
            <div className="shop-tools">
              <Button
                size="xs"
                variant="outline-teal"
                className="shop-filter-toggle"
                aria-expanded={filtersOpen}
                aria-controls="shop-filters"
                onClick={() => setFiltersOpen(true)}
              >
                Filters{activeFilters > 0 ? ` (${activeFilters})` : ''}
              </Button>
              <Button
                size="xs"
                variant={savedOnly ? 'soft' : 'outline-grey'}
                aria-pressed={savedOnly}
                onClick={() => setSavedOnly((v) => !v)}
              >
                <HeartIcon size={14} filled color="#fc3a3a" /> Saved{favorites.length > 0 ? ` (${favorites.length})` : ''}
              </Button>
            <div className="shop-sort">
              <span aria-hidden="true">Sort by</span>
              <Dropdown variant="pill" aria-label="Sort by" value={sort} options={sortOptions} onChange={(e) => setSort(e.target.value)} />
            </div>
            </div>
          </div>


          {pageItems.length === 0 ? (
            <div className="shop-empty">
              <h2>{savedOnly && favorites.length === 0 ? 'No saved products yet' : 'No products match these filters'}</h2>
              {savedOnly && favorites.length === 0 && <p>Tap the heart on any product to save it here.</p>}
              <Button size="md" variant="outline-teal" onClick={() => { clearAll(); setSavedOnly(false) }}>Show all products</Button>
            </div>
          ) : (
            <ProductGrid>
              {pageItems.map((product, index) => (
                <ProductCard key={product.id} product={product} variants={product.visibleVariants} index={index} />
              ))}
            </ProductGrid>
          )}

          {pageCount > 1 && (
            <nav className="shop-pages" aria-label="Pages">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Button
                  key={n}
                  variant={n === page ? 'primary' : 'outline-grey'}
                  aria-current={n === page ? 'page' : undefined}
                  onClick={() => { setPage(n); document.querySelector('.shop-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}
                >
                  {n}
                </Button>
              ))}
            </nav>
          )}

          {pairProducts.length > 0 && (
            <section className="shop-pair" aria-labelledby="pair-heading">
              <h2 id="pair-heading">Pair it with</h2>
              <ProductGrid compact>
                {pairProducts.map((product, index) => <PairCard key={product.id} product={product} index={index} />)}
              </ProductGrid>
            </section>
          )}
        </div>
      </section>

    </div>
  )
}
