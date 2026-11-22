import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AddressesIcon, InvoicesIcon, LogoutIcon, OrdersIcon, StoreIcon, TagIcon } from '@/components/account/icons'
import { useAuth } from '@/context/AuthContext'
import { useBusiness } from '@/context/BusinessContext'
import { useConfirm } from '@/context/ConfirmContext'
import '@/components/account/account.css'
import '@/components/account/records.css'
import './business.css'

const links = [
  { to: '', label: 'Overview', icon: OrdersIcon, end: true },
  { to: 'quotes', label: 'Quote requests', icon: InvoicesIcon },
  { to: 'quotations', label: 'Quotations', icon: TagIcon },
  { to: 'locations', label: 'Delivery locations', icon: AddressesIcon },
  { to: 'profile', label: 'Company Profile', icon: StoreIcon },
]

// Shell for /business/account/*: company name, section menu and the page (Figma "04 Overview" frame).
export default function BusinessLayout() {
  const { signOut } = useAuth()
  const { company } = useBusiness()
  const confirm = useConfirm()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const navRef = useRef(null)

  useEffect(() => {
    const nav = navRef.current
    const active = nav?.querySelector('.active')
    if (active) nav.scrollLeft = active.offsetLeft - (nav.clientWidth - active.offsetWidth) / 2
  }, [pathname])

  async function handleLogout() {
    const ok = await confirm({ tone: 'danger', icon: 'logout', title: 'Log out of GEN-I Business?', message: `You’ll need to sign in again to see ${company.name}’s quotes and quotations.`, confirmLabel: 'Log out', cancelLabel: 'Stay signed in' })
    if (!ok) return
    signOut()
    navigate('/', { replace: true })
  }

  return (
    <div className="acct biz-acct">
      <header className="acct-head">
        <div className="acct-title-row">
          <h1 className="acct-title">{company.name}</h1>
          {/* Phones: the menu scrolls sideways, so Log out lives up here where it's always visible */}
          <button type="button" className="acct-logout-top" onClick={handleLogout}><LogoutIcon size={18} />Log out</button>
        </div>
        <p className="acct-sub">Quote requests, quotations and approvals for your company.</p>
      </header>
      <div className="acct-body">
        <nav ref={navRef} className="acct-nav" aria-label="Business account sections">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={label} to={to} end={end} className="acct-link"><Icon />{label}</NavLink>
          ))}
          <button type="button" className="acct-logout acct-logout-nav" onClick={handleLogout}><LogoutIcon size={16} />Log out</button>
        </nav>
        <section className="acct-content"><Outlet /></section>
      </div>
    </div>
  )
}
