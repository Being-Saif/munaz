import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const AdminCustomers = () => {
  const { darkMode } = useOutletContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/users?limit=50');
      setCustomers(res.data || []);
    } catch { toast.error('Failed to load customers'); }
    finally { setLoading(false); }
  };

  const filtered = customers.filter(c =>
    c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Customers</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{customers.length} registered users</p>
      </div>

      <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <Search size={16} className="text-gray-400" />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search customers..." className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')} />
      </div>

      {loading && <div className={cn('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>}

      {!loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                  <th className="px-4 py-3 text-left font-medium">Customer</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Joined</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
                {filtered.map((customer) => (
                  <tr key={customer._id} className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs font-bold text-primary">
                          {customer.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                        </div>
                        <div>
                          <p className={cn('text-sm font-medium', darkMode ? 'text-white' : 'text-gray-900')}>{customer.name}</p>
                          <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{customer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3.5 text-sm hidden sm:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      <span className={cn('px-2 py-0.5 text-xs rounded-full', customer.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600')}>{customer.role}</span>
                    </td>
                    <td className={cn('px-4 py-3.5 text-sm hidden md:table-cell', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                      {new Date(customer.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={cn('px-2 py-0.5 text-xs rounded-full font-medium', customer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700')}>
                        {customer.isActive ? 'Active' : 'Inactive'}
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
      )}
    </div>
  );
};

export default AdminCustomers;
