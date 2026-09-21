import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, ShoppingBag, MapPin, Phone, Mail, X } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';

const LAST_SEEN_KEY = 'munaz_admin_orders_last_seen';

// Relative time like "5m ago", "2h ago", "3d ago".
const timeAgo = (dateStr) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
};

const AdminNotifications = ({ darkMode }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [lastSeen, setLastSeen] = useState(() => Number(localStorage.getItem(LAST_SEEN_KEY)) || 0);
  const panelRef = useRef(null);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await api.get('/orders/admin/all?limit=15');
      setOrders(res.data || []);
    } catch {
      // silently ignore — bell just shows nothing
    }
  }, []);

  // Initial load + poll every 60s so new orders appear without a refresh.
  useEffect(() => {
    fetchOrders();
    const id = setInterval(fetchOrders, 60000);
    return () => clearInterval(id);
  }, [fetchOrders]);

  // Close dropdown on outside click.
  useEffect(() => {
    if (!open) return;
    const onClick = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [open]);

  // Count orders newer than the last time the admin opened the panel.
  const unseenCount = orders.filter((o) => new Date(o.createdAt).getTime() > lastSeen).length;

  const handleToggle = () => {
    const next = !open;
    setOpen(next);
    if (next && orders.length > 0) {
      // Mark newest order time as "seen" when opening.
      const newest = Math.max(...orders.map((o) => new Date(o.createdAt).getTime()));
      localStorage.setItem(LAST_SEEN_KEY, String(newest));
      setLastSeen(newest);
    }
  };

  return (
    <div className="relative" ref={panelRef}>
      <button
        onClick={handleToggle}
        className={cn('p-2.5 rounded-lg relative transition-colors', darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}
        title="Notifications"
      >
        <Bell size={18} />
        {unseenCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-secondary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            {unseenCount > 9 ? '9+' : unseenCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute right-0 mt-2 w-[340px] sm:w-[400px] max-h-[70vh] overflow-y-auto rounded-xl border shadow-2xl z-50',
              darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
            )}
          >
            {/* Header */}
            <div className={cn('flex items-center justify-between px-4 py-3 border-b sticky top-0', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
              <h3 className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                New Orders
              </h3>
              <button onClick={() => setOpen(false)} className={cn('p-1 rounded', darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}>
                <X size={15} />
              </button>
            </div>

            {/* List */}
            {orders.length === 0 ? (
              <div className={cn('text-center py-10 px-4', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                <ShoppingBag size={32} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">No orders yet</p>
              </div>
            ) : (
              <ul className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
                {orders.map((order) => {
                  const isNew = new Date(order.createdAt).getTime() > lastSeen;
                  const isExpanded = expandedId === order._id;
                  const addr = order.shippingAddress || {};
                  return (
                    <li key={order._id} className={cn(isNew && (darkMode ? 'bg-primary/10' : 'bg-primary/5'))}>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                        className={cn('w-full text-left px-4 py-3 transition-colors', darkMode ? 'hover:bg-gray-700/40' : 'hover:bg-gray-50')}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={cn('text-sm font-medium truncate', darkMode ? 'text-white' : 'text-gray-900')}>
                              {addr.fullName || order.user?.name || 'Customer'}
                              {isNew && <span className="ml-2 text-[9px] uppercase font-bold text-secondary">new</span>}
                            </p>
                            <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                              #{order.orderNumber} · {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                            <p className={cn('text-[10px]', darkMode ? 'text-gray-500' : 'text-gray-400')}>{timeAgo(order.createdAt)}</p>
                          </div>
                        </div>
                      </button>

                      {/* Expanded details — full customer + shipping info */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className={cn('px-4 pb-3 pt-1 text-xs space-y-1.5', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                              {order.user?.email && (
                                <p className="flex items-center gap-1.5"><Mail size={12} className="flex-shrink-0" /> {order.user.email}</p>
                              )}
                              {addr.phone && (
                                <p className="flex items-center gap-1.5"><Phone size={12} className="flex-shrink-0" /> {addr.phone}</p>
                              )}
                              {(addr.address || addr.city) && (
                                <p className="flex items-start gap-1.5">
                                  <MapPin size={12} className="flex-shrink-0 mt-0.5" />
                                  <span>
                                    {addr.address}{addr.address ? ', ' : ''}{addr.city}{addr.city ? ', ' : ''}{addr.state} - <strong>{addr.pincode}</strong>
                                  </span>
                                </p>
                              )}
                              <div className={cn('flex items-center justify-between pt-1.5 mt-1.5 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
                                <span className="capitalize">
                                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.toUpperCase()} · {order.status}
                                </span>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setOpen(false); navigate('/admin/orders'); }}
                                  className="text-primary font-medium hover:underline"
                                >
                                  View in Orders →
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* Footer */}
            {orders.length > 0 && (
              <button
                onClick={() => { setOpen(false); navigate('/admin/orders'); }}
                className={cn('w-full text-center py-2.5 text-sm font-medium border-t sticky bottom-0', darkMode ? 'bg-gray-800 border-gray-700 text-primary hover:bg-gray-700/40' : 'bg-white border-gray-200 text-primary hover:bg-gray-50')}
              >
                View all orders
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminNotifications;
