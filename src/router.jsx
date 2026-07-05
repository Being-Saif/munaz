import { createBrowserRouter } from 'react-router-dom';
import MainLayout from '@layouts/MainLayout';

// Pages (lazy loaded later, direct imports for now)
import HomePage from '@pages/home/HomePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // Will add more routes as pages are built:
      // { path: 'shop', element: <ShopPage /> },
      // { path: 'product/:slug', element: <ProductDetailPage /> },
      // { path: 'cart', element: <CartPage /> },
      // { path: 'wishlist', element: <WishlistPage /> },
      // { path: 'checkout', element: <CheckoutPage /> },
      // { path: 'account', element: <ProfilePage /> },
      // { path: 'account/orders', element: <OrdersPage /> },
    ],
  },
  // Auth routes (no main layout)
  // { path: '/login', element: <LoginPage /> },
  // { path: '/signup', element: <SignupPage /> },

  // Admin routes
  // { path: '/admin', element: <AdminLayout />, children: [...] },

  // 404
  { path: '*', element: <div className="flex items-center justify-center h-screen font-heading text-2xl">404 — Page Not Found</div> },
]);

export default router;
