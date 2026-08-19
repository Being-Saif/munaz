import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, FolderTree } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const AdminCategories = () => {
  const { darkMode } = useOutletContext();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data || []);
    } catch { toast.error('Failed to load categories'); }
    finally { setLoading(false); }
  };

  const handleSave = async (formData) => {
    try {
      if (editing) {
        const res = await api.put(`/categories/${editing._id}`, formData);
        setCategories(prev => prev.map(c => c._id === editing._id ? res.data : c));
        toast.success('Category updated');
      } else {
        const res = await api.post('/categories', formData);
        setCategories(prev => [...prev, res.data]);
        toast.success('Category created');
      }
    } catch (err) { toast.error(err.message || 'Failed to save'); }
    setShowModal(false); setEditing(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      setCategories(prev => prev.filter(c => c._id !== id));
      toast.success('Category deleted');
    } catch { toast.error('Failed to delete'); }
    setShowDelete(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Categories</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>{categories.length} categories</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {loading && <div className={cn('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, index) => (
            <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={cn('rounded-xl border overflow-hidden group', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
              <div className="relative h-36 overflow-hidden">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <button onClick={() => { setEditing(cat); setShowModal(true); }} className="p-1.5 rounded-lg bg-white/90 text-gray-700 hover:bg-blue-500 hover:text-white transition-colors"><Edit2 size={13} /></button>
                  <button onClick={() => setShowDelete(cat)} className="p-1.5 rounded-lg bg-white/90 text-gray-700 hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={13} /></button>
                </div>
              </div>
              <div className="p-4">
                <h3 className={cn('font-semibold text-sm', darkMode ? 'text-white' : 'text-gray-900')}>{cat.name}</h3>
                <p className={cn('text-xs mt-1 line-clamp-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>{cat.description}</p>
                <span className={cn('text-xs mt-2 inline-block', darkMode ? 'text-gray-500' : 'text-gray-400')}>{cat.productCount} products</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={cn('w-full max-w-md rounded-xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <div className={cn('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
                <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{editing ? 'Edit Category' : 'Add Category'}</h2>
                <button onClick={() => { setShowModal(false); setEditing(null); }} className={cn('p-2 rounded-lg', darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}><X size={18} /></button>
              </div>
              <CategoryForm darkMode={darkMode} category={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Category?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Delete &quot;{showDelete.name}&quot;?</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDelete(null)} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')}>Cancel</button>
                <button onClick={() => handleDelete(showDelete._id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CategoryForm = ({ darkMode, category, onSave, onClose }) => {
  const [form, setForm] = useState({ name: category?.name || '', slug: category?.slug || '', description: category?.description || '', image: category?.image || '', order: category?.order || 0 });
  const [uploading, setUploading] = useState(false);
  const inputClass = cn('w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400');
  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, image: res.data.url }); toast.success('Image uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'), order: Number(form.order) }); };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-4">
      <div><label className={labelClass}>Name *</label><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} /></div>
      <div><label className={labelClass}>Slug</label><input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" className={inputClass} /></div>
      <div>
        <label className={labelClass}>Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')} />
        {uploading && <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mt-2" />}
        {form.image && <img src={form.image} alt="Preview" className="w-16 h-16 rounded-lg object-cover mt-2" />}
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Or paste URL" className={cn(inputClass, 'mt-2')} />
      </div>
      <div><label className={labelClass}>Description</label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} className={inputClass} /></div>
      <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} /></div>
      <div className={cn('flex gap-3 pt-3 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <button type="button" onClick={onClose} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')}>Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark">{category ? 'Save' : 'Create'}</button>
      </div>
    </form>
  );
};

export default AdminCategories;
