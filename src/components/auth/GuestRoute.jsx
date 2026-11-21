import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Wraps Login/Register. Once a session exists (just signed in, or already signed in)
// the visitor is sent back to where they came from, or home.
export default function GuestRoute() {
  const { isAuthenticated } = useAuth()
  const { state } = useLocation()

  return isAuthenticated ? <Navigate to={state?.from ?? '/'} replace /> : <Outlet />
}
