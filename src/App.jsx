
import { Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import LandingPage from '@/pages/LandingPage'
import NotFoundPage from '@/pages/NotFoundPage'
import ProductPage from '@/pages/ProductPage'
import BagPage from '@/pages/BagPage'
import ShopPage from '@/pages/ShopPage'
import ComparePage from '@/pages/ComparePage'
import RepairPage from '@/pages/RepairPage'
import { CartProvider } from '@/context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<LandingPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:productId" element={<ProductPage />} />
          <Route path="/bag" element={<BagPage />} />
          <Route path="/repair" element={<RepairPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </CartProvider>
  )
}
