import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'

// /business/account/*: signed-out visitors go to /login; personal accounts go to their own account area.
export default function BusinessRoute() {
  const { isAuthenticated, isBusiness } = useAuth()
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />
  return isBusiness ? <Outlet /> : <Navigate to="/account" replace />
}
