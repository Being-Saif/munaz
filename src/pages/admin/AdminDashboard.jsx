import { motion } from 'framer-motion';
import { useOutletContext } from 'react-router-dom';
import { IndianRupee, ShoppingCart, Users, Package, TrendingUp, TrendingDown, ArrowUpRight } from 'lucide-react';
import { cn } from '@utils/cn';

const stats = [
  { label: 'Total Revenue', value: '₹2,45,890', change: '+12.5%', up: true, icon: IndianRupee, color: 'from-violet-500 to-purple-600' },
  { label: 'Total Orders', value: '1,284', change: '+8.2%', up: true, icon: ShoppingCart, color: 'from-blue-500 to-cyan-500' },
  { label: 'Customers', value: '3,420', change: '+5.1%', up: true, icon: Users, color: 'from-emerald-500 to-green-500' },
  { label: 'Products', value: '156', change: '+2', up: true, icon: Package, color: 'from-orange-500 to-amber-500' },
];

const recentOrders = [
  { id: 'MNZ78234XR', customer: 'Priya Sharma', date: '2 hours ago', amount: '₹3,499', status: 'confirmed', items: 2 },
  { id: 'MNZ78190AB', customer: 'Ravi Kumar', date: '5 hours ago', amount: '₹1,299', status: 'shipped', items: 1 },
  { id: 'MNZ78156CD', customer: 'Anita Patel', date: '1 day ago', amount: '₹5,899', status: 'delivered', items: 3 },
  { id: 'MNZ78134EF', customer: 'Mohit Singh', date: '1 day ago', amount: '₹2,199', status: 'pending', items: 1 },
  { id: 'MNZ78098GH', customer: 'Neha Gupta', date: '2 days ago', amount: '₹4,599', status: 'delivered', items: 2 },
];

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  confirmed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  processing: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  shipped: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
  delivered: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

const AdminDashboard = () => {
  const { darkMode } = useOutletContext();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
          Dashboard
        </h1>
        <p className={cn('text-sm mt-1', darkMode ? 'text-gray-400' : 'text-gray-500')}>
          Welcome back! Here&apos;s what&apos;s happening with your store.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className={cn('rounded-xl p-5 border transition-all duration-200 hover:shadow-lg',
              darkMode ? 'bg-gray-800 border-gray-700 hover:border-gray-600' : 'bg-white border-gray-200 hover:border-gray-300'
            )}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{stat.label}</p>
                <p className={cn('text-2xl font-bold mt-1', darkMode ? 'text-white' : 'text-gray-900')}>{stat.value}</p>
              </div>
              <div className={cn('w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center', stat.color)}>
                <stat.icon size={18} className="text-white" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              {stat.up ? (
                <TrendingUp size={14} className="text-green-500" />
              ) : (
                <TrendingDown size={14} className="text-red-500" />
              )}
              <span className={cn('text-xs font-medium', stat.up ? 'text-green-500' : 'text-red-500')}>
                {stat.change}
              </span>
              <span className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>vs last month</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
      >
        <div className={cn('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Recent Orders</h2>
          <button className="text-primary text-sm font-medium flex items-center gap-1 hover:underline">
            View All <ArrowUpRight size={14} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                <th className="px-5 py-3 text-left font-medium">Order ID</th>
                <th className="px-5 py-3 text-left font-medium">Customer</th>
                <th className="px-5 py-3 text-left font-medium hidden sm:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-medium">Amount</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
              {recentOrders.map((order) => (
                <tr key={order.id} className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}>
                  <td className={cn('px-5 py-3.5 text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>
                    #{order.id}
                  </td>
                  <td className={cn('px-5 py-3.5 text-sm', darkMode ? 'text-gray-300' : 'text-gray-700')}>
                    {order.customer}
                  </td>
                  <td className={cn('px-5 py-3.5 text-sm hidden sm:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                    {order.date}
                  </td>
                  <td className={cn('px-5 py-3.5 text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
                    {order.amount}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn('inline-flex px-2.5 py-0.5 text-xs font-medium rounded-full capitalize', statusColors[order.status])}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
