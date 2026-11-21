import { NavLink } from 'react-router-dom'
import { assets as A } from '@/assets/assets'
import Logo from '@/components/ui/Logo'
import './auth.css'

const tabs = [
  { to: '/login', label: 'Sign in' },
  { to: '/register', label: 'Create account' },
]

// Split-screen shell shared by Login and Register: photo on the left, form on the right.
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="auth">
      <div className="auth-media">
        <img src={A.authPhoto} alt="" />
      </div>
      <main className="auth-panel">
        <div className="auth-card">
          <Logo />
          <h1 className="auth-title t40">{title}</h1>
          <p className="auth-sub">{subtitle}</p>
          <nav className="auth-tabs" aria-label="Account">
            {tabs.map(({ to, label }) => (
              <NavLink key={to} to={to} className="auth-tab">{label}</NavLink>
            ))}
          </nav>
          {children}
        </div>
      </main>
    </div>
  )
}
