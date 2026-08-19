import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const AdminBanners = () => {
  const { darkMode } = useOutletContext();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get('/banners/admin/all');
      setBanners(res.data || []);
    } catch { toast.error('Failed to load banners'); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id) => {
    try {
      const res = await api.put(`/banners/${id}/toggle`);
      setBanners(prev => prev.map(b => b._id === id ? res.data : b));
      toast.success('Banner toggled');
    } catch { toast.error('Failed to toggle'); }
  };

  const handleSave = async (formData) => {
    try {
      if (editing) {
        const res = await api.put(`/banners/${editing._id}`, formData);
        setBanners(prev => prev.map(b => b._id === editing._id ? res.data : b));
        toast.success('Banner updated');
      } else {
        const res = await api.post('/banners', formData);
        setBanners(prev => [...prev, res.data]);
        toast.success('Banner created');
      }
    } catch (err) { toast.error(err.message || 'Failed to save'); }
    setShowModal(false); setEditing(null);
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/banners/${id}`);
      setBanners(prev => prev.filter(b => b._id !== id));
      toast.success('Banner deleted');
    } catch { toast.error('Failed to delete'); }
    setShowDelete(null);
  };

  const heroBanners = banners.filter(b => b.position === 'hero');
  const promoBanners = banners.filter(b => b.position === 'promotional');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Banners</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Manage hero and promotional banners</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={16} /> Add Banner
        </button>
      </div>

      {loading && <div className={cn('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>}

      {!loading && (
        <>
          {heroBanners.length > 0 && (
            <div>
              <h2 className={cn('text-sm font-semibold uppercase tracking-wide mb-3', darkMode ? 'text-gray-400' : 'text-gray-500')}>Hero Banners ({heroBanners.length})</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {heroBanners.map((banner, i) => <BannerCard key={banner._id} banner={banner} index={i} darkMode={darkMode} onEdit={() => { setEditing(banner); setShowModal(true); }} onDelete={() => setShowDelete(banner)} onToggle={() => toggleActive(banner._id)} />)}
              </div>
            </div>
          )}
          {promoBanners.length > 0 && (
            <div>
              <h2 className={cn('text-sm font-semibold uppercase tracking-wide mb-3', darkMode ? 'text-gray-400' : 'text-gray-500')}>Promotional ({promoBanners.length})</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {promoBanners.map((banner, i) => <BannerCard key={banner._id} banner={banner} index={i} darkMode={darkMode} onEdit={() => { setEditing(banner); setShowModal(true); }} onDelete={() => setShowDelete(banner)} onToggle={() => toggleActive(banner._id)} />)}
              </div>
            </div>
          )}
        </>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={cn('w-full max-w-lg rounded-xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <div className={cn('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
                <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{editing ? 'Edit Banner' : 'Add Banner'}</h2>
                <button onClick={() => { setShowModal(false); setEditing(null); }} className={cn('p-2 rounded-lg', darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}><X size={18} /></button>
              </div>
              <BannerForm darkMode={darkMode} banner={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Banner?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Delete &quot;{showDelete.subtitle}&quot;?</p>
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

const BannerCard = ({ banner, index, darkMode, onEdit, onDelete, onToggle }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={cn('rounded-xl border overflow-hidden', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200', !banner.isActive && 'opacity-60')}>
    <div className="relative h-36 overflow-hidden">
      <img src={banner.image} alt={banner.subtitle} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      <div className="absolute bottom-3 left-3">
        <p className="text-white/70 text-[10px] uppercase tracking-wider">{banner.title}</p>
        <p className="text-white text-sm font-semibold">{banner.subtitle}</p>
      </div>
    </div>
    <div className={cn('px-4 py-3 flex items-center justify-between', darkMode ? 'border-t border-gray-700' : 'border-t border-gray-100')}>
      <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', banner.position === 'hero' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700')}>{banner.position}</span>
      <div className="flex items-center gap-1">
        <button onClick={onToggle} className={cn('p-1.5 rounded-lg', banner.isActive ? 'text-green-500' : 'text-gray-400')} title={banner.isActive ? 'Disable' : 'Enable'}>{banner.isActive ? <Eye size={15} /> : <EyeOff size={15} />}</button>
        <button onClick={onEdit} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600')}><Edit2 size={15} /></button>
        <button onClick={onDelete} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600')}><Trash2 size={15} /></button>
      </div>
    </div>
  </motion.div>
);

const BannerForm = ({ darkMode, banner, onSave, onClose }) => {
  const [form, setForm] = useState({ title: banner?.title || '', subtitle: banner?.subtitle || '', description: banner?.description || '', image: banner?.image || '', buttonText: banner?.buttonText || 'Shop Now', link: banner?.link || '/shop', position: banner?.position || 'hero', order: banner?.order || 1 });
  const [uploading, setUploading] = useState(false);
  const inputClass = cn('w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400');
  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm({ ...form, image: res.data.url }); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = (e) => { e.preventDefault(); onSave({ ...form, order: Number(form.order) }); };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Title *</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>Subtitle *</label><input required value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} /></div>
      <div>
        <label className={labelClass}>Banner Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')} />
        {uploading && <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mt-2" />}
        {form.image && <img src={form.image} alt="Preview" className="w-full h-20 rounded-lg object-cover mt-2" />}
        <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder="Or paste URL" className={cn(inputClass, 'mt-2')} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Button Text</label><input value={form.buttonText} onChange={(e) => setForm({ ...form, buttonText: e.target.value })} className={inputClass} /></div>
        <div><label className={labelClass}>Link</label><input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} className={inputClass} /></div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Position</label><select value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className={inputClass}><option value="hero">Hero</option><option value="promotional">Promotional</option></select></div>
        <div><label className={labelClass}>Order</label><input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} className={inputClass} /></div>
      </div>
      <div className={cn('flex gap-3 pt-3 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <button type="button" onClick={onClose} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')}>Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark">{banner ? 'Save' : 'Create'}</button>
      </div>
    </form>
  );
};

export default AdminBanners;
