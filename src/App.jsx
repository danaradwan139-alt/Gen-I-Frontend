import { Navigate, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductPage from '@/pages/ProductPage'
import BagPage from '@/pages/BagPage'
import CheckoutPage from '@/pages/CheckoutPage'
import BusinessCheckoutPage from '@/pages/BusinessCheckoutPage'
import ShopPage from '@/pages/ShopPage'
import ComparePage from '@/pages/ComparePage'
import RepairPage from '@/pages/RepairPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import GuestRoute from '@/components/auth/GuestRoute'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AccountLayout from '@/components/account/AccountLayout'
import OrdersPage from '@/pages/account/OrdersPage'
import OrderDetailsPage from '@/pages/account/OrderDetailsPage'
import RepairsPage from '@/pages/account/RepairsPage'
import StartReturnPage from '@/pages/account/StartReturnPage'
import TradeInsPage from '@/pages/account/TradeInsPage'
import SavedItemsPage from '@/pages/account/SavedItemsPage'
import ReservationsPage from '@/pages/account/ReservationsPage'
import AddressesPage from '@/pages/account/AddressesPage'
import PaymentMethodsPage from '@/pages/account/PaymentMethodsPage'
import InvoicesPage from '@/pages/account/InvoicesPage'
import ProfilePage from '@/pages/account/ProfilePage'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { AccountProvider } from '@/context/AccountContext'

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AccountProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>
            <Route element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="compare" element={<ComparePage />} />
              <Route path="shop" element={<ShopPage />} />
              <Route path="shop/:productId" element={<ProductPage />} />
              <Route path="bag" element={<BagPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="business/checkout" element={<BusinessCheckoutPage />} />
              <Route path="repair" element={<RepairPage />} />
              <Route path="account" element={<ProtectedRoute />}>
                <Route element={<AccountLayout />}>
                  <Route index element={<Navigate to="orders" replace />} />
                  <Route path="orders" element={<OrdersPage />} />
                  <Route path="orders/:orderId" element={<OrderDetailsPage />} />
                  <Route path="orders/:orderId/return" element={<StartReturnPage />} />
                  <Route path="repairs" element={<RepairsPage />} />
                  <Route path="trade-ins" element={<TradeInsPage />} />
                  <Route path="saved-items" element={<SavedItemsPage />} />
                  <Route path="reservations" element={<ReservationsPage />} />
                  <Route path="addresses" element={<AddressesPage />} />
                  <Route path="payment-methods" element={<PaymentMethodsPage />} />
                  <Route path="invoices" element={<InvoicesPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
              </Route>
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </AccountProvider>
      </CartProvider>
    </AuthProvider>
  )
}
