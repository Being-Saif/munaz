import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, User, Lock, Save, Eye, EyeOff } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { selectCurrentUser, updateUser } from '@redux/slices/authSlice';
import api from '@services/api';
import toast from 'react-hot-toast';

const MyAccountSettingsPage = () => {
  const user = useSelector(selectCurrentUser);
  const dispatch = useDispatch();

  const isGoogleAccount = user?.authProvider === 'google';

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put('/users/profile', profileForm);
      dispatch(updateUser(res.data));
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSavingPassword(true);
    try {
      await api.put('/auth/update-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      toast.success('Password updated');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setSavingPassword(false);
    }
  };

  const inputClass = 'w-full px-3.5 py-2.5 rounded-lg border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors';
  const labelClass = 'text-sm font-medium text-dark mb-1.5 block';

  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/account" className="p-2 rounded-lg hover:bg-primary/5 transition-colors">
            <ChevronLeft size={20} className="text-dark" />
          </Link>
          <div>
            <h1 className="font-heading text-2xl font-bold text-dark">Account Settings</h1>
            <p className="text-text-secondary text-sm">Manage your profile and password</p>
          </div>
        </div>

        {/* Profile Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl border border-border p-5 sm:p-6 mb-5"
        >
          <div className="flex items-center gap-2 mb-4">
            <User size={17} className="text-primary" />
            <h2 className="font-heading text-lg font-semibold text-dark">Profile Information</h2>
          </div>

          <form onSubmit={handleProfileSave} className="space-y-4">
            <div>
              <label className={labelClass}>Full Name</label>
              <input
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="Your name"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input value={user?.email || ''} disabled className={`${inputClass} bg-gray-50 text-text-muted cursor-not-allowed`} />
              <p className="text-text-muted text-xs mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label className={labelClass}>Phone Number</label>
              <input
                value={profileForm.phone}
                onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                placeholder="e.g. 9876543210"
                className={inputClass}
              />
            </div>
            <button type="submit" disabled={savingProfile} className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-60">
              <Save size={15} />
              {savingProfile ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </motion.div>

        {/* Password */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-border p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-4">
            <Lock size={17} className="text-primary" />
            <h2 className="font-heading text-lg font-semibold text-dark">Password</h2>
          </div>

          {isGoogleAccount ? (
            <p className="text-text-secondary text-sm bg-background rounded-lg p-4">
              You signed in with Google, so there&apos;s no password to manage here. Use Google to sign in on future visits.
            </p>
          ) : (
            <form onSubmit={handlePasswordSave} className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="At least 6 characters"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  className={inputClass}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="flex items-center gap-1.5 text-text-secondary text-xs hover:text-dark transition-colors"
              >
                {showPasswords ? <EyeOff size={13} /> : <Eye size={13} />}
                {showPasswords ? 'Hide' : 'Show'} passwords
              </button>

              <div>
                <button type="submit" disabled={savingPassword} className="btn-primary inline-flex items-center gap-2 text-sm px-5 py-2.5 disabled:opacity-60">
                  <Save size={15} />
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyAccountSettingsPage;
