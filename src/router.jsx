import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';

// Pages
import HomePage from '@pages/home/HomePage';
import ShopPage from '@pages/shop/ShopPage';
import CategoriesPage from '@pages/shop/CategoriesPage';
import ProductDetailPage from '@pages/product/ProductDetailPage';
import WishlistPage from '@pages/user/WishlistPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'shop', element: <ShopPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'product/:slug', element: <ProductDetailPage /> },
      { path: 'wishlist', element: <WishlistPage /> },
      // Coming next:
      // { path: 'cart', element: <CartPage /> },
      // { path: 'checkout', element: <CheckoutPage /> },
      // { path: 'account', element: <ProfilePage /> },
      // { path: 'account/orders', element: <OrdersPage /> },
    ],
  },
  // Auth routes
  // { path: '/login', element: <LoginPage /> },
  // { path: '/signup', element: <SignupPage /> },

  // 404
  { path: '*', element: <div className="flex items-center justify-center h-screen font-heading text-2xl text-dark">404 — Page Not Found</div> },
]);

export default router;
