import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check } from 'lucide-react';
import api from '@services/api';

/**
 * CouponPopup — a dismissible promo popup shown on the home page for coupons
 * whose displayLocation is 'home'. Shows image + name + optional description +
 * code. Dismissal is remembered per browser session (so it doesn't nag on every
 * navigation) and per-coupon (a new coupon code will show again).
 */
const CouponPopup = () => {
  const [coupon, setCoupon] = useState(null);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let timer;
    api.get('/coupons?location=home')
      .then((res) => {
        const list = res.data || [];
        if (list.length === 0) return;
        const c = list[0];
        const dismissed = sessionStorage.getItem('munaz_coupon_dismissed');
        // Show unless this exact coupon was already dismissed this session.
        if (dismissed === c._id) return;
        setCoupon(c);
        timer = setTimeout(() => setOpen(true), 900);
      })
      .catch(() => { /* no popup if it fails */ });
    return () => clearTimeout(timer);
  }, []);

  const close = () => {
    setOpen(false);
    if (coupon?._id) sessionStorage.setItem('munaz_coupon_dismissed', coupon._id);
  };

  const copyCode = () => {
    if (!coupon?.code) return;
    navigator.clipboard?.writeText(coupon.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  if (!coupon) return null;

  const discountLabel = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% OFF`
    : `₹${coupon.discountValue} OFF`;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={close}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-sm bg-surface rounded-2xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors"
            >
              <X size={16} />
            </button>

            {coupon.image && (
              <img src={coupon.image} alt={coupon.name} className="w-full h-44 object-cover" />
            )}

            <div className="p-6 text-center">
              <span className="inline-block mb-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-bold uppercase tracking-wide">
                {discountLabel}
              </span>
              <h3 className="font-heading text-xl text-dark mb-1">{coupon.name}</h3>
              {coupon.description && (
                <p className="text-text-secondary text-sm mb-4">{coupon.description}</p>
              )}

              {/* Code with copy */}
              <div className="flex items-center justify-center gap-2 mt-3">
                <span className="px-4 py-2 rounded-lg border-2 border-dashed border-primary/40 bg-primary/5 font-mono font-bold text-primary tracking-widest">
                  {coupon.code}
                </span>
                <button
                  onClick={copyCode}
                  className="w-10 h-10 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary-dark transition-colors"
                  aria-label="Copy code"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
              {coupon.minOrderValue > 0 && (
                <p className="text-text-muted text-xs mt-3">On orders above ₹{coupon.minOrderValue}</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CouponPopup;
