import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { cn } from '@utils/cn';

const mockCustomers = [
  { id: 1, name: 'Priya Sharma', email: 'priya@email.com', orders: 5, spent: 12499, joined: '2026-06-15', status: 'active' },
  { id: 2, name: 'Ravi Kumar', email: 'ravi@email.com', orders: 3, spent: 5699, joined: '2026-07-01', status: 'active' },
  { id: 3, name: 'Anita Patel', email: 'anita@email.com', orders: 8, spent: 22890, joined: '2026-05-20', status: 'active' },
  { id: 4, name: 'Mohit Singh', email: 'mohit@email.com', orders: 1, spent: 2199, joined: '2026-08-01', status: 'active' },
  { id: 5, name: 'Neha Gupta', email: 'neha@email.com', orders: 4, spent: 9899, joined: '2026-06-28', status: 'active' },
  { id: 6, name: 'Arjun Reddy', email: 'arjun@email.com', orders: 2, spent: 3499, joined: '2026-07-15', status: 'inactive' },
];

const AdminCustomers = () => {
  const { darkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = mockCustomers.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Customers</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{mockCustomers.length} registered customers</p>
      </div>

      <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <Search size={16} className="text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search customers..." className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')} />
      </div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                <th className="px-4 py-3 text-left font-medium">Customer</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Orders</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Total Spent</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Joined</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
              {filtered.map((customer) => (
                <tr key={customer.id} className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs font-bold text-primary">
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{customer.name}</p>
                        <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cn('px-4 py-3.5 text-sm hidden sm:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>{customer.orders}</td>
                  <td className={cn('px-4 py-3.5 text-sm font-medium hidden md:table-cell', darkMode ? 'text-white' : 'text-gray-900')}>₹{customer.spent.toLocaleString()}</td>
                  <td className={cn('px-4 py-3.5 text-sm hidden lg:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>{customer.joined}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium', customer.status === 'active' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400')}>
                      {customer.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={cn('text-center py-12', darkMode ? 'text-gray-500' : 'text-gray-400')}>
            <Users size={40} className="mx-auto mb-3 opacity-50" /><p>No customers found</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminCustomers;
