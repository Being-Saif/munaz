import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Eye, EyeOff, Ticket } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const DISPLAY_LOCATIONS = [
  { value: 'checkout', label: 'Checkout page' },
  { value: 'cart', label: 'Cart drawer' },
  { value: 'home', label: 'Home page' },
  { value: 'none', label: "Don't display (code only)" },
];

const AdminCoupons = () => {
  const { darkMode } = useOutletContext();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons/admin/all');
      setCoupons(res.data || []);
    } catch { toast.error('Failed to load coupons'); }
    finally { setLoading(false); }
  };

  const toggleActive = async (id) => {
    try {
      const res = await api.put(`/coupons/${id}/toggle`);
      setCoupons(prev => prev.map(c => c._id === id ? res.data : c));
      toast.success('Coupon updated');
    } catch { toast.error('Failed to toggle'); }
  };

  const handleSave = async (formData) => {
    try {
      if (editing) {
        const res = await api.put(`/coupons/${editing._id}`, formData);
        setCoupons(prev => prev.map(c => c._id === editing._id ? res.data : c));
        toast.success('Coupon updated');
      } else {
        const res = await api.post('/coupons', formData);
        setCoupons(prev => [res.data, ...prev]);
        toast.success('Coupon created');
      }
      setShowModal(false);
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Failed to save coupon');
    }
  };

  const handleDelete = async (id) => {
    if (deleting) return;
    setDeleting(true);
    try {
      await api.delete(`/coupons/${id}`);
      setCoupons(prev => prev.filter(c => c._id !== id));
      toast.success('Coupon deleted');
      setShowDelete(null);
    } catch (err) {
      toast.error(err.message || 'Failed to delete');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Coupons</h1>
          <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Create and manage discount coupons</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true); }} className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors">
          <Plus size={16} /> Add Coupon
        </button>
      </div>

      {loading && <div className={cn('text-center py-8', darkMode ? 'text-gray-400' : 'text-gray-500')}><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />Loading...</div>}

      {!loading && coupons.length === 0 && (
        <div className={cn('text-center py-16 rounded-xl border', darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500')}>
          <Ticket size={40} className="mx-auto mb-3 opacity-50" />
          <p>No coupons yet. Create your first one.</p>
        </div>
      )}

      {!loading && coupons.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {coupons.map((coupon, i) => (
            <CouponCard key={coupon._id} coupon={coupon} index={i} darkMode={darkMode}
              onEdit={() => { setEditing(coupon); setShowModal(true); }}
              onDelete={() => setShowDelete(coupon)}
              onToggle={() => toggleActive(coupon._id)} />
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-10 overflow-y-auto bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className={cn('w-full max-w-lg rounded-xl shadow-2xl', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <div className={cn('flex items-center justify-between px-5 py-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
                <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>{editing ? 'Edit Coupon' : 'Add Coupon'}</h2>
                <button onClick={() => { setShowModal(false); setEditing(null); }} className={cn('p-2 rounded-lg', darkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500')}><X size={18} /></button>
              </div>
              <CouponForm darkMode={darkMode} coupon={editing} onSave={handleSave} onClose={() => { setShowModal(false); setEditing(null); }} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation */}
      <AnimatePresence>
        {showDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className={cn('w-full max-w-sm rounded-xl p-6', darkMode ? 'bg-gray-800' : 'bg-white')}>
              <h3 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Delete Coupon?</h3>
              <p className={cn('text-sm mt-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>Delete &quot;{showDelete.code}&quot;? This cannot be undone.</p>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setShowDelete(null)} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')}>Cancel</button>
                <button onClick={() => handleDelete(showDelete._id)} disabled={deleting} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed">
                  {deleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CouponCard = ({ coupon, index, darkMode, onEdit, onDelete, onToggle }) => {
  const discountLabel = coupon.discountType === 'percentage'
    ? `${coupon.discountValue}% OFF${coupon.maxDiscount ? ` (up to ₹${coupon.maxDiscount})` : ''}`
    : `₹${coupon.discountValue} OFF`;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={cn('rounded-xl border overflow-hidden flex', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200', !coupon.isActive && 'opacity-60')}>
      {coupon.image && (
        <img src={coupon.image} alt={coupon.name} className="w-24 h-full object-cover flex-shrink-0" />
      )}
      <div className="flex-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className={cn('text-sm font-semibold truncate', darkMode ? 'text-white' : 'text-gray-900')}>{coupon.name}</p>
            <span className={cn('inline-block mt-1 px-2 py-0.5 rounded text-xs font-mono font-bold', darkMode ? 'bg-primary/20 text-primary-light' : 'bg-primary/10 text-primary')}>{coupon.code}</span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <button onClick={onToggle} className={cn('p-1.5 rounded-lg', coupon.isActive ? 'text-green-500' : 'text-gray-400')} title={coupon.isActive ? 'Disable' : 'Enable'}>{coupon.isActive ? <Eye size={15} /> : <EyeOff size={15} />}</button>
            <button onClick={onEdit} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-600')}><Edit2 size={15} /></button>
            <button onClick={onDelete} className={cn('p-1.5 rounded-lg', darkMode ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-600')}><Trash2 size={15} /></button>
          </div>
        </div>
        <p className={cn('text-sm font-medium mt-2', darkMode ? 'text-gray-200' : 'text-gray-700')}>{discountLabel}</p>
        <div className={cn('text-xs mt-1 space-x-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>
          {coupon.minOrderValue > 0 && <span>Min ₹{coupon.minOrderValue}</span>}
          <span className="capitalize">· {coupon.displayLocation === 'none' ? 'hidden' : coupon.displayLocation}</span>
          {coupon.expiresAt && <span>· exp {new Date(coupon.expiresAt).toLocaleDateString('en-IN')}</span>}
        </div>
      </div>
    </motion.div>
  );
};

const CouponForm = ({ darkMode, coupon, onSave, onClose }) => {
  const [form, setForm] = useState({
    code: coupon?.code || '',
    name: coupon?.name || '',
    description: coupon?.description || '',
    image: coupon?.image || '',
    discountType: coupon?.discountType || 'percentage',
    discountValue: coupon?.discountValue ?? '',
    minOrderValue: coupon?.minOrderValue ?? 0,
    maxDiscount: coupon?.maxDiscount ?? 0,
    displayLocation: coupon?.displayLocation || 'checkout',
    expiresAt: coupon?.expiresAt ? coupon.expiresAt.slice(0, 10) : '',
    isActive: coupon?.isActive ?? true,
  });
  const [uploading, setUploading] = useState(false);

  const inputClass = cn('w-full px-3 py-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-primary/30', darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400');
  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append('image', file);
      const res = await api.post('/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm(f => ({ ...f, image: res.data.url })); toast.success('Uploaded');
    } catch { toast.error('Upload failed'); }
    setUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim() || form.discountValue === '') {
      toast.error('Code, name and discount value are required');
      return;
    }
    onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      discountValue: Number(form.discountValue),
      minOrderValue: Number(form.minOrderValue) || 0,
      maxDiscount: Number(form.maxDiscount) || 0,
      expiresAt: form.expiresAt || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Coupon Code *</label><input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="FESTIVE10" className={cn(inputClass, 'font-mono uppercase')} /></div>
        <div><label className={labelClass}>Name *</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Festive Offer" className={inputClass} /></div>
      </div>
      <div><label className={labelClass}>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short offer description" className={inputClass} /></div>

      <div>
        <label className={labelClass}>Coupon Image</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-600')} />
        {uploading && <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mt-2" />}
        {form.image && <img src={form.image} alt="Preview" className="w-full h-24 rounded-lg object-cover mt-2" />}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Discount Type</label><select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })} className={inputClass}><option value="percentage">Percentage (%)</option><option value="fixed">Fixed (₹)</option></select></div>
        <div><label className={labelClass}>{form.discountType === 'percentage' ? 'Discount %' : 'Discount ₹'} *</label><input type="number" min="0" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: e.target.value })} placeholder={form.discountType === 'percentage' ? '10' : '100'} className={inputClass} /></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Min Order (₹)</label><input type="number" min="0" value={form.minOrderValue} onChange={(e) => setForm({ ...form, minOrderValue: e.target.value })} placeholder="0" className={inputClass} /></div>
        {form.discountType === 'percentage' && (
          <div><label className={labelClass}>Max Discount (₹, 0 = none)</label><input type="number" min="0" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: e.target.value })} placeholder="0" className={inputClass} /></div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div><label className={labelClass}>Display Location</label><select value={form.displayLocation} onChange={(e) => setForm({ ...form, displayLocation: e.target.value })} className={inputClass}>{DISPLAY_LOCATIONS.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}</select></div>
        <div><label className={labelClass}>Expiry Date (optional)</label><input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className={inputClass} /></div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <span className={cn('text-sm', darkMode ? 'text-gray-300' : 'text-gray-700')}>Active</span>
      </label>

      <div className={cn('flex gap-3 pt-3 border-t', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <button type="button" onClick={onClose} className={cn('flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border', darkMode ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700')}>Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark">{coupon ? 'Save' : 'Create'}</button>
      </div>
    </form>
  );
};

export default AdminCoupons;
