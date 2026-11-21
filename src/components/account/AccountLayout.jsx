import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { useConfirm } from '@/context/ConfirmContext'
import {
  AddressesIcon, CardIcon, HeartIcon, InvoicesIcon, LogoutIcon, OrdersIcon,
  RepairsIcon, StoreIcon, TradeInsIcon, UserIcon,
} from './icons'
import './account.css'

const links = [
  { to: 'orders', label: 'Orders', icon: OrdersIcon },
  { to: 'repairs', label: 'Repairs', icon: RepairsIcon },
  { to: 'trade-ins', label: 'Trade-ins', icon: TradeInsIcon },
  { to: 'saved-items', label: 'Saved items', icon: HeartIcon },
  { to: 'reservations', label: 'Reservations', icon: StoreIcon },
  { to: 'addresses', label: 'Addresses', icon: AddressesIcon },
  { to: 'payment-methods', label: 'Payment methods', icon: CardIcon },
  { to: 'invoices', label: 'Invoices', icon: InvoicesIcon },
  { to: 'profile', label: 'Profile & security', icon: UserIcon },
]

function firstName(user) {
  return user?.firstName || user?.name?.trim().split(/\s+/)[0] || 'there'
}

// Shell for every /account/* page: greeting, section sidebar and the page content.
export default function AccountLayout() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const navRef = useRef(null)
  const confirm = useConfirm()

  // On narrow screens the section list scrolls sideways; keep the current section in view.
  useEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector('.active')
    if (active) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
  }, [pathname])

  async function handleLogout() {
    const ok = await confirm({
      tone: 'danger',
      icon: 'logout',
      title: 'Log out of GEN-I?',
      message: 'You’ll need to sign in again to see your orders, repairs and saved details.',
      confirmLabel: 'Log out',
      cancelLabel: 'Stay signed in',
    })
    if (!ok) return
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="acct">
      <header className="acct-head">
        <h1 className="acct-title">Hi, {firstName(user)}.</h1>
        <p className="acct-sub">Manage your orders, repairs, trade-ins and saved details.</p>
      </header>
      <div className="acct-body">
        <nav ref={navRef} className="acct-nav" aria-label="Account sections">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className="acct-link">
              <Icon />
              {label}
            </NavLink>
          ))}
          <button type="button" className="acct-logout" onClick={handleLogout}>
            <LogoutIcon size={16} />
            Log out
          </button>
        </nav>
        <section className="acct-content">
          <Outlet />
        </section>
      </div>
    </div>
  )
}
