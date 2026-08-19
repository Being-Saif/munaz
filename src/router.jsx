import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';

// Pages
import HomePage from '@pages/home/HomePage';
import ShopPage from '@pages/shop/ShopPage';
import CategoriesPage from '@pages/shop/CategoriesPage';
import ProductDetailPage from '@pages/product/ProductDetailPage';
import WishlistPage from '@pages/user/WishlistPage';
import ProfilePage from '@pages/user/ProfilePage';
import MyOrdersPage from '@pages/user/MyOrdersPage';
import MyAddressesPage from '@pages/user/MyAddressesPage';
import CheckoutPage from '@pages/checkout/CheckoutPage';

// Auth Pages
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';

// Admin Pages
import AdminLayout from '@pages/admin/AdminLayout';
import AdminDashboard from '@pages/admin/AdminDashboard';
import AdminProducts from '@pages/admin/AdminProducts';
import AdminCategories from '@pages/admin/AdminCategories';
import AdminBanners from '@pages/admin/AdminBanners';
import AdminOrders from '@pages/admin/AdminOrders';
import AdminCustomers from '@pages/admin/AdminCustomers';
import ProtectedRoute from '@components/common/ProtectedRoute';

const router = createBrowserRouter([
  // Main Layout (with Navbar + Footer)
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      { path: 'account', element: <ProfilePage /> },
      { path: 'account/orders', element: <MyOrdersPage /> },
      { path: 'account/addresses', element: <MyAddressesPage /> },
      { path: 'checkout', element: <CheckoutPage /> },
    ],
  },

  // Admin Layout (protected - admin role required)
  {
    path: '/admin',
    element: <ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: 'products', element: <AdminProducts /> },
      { path: 'categories', element: <AdminCategories /> },
      { path: 'banners', element: <AdminBanners /> },
      { path: 'orders', element: <AdminOrders /> },
      { path: 'customers', element: <AdminCustomers /> },
    ],
  },

  // Auth Layout (split screen, no navbar/footer)
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/signup', element: <SignupPage /> },
      { path: '/forgot-password', element: <ForgotPasswordPage /> },
    ],
  },

  // 404
  { path: '*', element: <div className="flex items-center justify-center h-screen font-heading text-2xl text-dark">404 — Page Not Found</div> },
]);

export default router;
