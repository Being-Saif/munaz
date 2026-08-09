import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart } from 'lucide-react';
import { cn } from '@utils/cn';

const mockOrders = [
  { id: 'MNZ78234XR', customer: 'Priya Sharma', email: 'priya@email.com', date: '2026-08-09', items: 2, amount: 3499, status: 'confirmed', payment: 'upi' },
  { id: 'MNZ78190AB', customer: 'Ravi Kumar', email: 'ravi@email.com', date: '2026-08-08', items: 1, amount: 1299, status: 'shipped', payment: 'cod' },
  { id: 'MNZ78156CD', customer: 'Anita Patel', email: 'anita@email.com', date: '2026-08-07', items: 3, amount: 5899, status: 'delivered', payment: 'card' },
  { id: 'MNZ78134EF', customer: 'Mohit Singh', email: 'mohit@email.com', date: '2026-08-07', items: 1, amount: 2199, status: 'pending', payment: 'upi' },
  { id: 'MNZ78098GH', customer: 'Neha Gupta', email: 'neha@email.com', date: '2026-08-06', items: 2, amount: 4599, status: 'delivered', payment: 'card' },
  { id: 'MNZ78045IJ', customer: 'Arjun Reddy', email: 'arjun@email.com', date: '2026-08-05', items: 1, amount: 999, status: 'cancelled', payment: 'upi' },
  { id: 'MNZ78012KL', customer: 'Kavya Nair', email: 'kavya@email.com', date: '2026-08-05', items: 4, amount: 7899, status: 'processing', payment: 'card' },
  { id: 'MNZ77989MN', customer: 'Deepak Joshi', email: 'deepak@email.com', date: '2026-08-04', items: 2, amount: 3299, status: 'shipped', payment: 'cod' },
];

const statusOptions = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AdminOrders = () => {
  const { darkMode } = useOutletContext();
  const [orders, setOrders] = useState(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const updateStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  const filtered = orders.filter((o) => {
    const matchesSearch = o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Orders</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{orders.length} total orders</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border flex-1', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <Search size={16} className="text-gray-400" />
          <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by order ID or customer..." className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')} />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={cn('px-3 py-2.5 rounded-lg border text-sm', darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900')}
        >
          <option value="all">All Status</option>
          {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
      </div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                <th className="px-4 py-3 text-left font-medium">Order</th>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Date</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Payment</th>
                <th className="px-4 py-3 text-left font-medium">Amount</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
              {filtered.map((order) => (
                <tr key={order.id} className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}>
                  <td className={cn('px-4 py-3.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>#{order.id}</td>
                  <td className="px-4 py-3.5">
                    <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{order.customer}</p>
                    <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{order.email}</p>
                  </td>
                  <td className={cn('px-4 py-3.5 text-sm hidden md:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>{order.date}</td>
                  <td className={cn('px-4 py-3.5 text-sm uppercase hidden sm:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>{order.payment}</td>
                  <td className={cn('px-4 py-3.5 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>₹{order.amount.toLocaleString()}</td>
                  <td className="px-4 py-3.5">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.id, e.target.value)}
                      className={cn('text-xs font-medium rounded-full px-2.5 py-1 border-0 outline-none cursor-pointer capitalize', statusColors[order.status])}
                    >
                      {statusOptions.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={cn('text-center py-12', darkMode ? 'text-gray-500' : 'text-gray-400')}>
            <ShoppingCart size={40} className="mx-auto mb-3 opacity-50" />
            <p>No orders found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminOrders;
