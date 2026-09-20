import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '@services/api';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const email = searchParams.get('email') || '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const invalidLink = !token || !email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      await api.post('/auth/reset-password', { token, email, password });
      setIsDone(true);
      toast.success('Password reset! You can now sign in.');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'This reset link is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (invalidLink) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <AlertCircle size={32} className="text-error" />
        </div>
        <h2 className="font-heading text-2xl text-dark mb-2">Invalid Reset Link</h2>
        <p className="text-text-secondary text-sm leading-relaxed mb-8">
          This link is missing information or malformed. Please request a new password reset.
        </p>
        <Link to="/forgot-password" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
          Request New Link
        </Link>
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            <div className="mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl text-dark mb-2">Set a New Password</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Choose a new password for <span className="font-medium text-dark">{email}</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="At least 6 characters"
                    className="input-base pl-11"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="password"
                    value={confirm}
                    onChange={(e) => { setConfirm(e.target.value); setError(''); }}
                    placeholder="Re-enter new password"
                    className="input-base pl-11"
                  />
                </div>
              </div>

              {error && (
                <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs">
                  {error}
                </motion.p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center gap-2 py-3.5 text-[15px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Reset Password <ArrowRight size={16} /></>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-text-secondary mt-6">
              <Link to="/login" className="text-primary font-semibold hover:underline">Back to Sign In</Link>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
              className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle size={32} className="text-success" />
            </motion.div>
            <h2 className="font-heading text-2xl text-dark mb-2">Password Reset</h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-8">
              Your password has been updated. Redirecting you to sign in…
            </p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <ArrowLeft size={16} /> Back to Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResetPasswordPage;
