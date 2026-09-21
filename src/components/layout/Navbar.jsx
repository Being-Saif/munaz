import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Heart, ShoppingBag, User, Menu, X, Search } from 'lucide-react';
import { cn } from '@utils/cn';
import Logo from '@components/common/Logo';
import { NAV_LINKS } from '@utils/constants';
import { selectCartTotalItems } from '@redux/slices/cartSlice';
import { selectWishlistCount } from '@redux/slices/wishlistSlice';
import { selectIsAuthenticated } from '@redux/slices/authSlice';
import { openCart } from '@redux/slices/uiSlice';
import { isActiveRoute } from '@utils/helpers';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector(selectCartTotalItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Scroll detection
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <>
      {/* Main Navbar */}
      <header className={cn(
        'fixed top-0 left-0 right-0 z-50 bg-white border-b transition-shadow duration-200',
        scrolled ? 'shadow-md border-gray-100' : 'border-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">

            {/* Left: Hamburger (mobile) + Logo */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-1.5 -ml-1.5 rounded-md hover:bg-gray-100"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/" className="flex-shrink-0">
                <Logo variant="dark" size="lg" to={null} />
              </Link>
            </div>

            {/* Center: Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isActiveRoute(location.pathname, link.href)
                      ? 'text-primary'
                      : 'text-gray-700 hover:text-primary'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right: Icons */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Search"
              >
                <Search size={20} className="text-gray-700" />
              </button>

              {/* Wishlist - hidden on small mobile */}
              <button
                onClick={() => isAuthenticated ? navigate('/wishlist') : navigate('/login')}
                className="hidden sm:flex relative p-2 rounded-md hover:bg-gray-100"
                aria-label="Wishlist"
              >
                <Heart size={20} className="text-gray-700" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => dispatch(openCart())}
                className="relative p-2 rounded-md hover:bg-gray-100"
                aria-label="Cart"
              >
                <ShoppingBag size={20} className="text-gray-700" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User */}
              <button
                onClick={() => isAuthenticated ? navigate('/account') : navigate('/login')}
                className="p-2 rounded-md hover:bg-gray-100"
                aria-label="Account"
              >
                <User size={20} className="text-gray-700" />
              </button>
            </div>
          </div>

          {/* Search Bar (expandable) */}
          {searchOpen && (
            <div className="pb-3 pt-1">
              <form onSubmit={handleSearch} className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  autoFocus
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for kurtas, sarees, co-ords..."
                  className="w-full pl-10 pr-20 py-2.5 rounded-lg border border-gray-200 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-white text-sm font-medium px-3 py-1.5 rounded-md hover:bg-primary-dark transition-colors">
                  Search
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden" onClick={() => setMobileOpen(false)}>
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      {/* Mobile Slide-in Menu */}
      <div className={cn(
        'fixed top-14 left-0 w-72 h-[calc(100vh-3.5rem)] bg-white z-50 transform transition-transform duration-300 ease-in-out lg:hidden shadow-xl overflow-y-auto',
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <nav className="p-5 space-y-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-lg text-base font-medium transition-colors',
                isActiveRoute(location.pathname, link.href)
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              {link.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-100 my-3" />

          {/* Extra Links */}
          <Link
            to="/wishlist"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
          >
            <Heart size={18} />
            Wishlist
            {wishlistCount > 0 && <span className="ml-auto text-xs bg-secondary text-white px-2 py-0.5 rounded-full">{wishlistCount}</span>}
          </Link>

          {isAuthenticated ? (
            <Link
              to="/account"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              <User size={18} />
              My Account
            </Link>
          ) : (
            <Link
              to="/login"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium text-primary hover:bg-primary/5"
            >
              <User size={18} />
              Login / Sign Up
            </Link>
          )}
        </nav>
      </div>

      {/* Spacer to prevent content from hiding behind fixed navbar */}
      <div className="h-14 sm:h-16" />
    </>
  );
};

export default Navbar;
