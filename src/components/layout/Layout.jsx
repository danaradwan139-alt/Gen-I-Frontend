import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import AssistantLauncher from '@/components/sections/AssistantLauncher'
import './layout.css'

export default function Layout() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const frame = window.requestAnimationFrame(() => {
        document.getElementById(hash.slice(1))?.scrollIntoView()
      })
      return () => window.cancelAnimationFrame(frame)
    }

    window.scrollTo(0, 0)
  }, [pathname, hash])

  return (
    <div className="page">
      <Header />
      <main>
        {/* Keyed by path so each page plays the prototype's 300ms ease-out entrance */}
        <div key={pathname} className="route-view">
          <Outlet />
        </div>
      </main>
      <Footer />
      <AssistantLauncher />
    </div>
  )
}
