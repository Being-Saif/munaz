import { useState, useEffect, useCallback } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, Package, PlayCircle } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  draft: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  inactive: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

const AdminProducts = () => {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showDelete, setShowDelete] = useState(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = { limit: 50 };
      if (searchQuery) params.search = searchQuery;
      if (categoryFilter) params.category = categoryFilter;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/products/admin/all', { params });
      setProducts(res.data || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, categoryFilter, statusFilter]);

  useEffect(() => {
    api.get('/categories').then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    const debounce = setTimeout(fetchProducts, 300);
    return () => clearTimeout(debounce);
  }, [fetchProducts]);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      toast.success('Product deleted');
    } catch (err) {
      toast.error('Failed to delete product');
    }
    setShowDelete(null);
  };

  const handleToggleActive = async (product) => {
    const newStatus = product.status === 'active' ? 'inactive' : 'active';
    try {
      const res = await api.put(`/products/${product._id}`, { status: newStatus });
      setProducts((prev) => prev.map((p) => (p._id === product._id ? res.data : p)));
      toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>All Products</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{products.length} products</p>
        </div>
        <button
          onClick={() => navigate('/admin/products/create')}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border flex-1', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className={cn('px-3 py-2.5 rounded-lg border text-sm', darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900')}
        >
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className={cn('px-3 py-2.5 rounded-lg border text-sm', darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900')}
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className={cn('rounded-xl border p-8 text-center', darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500')}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading products...
        </div>
      )}

      {/* Products Table */}
      {!loading && (
        <div className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                  <th className="px-4 py-3 text-left font-medium">Product</th>
                  <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
                {products.map((product) => (
                  <motion.tr
                    key={product._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.thumbnail ? (
                          <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        ) : (
                          <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', darkMode ? 'bg-gray-700' : 'bg-gray-100')}>
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className={cn('text-sm font-medium line-clamp-1', darkMode ? 'text-white' : 'text-gray-900')}>{product.name || 'Untitled Product'}</p>
                          <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className={cn('px-4 py-3 text-sm hidden md:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                      {product.category?.name || product.subcategory || '—'}
                    </td>
                    <td className="px-4 py-3">
                      {product.price ? (
                        <>
                          <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>₹{product.salePrice || product.price}</p>
                          {product.salePrice && <p className="text-xs text-gray-400 line-through">₹{product.price}</p>}
                        </>
                      ) : <span className="text-xs text-gray-400">—</span>}
                    </td>
                    <td className={cn('px-4 py-3 text-sm hidden sm:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>{product.totalStock ?? 0}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => product.status !== 'draft' && handleToggleActive(product)}
                        className={cn('px-2 py-0.5 text-xs rounded-full capitalize font-medium', STATUS_STYLES[product.status] || STATUS_STYLES.inactive, product.status !== 'draft' && 'cursor-pointer')}
                      >
                        {product.status}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {product.status === 'draft' ? (
                          <button
                            onClick={() => navigate(`/admin/products/${product._id}/edit`)}
                            className={cn('flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors', darkMode ? 'bg-primary/20 text-primary-light hover:bg-primary/30' : 'bg-primary/10 text-primary hover:bg-primary/20')}
                          >
                            <PlayCircle size={13} /> Continue
                          </button>
                        ) : (
                          <button onClick={() => navigate(`/admin/products/${product._id}/edit`)} className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600')}>
                            <Edit2 size={15} />
                          </button>
                        )}
                        <button onClick={() => setShowDelete(product)} className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-600')}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          {products.length === 0 && (
            <div className={cn('text-center py-12', darkMode ? 'text-gray-500' : 'text-gray-400')}>
              <Package size={40} className="mx-auto mb-3 opacity-50" />
              <p>No products found</p>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Product?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Are you sure you want to delete &quot;{showDelete.name || 'this draft'}&quot;? This action cannot be undone.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDelete(null)} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')}>Cancel</button>
                <button onClick={() => handleDelete(showDelete._id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
