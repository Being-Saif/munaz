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

// Auth Pages
import LoginPage from '@pages/auth/LoginPage';
import SignupPage from '@pages/auth/SignupPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';

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
