import { useState, useEffect, Fragment } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, ChevronDown, MapPin, Phone, Mail, Printer } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import { printInvoice } from '@utils/printInvoice';
import toast from 'react-hot-toast';

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-purple-100 text-purple-700',
  shipped: 'bg-indigo-100 text-indigo-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const AdminOrders = () => {
  const { darkMode } = useOutletContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [storeSettings, setStoreSettings] = useState({});

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => {
    api.get('/settings/public')
      .then((res) => setStoreSettings(res.data || {}))
      .catch(() => { /* invoice falls back to defaults */ });
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all?limit=50');
      setOrders(res.data || []);
    } catch { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  const updateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch { toast.error('Failed to update status'); }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = (o.orderNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) || (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Orders</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{orders.length} total orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border flex-1', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <Search size={16} className="text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by order ID or customer..." className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={cn('px-3 py-2.5 rounded-lg border text-sm', darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900')}>
          <option value="all">All Status</option>
          {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading && <div className={cn('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading orders...</div>}

      {!loading && (
        <div className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                  <th className="px-4 py-3 text-left font-medium">Order</th>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Date</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Items</th>
                  <th className="px-4 py-3 text-left font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium w-10"></th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
                {filtered.map((order) => {
                  const isExpanded = expandedId === order._id;
                  const addr = order.shippingAddress || {};
                  return (
                  <Fragment key={order._id}>
                  <tr className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}>
                    <td className={cn('px-4 py-3.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>#{order.orderNumber}</td>
                    <td className="px-4 py-3.5">
                      <p className={cn('text-sm', darkMode ? 'text-white' : 'text-gray-900')}>{order.user?.name || addr.fullName || 'Guest'}</p>
                      <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{order.user?.email}</p>
                    </td>
                    <td className={cn('px-4 py-3.5 text-sm hidden md:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    <td className={cn('px-4 py-3.5 text-sm hidden sm:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>{order.items?.length || 0}</td>
                    <td className={cn('px-4 py-3.5 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>₹{order.totalAmount?.toLocaleString()}</td>
                    <td className="px-4 py-3.5">
                      <select value={order.status} onChange={(e) => updateStatus(order._id, e.target.value)} className={cn('text-xs font-medium rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer capitalize', statusColors[order.status] || 'bg-gray-100 text-gray-600')}>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : order._id)}
                        className={cn('p-1 rounded transition-transform', isExpanded && 'rotate-180', darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-100')}
                        title="View details"
                      >
                        <ChevronDown size={16} />
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={cn(darkMode ? 'bg-gray-700/20' : 'bg-gray-50')}>
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                          {/* Customer & shipping */}
                          <div className="space-y-1.5">
                            <p className={cn('text-xs font-semibold uppercase tracking-wide mb-1', darkMode ? 'text-gray-400' : 'text-gray-500')}>Ship To</p>
                            <p className={cn('font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{addr.fullName}</p>
                            {order.user?.email && <p className={cn('flex items-center gap-1.5 text-xs', darkMode ? 'text-gray-300' : 'text-gray-600')}><Mail size={12} /> {order.user.email}</p>}
                            {addr.phone && <p className={cn('flex items-center gap-1.5 text-xs', darkMode ? 'text-gray-300' : 'text-gray-600')}><Phone size={12} /> {addr.phone}</p>}
                            <p className={cn('flex items-start gap-1.5 text-xs', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                              <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                              <span>{addr.address}{addr.address ? ', ' : ''}{addr.city}{addr.city ? ', ' : ''}{addr.state} - <strong>{addr.pincode}</strong></span>
                            </p>
                            <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                              Payment: {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod?.toUpperCase()} · {order.shippingMethod} shipping
                            </p>
                          </div>
                          {/* Items */}
                          <div className="space-y-1.5">
                            <p className={cn('text-xs font-semibold uppercase tracking-wide mb-1', darkMode ? 'text-gray-400' : 'text-gray-500')}>Items ({order.items?.length || 0})</p>
                            {(order.items || []).map((it, i) => (
                              <div key={i} className={cn('flex items-center justify-between text-xs', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                                <span className="truncate mr-2">{it.name} {it.size ? `· ${it.size}` : ''} {it.color ? `· ${it.color}` : ''} × {it.quantity}</span>
                                <span className="flex-shrink-0">₹{(it.price * it.quantity).toLocaleString('en-IN')}</span>
                              </div>
                            ))}
                            <div className={cn('flex items-center justify-between text-xs pt-1.5 mt-1.5 border-t font-semibold', darkMode ? 'border-gray-600 text-white' : 'border-gray-200 text-gray-900')}>
                              <span>Total</span>
                              <span>₹{order.totalAmount?.toLocaleString('en-IN')}</span>
                            </div>
                            <button
                              onClick={() => printInvoice(order, storeSettings)}
                              className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
                            >
                              <Printer size={15} /> Print Invoice / Receipt
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                  </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className={cn('text-center py-12', darkMode ? 'text-gray-500' : 'text-gray-400')}>
              <ShoppingCart size={40} className="mx-auto mb-3 opacity-50" /><p>No orders found</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
