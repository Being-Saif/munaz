import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, LogIn, UserPlus, Heart, ShoppingBag, User } from 'lucide-react';
import { useEffect } from 'react';

const icons = {
  wishlist: Heart,
  cart: ShoppingBag,
  profile: User,
  default: LogIn,
};

const messages = {
  wishlist: {
    title: 'Save Your Favorites',
    subtitle: 'Sign in to create your wishlist and never lose track of items you love.',
  },
  cart: {
    title: 'Ready to Checkout?',
    subtitle: 'Sign in to proceed with your order and enjoy exclusive member benefits.',
  },
  profile: {
    title: 'Your Personal Space',
    subtitle: 'Sign in to manage your profile, track orders, and access your addresses.',
  },
  default: {
    title: 'Join the Munaz Family',
    subtitle: 'Sign in to unlock wishlist, order tracking, and exclusive deals.',
  },
};

const AuthPromptModal = ({ isOpen, onClose, type = 'default' }) => {
  const Icon = icons[type] || icons.default;
  const message = messages[type] || messages.default;

  // Lock body scroll
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-dark/50 backdrop-blur-[4px]"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
          >
            {/* Top Gradient Bar */}
            <div className="h-1.5 bg-gradient-cta" />

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-primary/5 transition-colors"
            >
              <X size={18} className="text-text-muted" />
            </button>

            {/* Content */}
            <div className="px-6 pt-8 pb-6 text-center">
              {/* Icon */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-16 h-16 bg-gradient-cta rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <Icon size={28} className="text-white" />
              </motion.div>

              {/* Text */}
              <h3 className="font-heading text-xl text-dark mb-2">
                {message.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                {message.subtitle}
              </p>

              {/* Buttons */}
              <div className="space-y-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="btn-primary w-full justify-center gap-2 py-3"
                >
                  <LogIn size={16} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={onClose}
                  className="btn-outline w-full justify-center gap-2 py-3"
                >
                  <UserPlus size={16} />
                  Create Account
                </Link>
              </div>

              {/* Skip */}
              <button
                onClick={onClose}
                className="mt-4 text-text-muted text-xs hover:text-dark transition-colors"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthPromptModal;
