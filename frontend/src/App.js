import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ShopsPage from './pages/ShopsPage';
import ShopDetailPage from './pages/ShopDetailPage';
import CartPage from './pages/buyer/CartPage';
import CheckoutPage from './pages/buyer/CheckoutPage';
import OrdersPage from './pages/buyer/OrdersPage';
import OrderDetailPage from './pages/buyer/OrderDetailPage';
import OrderSuccessPage from './pages/buyer/OrderSuccessPage';
import ProfilePage from './pages/ProfilePage';

import SellerDashboard from './pages/seller/SellerDashboard';
import SellerShops from './pages/seller/SellerShops';
import ShopForm from './pages/seller/ShopForm';
import SellerCities from './pages/seller/SellerCities';
import SellerCoupons from './pages/seller/SellerCoupons';
import SellerProducts from './pages/seller/SellerProducts';
import ProductForm from './pages/seller/ProductForm';
import SellerServices from './pages/seller/SellerServices';
import SellerOrders from './pages/seller/SellerOrders';

import Navbar from './components/Navbar';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Navbar />
          <Toaster position="top-5right" />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/shops/:cityId" element={<ShopsPage />} />
            <Route path="/shop/:shopId" element={<ShopDetailPage />} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute role="buyer"><CartPage /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute role="buyer"><CheckoutPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute role="buyer"><OrdersPage /></ProtectedRoute>} />
            <Route path="/orders/:id" element={<ProtectedRoute role="buyer"><OrderDetailPage /></ProtectedRoute>} />
            <Route path="/order-success" element={<ProtectedRoute role="buyer"><OrderSuccessPage /></ProtectedRoute>} />
            <Route path="/seller" element={<ProtectedRoute role="seller"><SellerDashboard /></ProtectedRoute>} />
            <Route path="/seller/shops" element={<ProtectedRoute role="seller"><SellerShops /></ProtectedRoute>} />
            <Route path="/seller/cities" element={<ProtectedRoute role="seller"><SellerCities /></ProtectedRoute>} />
            <Route path="/seller/coupons" element={<ProtectedRoute role="seller"><SellerCoupons /></ProtectedRoute>} />
            <Route path="/seller/shops/new" element={<ProtectedRoute role="seller"><ShopForm /></ProtectedRoute>} />
            <Route path="/seller/shops/:id/edit" element={<ProtectedRoute role="seller"><ShopForm /></ProtectedRoute>} />
            <Route path="/seller/products" element={<ProtectedRoute role="seller"><SellerProducts /></ProtectedRoute>} />
            <Route path="/seller/products/new" element={<ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>} />
            <Route path="/seller/products/:id/edit" element={<ProtectedRoute role="seller"><ProductForm /></ProtectedRoute>} />
            <Route path="/seller/services" element={<ProtectedRoute role="seller"><SellerServices /></ProtectedRoute>} />
            <Route path="/seller/orders" element={<ProtectedRoute role="seller"><SellerOrders /></ProtectedRoute>} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
