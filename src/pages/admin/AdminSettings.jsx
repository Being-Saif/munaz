import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Store } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';

const AdminSettings = () => {
  const { darkMode } = useOutletContext();
  const [form, setForm] = useState({ storeName: '', supportEmail: '', supportPhone: '', address: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/settings')
      .then((res) => setForm({
        storeName: res.data.storeName || '',
        supportEmail: res.data.supportEmail || '',
        supportPhone: res.data.supportPhone || '',
        address: res.data.address || '',
      }))
      .catch(() => toast.error('Failed to load settings'))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put('/settings', form);
      toast.success('Settings saved');
    } catch (err) {
      toast.error(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const labelClass = cn('text-xs font-medium mb-1.5 block', darkMode ? 'text-gray-400' : 'text-gray-600');
  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>Settings</h1>
        <p className={cn('text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>Store information shown to customers</p>
      </div>

      {loading ? (
        <div className={cn('rounded-xl border p-8 text-center', darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-500')}>
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          Loading settings...
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn('rounded-xl border p-5 sm:p-6 max-w-xl', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}
        >
          <div className="flex items-center gap-2 mb-5">
            <Store size={17} className="text-primary" />
            <h2 className={cn('text-lg font-semibold', darkMode ? 'text-white' : 'text-gray-900')}>Store Information</h2>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className={labelClass}>Store Name</label>
              <input
                value={form.storeName}
                onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                placeholder="Munaz"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Support Email</label>
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                placeholder="support@munazshop.com"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Support Phone</label>
              <input
                value={form.supportPhone}
                onChange={(e) => setForm({ ...form, supportPhone: e.target.value })}
                placeholder="+91 98765 43210"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Store Address</label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                placeholder="Full store/business address"
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-60"
            >
              <Save size={15} />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>
      )}
    </div>
  );
};

export default AdminSettings;
