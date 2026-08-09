import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, Package, Eye } from 'lucide-react';
import { cn } from '@utils/cn';
import products from '@data/products.json';

const AdminProducts = () => {
  const { darkMode } = useOutletContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [productList, setProductList] = useState(products);

  const filtered = productList.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = (id) => {
    setProductList((prev) => prev.filter((p) => p.id !== id));
    setShowDelete(null);
  };

  const handleSave = (formData) => {
    if (editingProduct) {
      setProductList((prev) => prev.map((p) => p.id === editingProduct.id ? { ...p, ...formData } : p));
    } else {
      const newProduct = { ...formData, id: `prod_${Date.now()}`, slug: formData.name.toLowerCase().replace(/\s+/g, '-'), sold: 0, ratingsAverage: 0, ratingsCount: 0 };
      setProductList((prev) => [newProduct, ...prev]);
    }
    setShowModal(false);
    setEditingProduct(null);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Products</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{productList.length} total products</p>
        </div>
        <button
          onClick={() => { setEditingProduct(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className={cn('flex items-center gap-2 px-3 py-2.5 rounded-lg border', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products by name or category..."
          className={cn('bg-transparent text-sm outline-none flex-1', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
        />
      </div>

      {/* Products Table */}
      <div className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                <th className="px-4 py-3 text-left font-medium">Product</th>
                <th className="px-4 py-3 text-left font-medium hidden md:table-cell">Category</th>
                <th className="px-4 py-3 text-left font-medium">Price</th>
                <th className="px-4 py-3 text-left font-medium hidden sm:table-cell">Stock</th>
                <th className="px-4 py-3 text-left font-medium hidden lg:table-cell">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
              {filtered.map((product) => (
                <motion.tr
                  key={product.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={cn('transition-colors', darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50')}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.thumbnail} alt={product.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                      <div>
                        <p className={cn('text-sm font-medium line-clamp-1', darkMode ? 'text-white' : 'text-gray-900')}>{product.name}</p>
                        <p className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{product.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className={cn('px-4 py-3 text-sm hidden md:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {product.subcategory || product.category}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <p className={cn('text-sm font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>₹{product.salePrice || product.price}</p>
                      {product.salePrice && <p className="text-xs text-gray-400 line-through">₹{product.price}</p>}
                    </div>
                  </td>
                  <td className={cn('px-4 py-3 text-sm hidden sm:table-cell', darkMode ? 'text-gray-300' : 'text-gray-600')}>
                    {product.totalStock}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    {product.isOnSale ? (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">On Sale</span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => { setEditingProduct(product); setShowModal(true); }}
                        className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-blue-400' : 'hover:bg-gray-100 text-gray-500 hover:text-blue-600')}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setShowDelete(product)}
                        className={cn('p-2 rounded-lg transition-colors', darkMode ? 'hover:bg-gray-700 text-gray-400 hover:text-red-400' : 'hover:bg-gray-100 text-gray-500 hover:text-red-600')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className={cn('text-center py-12', darkMode ? 'text-gray-500' : 'text-gray-400')}>
            <Package size={40} className="mx-auto mb-3 opacity-50" />
            <p>No products found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ProductModal darkMode={darkMode} product={editingProduct} onSave={handleSave} onClose={() => { setShowModal(false); setEditingProduct(null); }} />
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Product?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Are you sure you want to delete &quot;{showDelete.name}&quot;? This action cannot be undone.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDelete(null)} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')}>Cancel</button>
                <button onClick={() => handleDelete(showDelete.id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Product Add/Edit Modal
const ProductModal = ({ darkMode, product, onSave, onClose }) => {
  const [form, setForm] = useState({
    name: product?.name || '',
    price: product?.price || '',
    salePrice: product?.salePrice || '',
    category: product?.category || '',
    subcategory: product?.subcategory || '',
    totalStock: product?.totalStock || '',
    thumbnail: product?.thumbnail || '',
    description: product?.description || '',
    isOnSale: product?.isOnSale || false,
    isTrending: product?.isTrending || false,
    isNewArrival: product?.isNewArrival || false,
    isBestSeller: product?.isBestSeller || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, price: Number(form.price), salePrice: form.salePrice ? Number(form.salePrice) : null, totalStock: Number(form.totalStock) });
  };

  const inputClass = cn('w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-primary' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400 focus:border-primary'
  );

  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className={cn('w-full max-w-2xl rounded-xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white')}>
        {/* Modal Header */}
        <div className={cn('flex items-center justify-between px-6 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className={cn('p-2 rounded-lg', darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}>
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className={labelClass}>Product Name *</label>
              <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Floral Kurta Set" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Price (₹) *</label>
              <input type="number" required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="2999" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Sale Price (₹)</label>
              <input type="number" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} placeholder="Leave empty if no sale" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="kurta-sets" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Subcategory</label>
              <input type="text" value={form.subcategory} onChange={(e) => setForm({ ...form, subcategory: e.target.value })} placeholder="Printed Kurtas" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Stock</label>
              <input type="number" value={form.totalStock} onChange={(e) => setForm({ ...form, totalStock: e.target.value })} placeholder="50" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Thumbnail URL</label>
              <input type="url" value={form.thumbnail} onChange={(e) => setForm({ ...form, thumbnail: e.target.value })} placeholder="https://..." className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Product description..." className={inputClass} />
            </div>
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-4 pt-2">
            {[
              { key: 'isOnSale', label: 'On Sale' },
              { key: 'isTrending', label: 'Trending' },
              { key: 'isNewArrival', label: 'New Arrival' },
              { key: 'isBestSeller', label: 'Best Seller' },
            ].map((toggle) => (
              <label key={toggle.key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form[toggle.key]}
                  onChange={(e) => setForm({ ...form, [toggle.key]: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-700')}>{toggle.label}</span>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className={cn('flex gap-3 pt-4 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
            <button type="button" onClick={onClose} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')}>Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors">
              {product ? 'Save Changes' : 'Create Product'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminProducts;
