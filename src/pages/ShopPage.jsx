
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { products, formatPrice } from '@/data/products';
import { assets as A } from '@/assets/assets';
import { Dropdown } from '@/components/ui/Dropdown';
import './ShopPage.css';
import { getIphoneImage } from '@/data/iphoneImages';
import AssistantSummary from '@/components/sections/AssistantSummary';

const colorOptions = [
  { name: 'Black', value: '#212121' },
  { name: 'Teal', value: '#8BBDB8' },
  { name: 'White', value: '#F4F4F2' },
  { name: 'Pink', value: '#E8B9C5' },
  { name: 'Blue', value: '#A9C5DF' },
  { name: 'Purple', value: '#BDB0D8' },
];

const quickFilters = [
  { label: 'All iPhones', type: 'all' },
  { label: 'In stock', type: 'availability', value: 'in-stock' },
  { label: '128 GB', type: 'storage', value: '128 GB' },
  { label: '256 GB', type: 'storage', value: '256 GB' },
  { label: 'Black', type: 'color', value: 'Black' },
  { label: 'Teal', type: 'color', value: 'Teal' },
  { label: 'Clear filters', type: 'clear' },
];

function getAvailability(variant) {
  if (variant.stock === 0) return 'out-of-stock';
  if (variant.stock <= 2) return 'low-stock';
  return 'in-stock';
}

export default function ShopPage() {
  const [searchParams] = useSearchParams();

  const [selectedModels, setSelectedModels] = useState([]);
  const [selectedStorage, setSelectedStorage] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('recommended');

  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase();

  const iphoneProducts = useMemo(
    () => products.filter((product) => product.category === 'iPhone'),
    []
  );

  const modelOptions = useMemo(
    () => [...new Set(iphoneProducts.map((product) => product.name))],
    [iphoneProducts]
  );

  const storageOptions = useMemo(
    () => [
      ...new Set(
        iphoneProducts.flatMap((product) =>
          product.variants.map((variant) => variant.storage)
        )
      ),
    ],
    [iphoneProducts]
  );

  const filteredProducts = useMemo(() => {
    let result = iphoneProducts
      .map((product) => {
        const matchingVariants = product.variants.filter((variant) => {
          const matchesStorage =
            selectedStorage.length === 0 ||
            selectedStorage.includes(variant.storage);

          const matchesColor =
            selectedColors.length === 0 ||
            selectedColors.includes(variant.color);

          const matchesAvailability =
            availability.length === 0 ||
            availability.includes(getAvailability(variant));

          const matchesMinPrice =
            minPrice === '' || variant.price >= Number(minPrice);

          const matchesMaxPrice =
            maxPrice === '' || variant.price <= Number(maxPrice);

          return (
            matchesStorage &&
            matchesColor &&
            matchesAvailability &&
            matchesMinPrice &&
            matchesMaxPrice
          );
        });

        return { ...product, visibleVariants: matchingVariants };
      })
      .filter((product) => product.visibleVariants.length > 0);

    if (selectedModels.length > 0) {
      result = result.filter((product) =>
        selectedModels.includes(product.name)
      );
    }

    if (searchTerm) {
      result = result.filter((product) =>
        `${product.name} ${product.brand} ${product.description}`
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    if (sortBy === 'price-low') {
      result.sort(
        (a, b) =>
          Math.min(...a.visibleVariants.map((v) => v.price)) -
          Math.min(...b.visibleVariants.map((v) => v.price))
      );
    }

    if (sortBy === 'price-high') {
      result.sort(
        (a, b) =>
          Math.min(...b.visibleVariants.map((v) => v.price)) -
          Math.min(...a.visibleVariants.map((v) => v.price))
      );
    }

    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [
    iphoneProducts,
    selectedModels,
    selectedStorage,
    selectedColors,
    availability,
    minPrice,
    maxPrice,
    sortBy,
    searchTerm,
  ]);

  const activeFilterCount =
    selectedModels.length +
    selectedStorage.length +
    selectedColors.length +
    availability.length +
    (minPrice !== '' ? 1 : 0) +
    (maxPrice !== '' ? 1 : 0);

  function toggleValue(value, current, setter) {
    setter(
      current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value]
    );
  }

  function clearFilters() {
    setSelectedModels([]);
    setSelectedStorage([]);
    setSelectedColors([]);
    setAvailability([]);
    setMinPrice('');
    setMaxPrice('');
  }

  function applyQuickFilter(filter) {
    if (filter.type === 'clear' || filter.type === 'all') {
      clearFilters();
      return;
    }

    if (filter.type === 'availability') {
      setSelectedModels([]);
      setSelectedStorage([]);
      setSelectedColors([]);
      setAvailability(['in-stock']);
      setMinPrice('');
      setMaxPrice('');
    }

    if (filter.type === 'storage') {
      setSelectedModels([]);
      setSelectedStorage([filter.value]);
      setSelectedColors([]);
      setAvailability([]);
      setMinPrice('');
      setMaxPrice('');
    }

    if (filter.type === 'color') {
      setSelectedModels([]);
      setSelectedStorage([]);
      setSelectedColors([filter.value]);
      setAvailability([]);
      setMinPrice('');
      setMaxPrice('');
    }
  }

  const availabilityCounts = {
    'in-stock': iphoneProducts.reduce(
      (total, product) =>
        total +
        product.variants.filter((variant) => variant.stock > 2).length,
      0
    ),
    'low-stock': iphoneProducts.reduce(
      (total, product) =>
        total +
        product.variants.filter(
          (variant) => variant.stock > 0 && variant.stock <= 2
        ).length,
      0
    ),
    'out-of-stock': iphoneProducts.reduce(
      (total, product) =>
        total +
        product.variants.filter((variant) => variant.stock === 0).length,
      0
    ),
  };

  return (
    <div className="iphone-shop-page">
      <section className="category-heading">
        <div className="category-heading-inner">
          <div className="category-breadcrumb">
            <Link to="/">Home</Link>
            <span>/</span>
            <span>iPhone</span>
          </div>

          <h1>iPhone</h1>

          <p>
            Every model, every color — find the iPhone that fits your needs.
          </p>

          <div className="quick-filter-row" aria-label="Quick filters">
            {quickFilters.map((filter) => {
              const active =
                (filter.type === 'all' && activeFilterCount === 0) ||
                (filter.type === 'availability' &&
                  availability.includes(filter.value)) ||
                (filter.type === 'storage' &&
                  selectedStorage.includes(filter.value)) ||
                (filter.type === 'color' &&
                  selectedColors.includes(filter.value));

              return (
                <button
                  key={filter.label}
                  type="button"
                  className={`quick-filter ${active ? 'active' : ''}`}
                  onClick={() => applyQuickFilter(filter)}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="shop-content">
        <aside className="filter-sidebar">
          <div className="filter-sidebar-heading">
            <h2>Filters</h2>
            <button type="button" onClick={clearFilters}>
              Clear all
            </button>
          </div>

          <div className="filter-group">
            <h3>Model</h3>

            {modelOptions.map((model) => {
              const isSelected = selectedModels.includes(model);

              return (
                <label className="filter-checkbox-row" key={model}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      toggleValue(model, selectedModels, setSelectedModels)
                    }
                  />
                  <span className="custom-checkbox" />
                  <span className="filter-option-label">{model}</span>
                </label>
              );
            })}
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h3>Storage</h3>

            <div className="storage-options">
              {storageOptions.map((storage) => {
                const isSelected = selectedStorage.includes(storage);

                return (
                  <button
                    key={storage}
                    type="button"
                    className={`storage-chip ${isSelected ? 'selected' : ''}`}
                    aria-pressed={isSelected}
                    onClick={() =>
                      toggleValue(storage, selectedStorage, setSelectedStorage)
                    }
                  >
                    {storage}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h3>Color</h3>

            <div className="color-options">
              {colorOptions.map((color) => {
                const isSelected = selectedColors.includes(color.name);

                return (
                  <button
                    key={color.name}
                    type="button"
                    className={`color-swatch ${isSelected ? 'selected' : ''}`}
                    style={{ '--swatch-color': color.value }}
                    aria-label={color.name}
                    aria-pressed={isSelected}
                    title={color.name}
                    onClick={() =>
                      toggleValue(
                        color.name,
                        selectedColors,
                        setSelectedColors
                      )
                    }
                  >
                    <span />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h3>Price (EGP)</h3>

            <div className="price-inputs">
              <label>
                <span>Min</span>
                <input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                />
              </label>

              <label>
                <span>Max</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Any"
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                />
              </label>
            </div>
          </div>

          <div className="filter-divider" />

          <div className="filter-group">
            <h3>Availability</h3>

            {[
              { value: 'in-stock', label: 'In stock' },
              { value: 'low-stock', label: 'Low stock' },
              { value: 'out-of-stock', label: 'Out of stock' },
            ].map((option) => {
              const isSelected = availability.includes(option.value);

              return (
                <label className="filter-checkbox-row" key={option.value}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() =>
                      toggleValue(
                        option.value,
                        availability,
                        setAvailability
                      )
                    }
                  />

                  <span className="custom-checkbox" />

                  <span className="filter-option-label">
                    {option.label}
                  </span>

                  <span className="filter-count">
                    {availabilityCounts[option.value]}
                  </span>
                </label>
              );
            })}
          </div>
        </aside>

        <div className="shop-results">
          <div className="assistant-summary">
            <div className="assistant-title-row">
              <div className="assistant-avatar">
                <img src={A.sparkle} alt="" />
              </div>

              <h2>Not sure which iPhone to pick?</h2>
            </div>

            <p>
              Explore the available models and compare storage, colors and
              prices. Use the filters to narrow down your options.
            </p>

            <div className="assistant-suggestions">
              <button
                type="button"
                onClick={() =>
                  applyQuickFilter({
                    type: 'availability',
                    value: 'in-stock',
                  })
                }
              >
                In-stock options
              </button>

              <button
                type="button"
                onClick={() =>
                  applyQuickFilter({
                    type: 'storage',
                    value: '128 GB',
                  })
                }
              >
                128 GB
              </button>

              <button
                type="button"
                onClick={() =>
                  applyQuickFilter({
                    type: 'storage',
                    value: '256 GB',
                  })
                }
              >
                256 GB
              </button>
            </div>
          </div>

          <div className="results-toolbar">
            <p>
              <strong>{filteredProducts.length}</strong>{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>

            <div className="sort-control">
              <span aria-hidden="true">Sort by</span>
              <Dropdown
                variant="pill"
                aria-label="Sort by"
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                options={[
                  { value: 'recommended', label: 'Recommended' },
                  { value: 'price-low', label: 'Price: low to high' },
                  { value: 'price-high', label: 'Price: high to low' },
                  { value: 'name', label: 'Name' },
                ]}
              />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="product-grid">
             
{filteredProducts.map((product) => {
  const startingPrice = Math.min(
    ...product.visibleVariants.map((variant) => variant.price)
  );

  const visibleStock = product.visibleVariants.reduce(
    (total, variant) => total + variant.stock,
    0
  );

  const hasStock = visibleStock > 0;
  const image = getIphoneImage(product) || product.image;
  return (
    <article className="iphone-product-card" key={product.id}>
      <Link
        className="product-card-image"
        to={`/shop/${product.id}`}
      >
       {image ? (
  <img src={image} alt={product.name} />
        ) : (
          <div className="product-image-placeholder">
            {product.name}
          </div>
        )}
      </Link>

      <span className="product-card-badge">
        Best for photos
      </span>

      <h3 className="product-card-title">
        {product.name}
      </h3>

      <p className="product-card-price">
        From {formatPrice(startingPrice)} — ·{' '}
        {hasStock ? 'In stock' : 'Out of stock'}
      </p>

      <div className="product-card-buttons">
        <Link
          className="product-primary-button"
          to={`/shop/${product.id}`}
        >
          View
        </Link>

        <button
          className="product-secondary-button"
          type="button"
          onClick={() =>
            window.alert('Product comparison will be available soon.')
          }
        >
          Compare
        </button>
      </div>
    </article>
  );
})}

            </div>
          ) : (
            <div className="shop-empty-state">
              <h3>No iPhones match these filters</h3>
              <p>
                Try changing your search or clearing some of the selected
                filters.
              </p>
              <button type="button" onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}

          <p className="sample-data-note">
            Demonstration catalog: prices and stock figures are sample data,
            not live inventory.
          </p>
        </div>
      </section>
    </div>
  );
}
