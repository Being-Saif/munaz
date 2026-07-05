import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react';
import { cn } from '@utils/cn';
import { NAV_LINKS, APP_NAME } from '@utils/constants';
import { selectCartTotalItems } from '@redux/slices/cartSlice';
import { selectWishlistCount } from '@redux/slices/wishlistSlice';
import { selectIsAuthenticated } from '@redux/slices/authSlice';
import { openCart, openMobileMenu, closeMobileMenu, selectIsMobileMenuOpen } from '@redux/slices/uiSlice';
import { isActiveRoute } from '@utils/helpers';
import AuthPromptModal from '@components/common/AuthPromptModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [authPrompt, setAuthPrompt] = useState({ open: false, type: 'default' });
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartCount = useSelector(selectCartTotalItems);
  const wishlistCount = useSelector(selectWishlistCount);
  const isMobileMenuOpen = useSelector(selectIsMobileMenuOpen);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Scroll detection for glass effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-velora',
        isScrolled
          ? 'glass shadow-md py-4 lg:py-5'
          : 'bg-transparent py-5 lg:py-7'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo — Bigger */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-heading text-3xl sm:text-4xl lg:text-[2.5rem] font-bold italic text-dark tracking-wide">
              {APP_NAME}
            </h1>
          </Link>

          {/* Desktop Navigation — Larger text, more gap */}
          <nav className="hidden lg:flex items-center gap-10 xl:gap-12">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  'font-body text-[15px] font-medium transition-colors duration-300 link-hover py-1',
                  isActiveRoute(location.pathname, link.href)
                    ? 'text-primary'
                    : 'text-dark/80 hover:text-primary'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action Icons — More spacious */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {/* Search */}
            <button
              className="p-2.5 lg:p-3 rounded-full hover:bg-primary/5 transition-colors duration-300"
              aria-label="Search"
            >
              <Search size={22} className="text-dark/80" />
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/wishlist');
                } else {
                  setAuthPrompt({ open: true, type: 'wishlist' });
                }
              }}
              className="relative p-2.5 lg:p-3 rounded-full hover:bg-primary/5 transition-colors duration-300"
              aria-label="Wishlist"
            >
              <Heart size={22} className="text-dark/80" />
              {wishlistCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-secondary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {wishlistCount}
                </motion.span>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => dispatch(openCart())}
              className="relative p-2.5 lg:p-3 rounded-full hover:bg-primary/5 transition-colors duration-300"
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={22} className="text-dark/80" />
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  className="absolute top-0.5 right-0.5 w-5 h-5 bg-primary text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm"
                >
                  {cartCount}
                </motion.span>
              )}
            </button>

            {/* User */}
            <button
              onClick={() => {
                if (isAuthenticated) {
                  navigate('/account');
                } else {
                  setAuthPrompt({ open: true, type: 'profile' });
                }
              }}
              className="hidden sm:flex p-2.5 lg:p-3 rounded-full hover:bg-primary/5 transition-colors duration-300"
              aria-label="Account"
            >
              <User size={22} className="text-dark/80" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => dispatch(isMobileMenuOpen ? closeMobileMenu() : openMobileMenu())}
              className="lg:hidden p-2.5 rounded-full hover:bg-primary/5 transition-colors duration-300"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="lg:hidden bg-surface border-t border-border overflow-hidden"
          >
            <nav className="section-container py-8 flex flex-col gap-5">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    to={link.href}
                    onClick={() => dispatch(closeMobileMenu())}
                    className={cn(
                      'block text-xl font-medium py-2 transition-colors',
                      isActiveRoute(location.pathname, link.href)
                        ? 'text-primary'
                        : 'text-dark/80 hover:text-primary'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Auth Prompt Modal */}
      <AuthPromptModal
        isOpen={authPrompt.open}
        onClose={() => setAuthPrompt({ open: false, type: 'default' })}
        type={authPrompt.type}
      />
    </header>
  );
};

export default Navbar;
