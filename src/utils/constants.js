// ===== MUNAZ — Application Constants =====

export const APP_NAME = 'Munaz';
export const APP_TAGLINE = 'Luxury Fashion for the Modern Woman';
export const APP_DESCRIPTION = 'Discover luxury fashion and timeless style at Munaz. Premium quality, elegant designs.';

// API (mock for now, swap to real backend later)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// Breakpoints (match Tailwind config)
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

// Pagination
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// Product
export const MAX_CART_QUANTITY = 10;
export const LOW_STOCK_THRESHOLD = 5;

// Animation durations (ms)
export const ANIMATION = {
  fast: 200,
  normal: 300,
  slow: 500,
  page: 600,
};

// Navigation links
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories', hasMegaMenu: true },
  { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
  { label: 'Sale', href: '/shop?filter=sale' },
];

// Footer links
export const FOOTER_LINKS = {
  shop: [
    { label: 'Women', href: '/shop?category=women' },
    { label: 'Dresses', href: '/shop?category=dresses' },
    { label: 'Tops', href: '/shop?category=tops' },
    { label: 'Bottoms', href: '/shop?category=bottoms' },
    { label: 'Accessories', href: '/shop?category=accessories' },
    { label: 'New Arrivals', href: '/shop?filter=new-arrivals' },
    { label: 'Sale', href: '/shop?filter=sale' },
  ],
  help: [
    { label: 'Contact Us', href: '/contact' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
    { label: 'Size Guide', href: '/size-guide' },
    { label: 'FAQ', href: '/faq' },
  ],
  account: [
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/wishlist' },
    { label: 'Addresses', href: '/account/addresses' },
    { label: 'Logout', href: '/logout' },
  ],
};

// Trust badges
export const TRUST_BADGES = [
  { icon: 'Truck', title: 'Free Shipping', subtitle: 'On orders over ₹500' },
  { icon: 'RotateCcw', title: 'Easy Returns', subtitle: '30 days return policy' },
  { icon: 'ShieldCheck', title: 'Secure Payment', subtitle: '100% secure payment' },
  { icon: 'Headphones', title: '24/7 Support', subtitle: 'Dedicated support' },
];

// Sort options
export const SORT_OPTIONS = [
  { value: 'popular', label: 'Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
];

// Size options
export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

// Social links
export const SOCIAL_LINKS = [
  { platform: 'facebook', url: '#' },
  { platform: 'twitter', url: '#' },
  { platform: 'instagram', url: '#' },
  { platform: 'pinterest', url: '#' },
];
