import { assets as A } from '@/assets/assets'
import { Icon, Arrow } from '@/components/ui/Icon'
import { Button } from '@/components/ui/Button'
import { CartGlyph } from '@/components/ui/Glyphs'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { categories } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import Logo from '@/components/ui/Logo'
import './header.css'

const links = [...categories, 'Repairs', 'Business']

export default function Header() {
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { cartCount } = useCart()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    setMenuOpen(false)
    setSearch(new URLSearchParams(location.search).get('q') || '')
  }, [location.pathname, location.search])

  function submitSearch(event) {
    event.preventDefault()
    const query = search.trim()
    navigate(query ? `/shop?q=${encodeURIComponent(query)}` : '/shop')
  }

  return (
    <header className="nav">
      <div className="promo">
        <p>Free two-day delivery and easy returns on every iPhone.</p>
        <Button
          variant="text"
          size="xs"
          className="tight"
          to="/shop?category=iPhone"
        >
          Shop now <Arrow src={A.arrowTint} />
        </Button>
      </div>

      <div className="bar">
        <Logo />

        <button
          type="button"
          className="menu-toggle"
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
          <span className="sr-only">
            {menuOpen ? 'Close menu' : 'Open menu'}
          </span>
        </button>

        <nav className="bar-links" aria-label="Main">
          {links.map((label) => (
            <Link
              key={label}
              to={
                label === 'Repairs'
                  ? '/#repair'
                  : label === 'Business'
                    ? '/#business'
                    : `/shop?category=${encodeURIComponent(label)}`
              }
              className="link"
            >
              {label}
            </Link>
          ))}
        </nav>

        <form className="search" role="search" onSubmit={submitSearch}>
          <label className="sr-only" htmlFor="site-search">
            Search products
          </label>
          <Icon src={A.search} inset="5.21%" kind="flip" />
          <input
            id="site-search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find your perfect tech..."
          />
          <button type="submit" className="sr-only">
            Search
          </button>
        </form>

        {isAuthenticated ? (
          <div className="bar-actions">
            <Link
              className="bag-link"
              to="/bag"
              aria-label={`Shopping bag, ${cartCount} items`}
            >
              <CartGlyph />
              {cartCount > 0 && (
                <span className="bag-count">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            <Link
              className="user-link"
              to="/account"
              aria-label="My account"
            >
              <svg
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7" />
              </svg>
            </Link>
          </div>
        ) : (
          <div className="bar-actions guest">
            <Button size="md" to="/login">login</Button>
          </div>
        )}
      </div>

      <nav
        id="primary-navigation"
        className={`mobile-navigation ${menuOpen ? 'is-open' : ''}`}
        aria-label="Product categories"
        hidden={!menuOpen}
      >
        {links.map((label) => (
          <Link
            key={label}
            to={
              label === 'Repairs'
                ? '/#repair'
                : label === 'Business'
                  ? '/#business'
                  : `/shop?category=${encodeURIComponent(label)}`
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        {!isAuthenticated && (
          <>
            <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            <Link to="/register" onClick={() => setMenuOpen(false)}>Create account</Link>
          </>
        )}
      </nav>
    </header>
  )
}
