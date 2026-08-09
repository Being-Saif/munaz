import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { cn } from '@utils/cn';
import bannersData from '@data/banners.json';

const AdminBanners = () => {
  const { darkMode } = useOutletContext();
  const [banners, setBanners] = useState(bannersData);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  const toggleActive = (id) => {
    setBanners((prev) => prev.map((b) => b.id === id ? { ...b, isActive: !b.isActive } : b));
  };

  const handleSave = (formData) => {
    if (editing) {
      setBanners((prev) => prev.map((b) => b.id === editing.id ? { ...b, ...formData } : b));
    } else {
      setBanners((prev) => [...prev, { ...formData, id: `banner_${Date.now()}`, isActive: true }]);
    }
    setShowModal(false);
    setEditing(null);
  };

  const handleDelete = (id) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    setShowDelete(null);
  };

  const heroBanners = banners.filter((b) => b.position === 'hero');
  const promoBanners = banners.filter((b) => b.position === 'promotional');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Banners</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Manage hero sliders and promotional banners</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {/* Hero Banners */}
      <div>
        <h2 className={cn('text-sm font-semibold uppercase tracking-wide mb-3', darkMode ? 'text-gray-400' : 'text-gray-500')}>Hero Banners ({heroBanners.length})</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {heroBanners.map((banner, index) => (
            <BannerCard key={banner.id} banner={banner} index={index} darkMode={darkMode} onEdit={() => { setEditing(banner); setShowModal(true); }} onDelete={() => setShowDelete(banner)} onToggle={() => toggleActive(banner.id)} />
          ))}
        </div>
      </div>

      {/* Promotional Banners */}
      {promoBanners.length > 0 && (
        <div>
          <h2 className={cn('text-sm font-semibold uppercase tracking-wide mb-3', darkMode ? 'text-gray-400' : 'text-gray-500')}>Promotional Banners ({promoBanners.length})</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {promoBanners.map((banner, index) => (
              <BannerCard key={banner.id} banner={banner} index={index} darkMode={darkMode} onEdit={() => { setEditing(banner); setShowModal(true); }} onDelete={() => setShowDelete(banner)} onToggle={() => toggleActive(banner.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className={cn('w-full max-w-lg rounded-xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <div className={cn('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
                <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{editing ? 'Edit Banner' : 'Add Banner'}</h2>
                <button onClick={() => { setShowModal(false); setEditing(null); }} className={cn('p-2 rounded-lg', darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}><X size={18} /></button>
              </div>
              <BannerForm darkMode={darkMode} banner={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Banner?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Delete &quot;{showDelete.subtitle}&quot;? This cannot be undone.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDelete(null)} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')}>Cancel</button>
                <button onClick={() => handleDelete(showDelete.id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const BannerCard = ({ banner, index, darkMode, onEdit, onDelete, onToggle }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200', !banner.isActive && 'opacity-60')}
  >
    <div className="relative h-36 overflow-hidden">
      <img src={banner.image} alt={banner.subtitle} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className="text-white/70 text-[10px] uppercase tracking-wider">{banner.title}</p>
        <p className="text-white text-sm font-semibold">{banner.subtitle}</p>
      </div>
    </div>
    <div className={cn('px-4 py-3 flex items-center justify-between', darkMode ? 'border-t border-gray-700' : 'border-t border-gray-100')}>
      <div className="flex items-center gap-2">
        <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', banner.position === 'hero' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400')}>
          {banner.position}
        </span>
        <span className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>Order: {banner.order}</span>
      </div>
      <div className="flex items-center gap-1">
        <button onClick={onToggle} className={cn('p-1.5 rounded-lg transition-colors', banner.isActive ? 'text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700')} title={banner.isActive ? 'Disable' : 'Enable'}>
          {banner.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
        </button>
        <button onClick={onEdit} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-blue-400' : 'text-gray-500 hover:bg-gray-100 hover:text-blue-600')}><Edit2 size={15} /></button>
        <button onClick={onDelete} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-red-400' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600')}><Trash2 size={15} /></button>
      </div>
    </div>
  </motion.div>
);

const BannerForm = ({ darkMode, banner, onSave, onClose }) => {
  const [form, setForm] = useState({ title: banner?.title || '', subtitle: banner?.subtitle || '', description: banner?.description || '', image: banner?.image || '', mobileImage: banner?.mobileImage || '', buttonText: banner?.buttonText || 'Shop Now', link: banner?.link || '/shop', position: banner?.position || 'hero', order: banner?.order || 1 });
  const inputClass = cn('w-full px-3 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400');
  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');

  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, order: Number(form.order) }); };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="New Collection" className={inputClass} /></div>
        <div><label className={labelClass}>Subtitle *</label><input required value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} placeholder="Festive Elegance" className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short description" className={inputClass} /></div>
      <div><label className={labelClass}>Image URL *</label><input required value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="https://..." className={inputClass} /></div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Button Text</label><input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>Link</label><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Position</label>
          <select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass}>
            <option value="hero">Hero</option>
            <option value="promotional">Promotional</option>
          </select>
        </div>
        <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} /></div>
      </div>
      <div className={cn('flex gap-3 pt-3 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <button type="button" onClick={onClose} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50')}>Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors">{banner ? 'Save' : 'Create'}</button>
      </div>
    </form>
  );
};

export default AdminBanners;
