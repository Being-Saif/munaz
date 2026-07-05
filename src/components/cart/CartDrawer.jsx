import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectCartItems, selectCartTotalItems, selectCartSubtotal, selectCartTotal, removeFromCart, updateQuantity } from '@redux/slices/cartSlice';
import { selectIsCartOpen, closeCart } from '@redux/slices/uiSlice';
import { formatPrice } from '@utils/formatters';
import { cn } from '@utils/cn';

// Overlay animation
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

// Drawer slide animation (spring physics)
const drawerVariants = {
  hidden: { x: '100%' },
  visible: {
    x: '0%',
    transition: { type: 'spring', stiffness: 280, damping: 24 },
  },
  exit: {
    x: '100%',
    transition: { type: 'spring', stiffness: 300, damping: 30 },
  },
};

// Item animation
const itemVariants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50, height: 0, marginBottom: 0, padding: 0, transition: { duration: 0.3 } },
};

const CartDrawer = () => {
  const dispatch = useDispatch();
  const isOpen = useSelector(selectIsCartOpen);
  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const subtotal = useSelector(selectCartSubtotal);
  const total = useSelector(selectCartTotal);
  const shipping = useSelector((state) => state.cart.shipping);
  const discount = useSelector((state) => state.cart.discount);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) dispatch(closeCart());
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, dispatch]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2 }}
            onClick={() => dispatch(closeCart())}
            className="absolute inset-0 bg-dark/50 backdrop-blur-[4px]"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-0 right-0 h-full w-full sm:w-[420px] bg-surface shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-heading text-lg font-semibold text-dark">
                  Shopping Cart
                </h2>
                <span className="ml-1 w-6 h-6 bg-primary/10 text-primary text-xs font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              </div>
              <button
                onClick={() => dispatch(closeCart())}
                className="p-2 rounded-full hover:bg-primary/5 transition-colors"
                aria-label="Close cart"
              >
                <X size={20} className="text-dark/60" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-hide">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag size={32} className="text-primary/40" />
                  </div>
                  <h3 className="font-heading text-lg text-dark mb-2">Your cart is empty</h3>
                  <p className="text-text-muted text-sm mb-6">Looks like you haven't added anything yet.</p>
                  <button
                    onClick={() => dispatch(closeCart())}
                    className="btn-primary text-sm px-6 py-2.5"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      layout
                      className="flex gap-3 mb-4 pb-4 border-b border-border last:border-0"
                    >
                      {/* Image */}
                      <div className="w-20 h-24 rounded-md overflow-hidden flex-shrink-0 bg-background">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-body text-sm font-semibold text-dark truncate pr-6">
                          {item.name}
                        </h4>
                        <p className="text-text-muted text-xs mt-0.5">
                          Size: {item.size} | Color: {item.color}
                        </p>

                        {/* Price + Quantity */}
                        <div className="flex items-center justify-between mt-3">
                          <span className="font-button text-sm font-bold text-dark">
                            {formatPrice(item.price * item.quantity)}
                          </span>

                          {/* Quantity Controls */}
                          <div className="flex items-center gap-1 bg-background rounded-md">
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                              disabled={item.quantity >= 10}
                              className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-primary/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Remove Button */}
                      <button
                        onClick={() => dispatch(removeFromCart(item.id))}
                        className="absolute top-0 right-0 p-1 text-text-muted hover:text-error transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer — Totals + CTA */}
            {items.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3">
                {/* Pricing Breakdown */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-text-secondary">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-success">Free</span> : formatPrice(shipping)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span>Discount</span>
                      <span>-{formatPrice(discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-dark text-base pt-2 border-t border-border">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <Link
                  to="/checkout"
                  onClick={() => dispatch(closeCart())}
                  className="btn-primary w-full justify-center gap-2 text-sm py-3.5"
                >
                  Proceed to Checkout
                  <ArrowRight size={16} />
                </Link>
                <button
                  onClick={() => dispatch(closeCart())}
                  className="w-full text-center text-sm text-primary font-medium hover:underline py-1"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
