import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// Sends signed-out visitors to /login and brings them back afterwards (see GuestRoute).
export default function ProtectedRoute() {
  const { isAuthenticated, isBusiness } = useAuth()
  const location = useLocation()

  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return isBusiness ? <Navigate to="/business/account" replace /> : <Outlet />
}
