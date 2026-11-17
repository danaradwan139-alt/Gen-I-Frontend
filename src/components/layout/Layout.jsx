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
        <Outlet />
      </main>
      <Footer />
      <AssistantLauncher />
    </div>
  )
}
