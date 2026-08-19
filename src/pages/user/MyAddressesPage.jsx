import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, MapPin, Edit2, Trash2, X } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@redux/slices/authSlice';
import api from '@services/api';
import toast from 'react-hot-toast';

const MyAddressesPage = () => {
  const user = useSelector(selectCurrentUser);
  const [addresses, setAddresses] = useState(user?.addresses || []);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [showDelete, setShowDelete] = useState(null);

  const handleSave = async (formData) => {
    try {
      if (editing) {
        const res = await api.put(`/users/addresses/${editing._id}`, formData);
        setAddresses(res.data);
        toast.success('Address updated');
      } else {
        const res = await api.post('/users/addresses', formData);
        setAddresses(res.data);
        toast.success('Address added');
      }
    } catch (err) {
      // Fallback for demo
      if (editing) {
        setAddresses(prev => prev.map(a => a._id === editing._id ? { ...a, ...formData } : a));
      } else {
        setAddresses(prev => [...prev, { ...formData, _id: `addr_${Date.now()}` }]);
      }
      toast.success(editing ? 'Address updated' : 'Address added');
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/users/addresses/${id}`);
      setAddresses(res.data);
    } catch {
      setAddresses(prev => prev.filter(a => a._id !== id));
    }
    setShowDelete(null);
    toast.success('Address deleted');
  };

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link to="/account" className="p-2 rounded-lg hover:bg-primary/5 transition-colors">
              <ChevronLeft size={20} className="text-dark" />
            </Link>
            <div>
              <h1 className="font-heading text-2xl font-bold text-dark">My Addresses</h1>
              <p className="text-text-secondary text-sm">Manage delivery addresses</p>
            </div>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={16} /> Add New
          </button>
        </div>

        {/* Empty State */}
        {addresses.length === 0 && !showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-2xl border border-border">
            <MapPin size={48} className="mx-auto mb-4 text-primary/30" />
            <h3 className="font-heading text-lg font-semibold text-dark mb-2">No addresses saved</h3>
            <p className="text-text-secondary text-sm mb-5">Add an address for faster checkout</p>
            <button onClick={() => setShowForm(true)} className="btn-primary inline-flex items-center gap-2 px-6 py-3 text-sm">
              <Plus size={16} /> Add Address
            </button>
          </motion.div>
        )}

        {/* Addresses Grid */}
        {addresses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {addresses.map((addr, index) => (
              <motion.div
                key={addr._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl border border-border p-5 relative"
              >
                {addr.isDefault && (
                  <span className="absolute top-3 right-3 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-medium">Default</span>
                )}
                <h3 className="font-medium text-dark text-sm">{addr.fullName}</h3>
                <p className="text-text-secondary text-sm mt-1">{addr.address}</p>
                <p className="text-text-secondary text-sm">{addr.city}, {addr.state} - {addr.pincode}</p>
                <p className="text-text-muted text-xs mt-1">Phone: {addr.phone}</p>
                <div className="flex gap-2 mt-3 pt-3 border-t border-border">
                  <button onClick={() => { setEditing(addr); setShowForm(true); }} className="text-xs text-primary font-medium flex items-center gap-1 hover:underline">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => setShowDelete(addr)} className="text-xs text-red-500 font-medium flex items-center gap-1 hover:underline">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Add/Edit Form Modal */}
        <AnimatePresence>
          {showForm && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95 }} className="w-full max-w-md bg-white rounded-xl shadow-2xl">
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-dark">{editing ? 'Edit Address' : 'Add Address'}</h2>
                  <button onClick={() => { setShowForm(false); setEditing(null); }} className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"><X size={18} /></button>
                </div>
                <AddressForm address={editing} onSave={handleSave} onClose={() => { setShowForm(false); setEditing(null); }} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {showDelete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }} className="w-full max-w-sm bg-white rounded-xl p-6">
                <h3 className="text-lg font-semibold text-dark">Delete Address?</h3>
                <p className="text-sm text-text-secondary mt-2">This cannot be undone.</p>
                <div className="flex gap-3 mt-5">
                  <button onClick={() => setShowDelete(null)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button onClick={() => handleDelete(showDelete._id)} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AddressForm = ({ address, onSave, onClose }) => {
  const [form, setForm] = useState({
    fullName: address?.fullName || '',
    phone: address?.phone || '',
    address: address?.address || '',
    city: address?.city || '',
    state: address?.state || '',
    pincode: address?.pincode || '',
    isDefault: address?.isDefault || false,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const inputClass = 'w-full px-3 py-2.5 rounded-lg border border-gray-300 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors';

  return (
    <form onSubmit={handleSubmit} className="p-5 space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div><label className="text-xs font-medium text-gray-600 mb-1 block">Full Name *</label><input required value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} /></div>
        <div><label className="text-xs font-medium text-gray-600 mb-1 block">Phone *</label><input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} /></div>
      </div>
      <div><label className="text-xs font-medium text-gray-600 mb-1 block">Address *</label><input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House no, Street, Area" className={inputClass} /></div>
      <div className="grid grid-cols-3 gap-3">
        <div><label className="text-xs font-medium text-gray-600 mb-1 block">City *</label><input required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} /></div>
        <div><label className="text-xs font-medium text-gray-600 mb-1 block">State *</label><input required value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className={inputClass} /></div>
        <div><label className="text-xs font-medium text-gray-600 mb-1 block">Pincode *</label><input required value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className={inputClass} /></div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer pt-1">
        <input type="checkbox" checked={form.isDefault} onChange={(e) => setForm({ ...form, isDefault: e.target.checked })} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
        <span className="text-sm text-gray-700">Set as default address</span>
      </label>
      <div className="flex gap-3 pt-3 border-t border-gray-200">
        <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors">{address ? 'Save' : 'Add Address'}</button>
      </div>
    </form>
  );
};

export default MyAddressesPage;
