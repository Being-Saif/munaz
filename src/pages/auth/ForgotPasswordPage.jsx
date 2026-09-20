import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@utils/cn';
import api from '@services/api';

/**
 * Password reset.
 *
 * NOTE: This performs a direct reset (email + new password) via the
 * /auth/set-password endpoint, because the project has no email/SMTP service
 * configured to send a reset link. Once an email provider is set up, this can
 * be upgraded to a proper tokenized email-link flow.
 */
const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }
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
      await api.post('/auth/set-password', { email: email.trim().toLowerCase(), password });
      setIsDone(true);
      toast.success('Password reset! You can now sign in.');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setError(err.message || 'Could not reset password. Check the email and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!isDone ? (
          <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>

            <div className="mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl text-dark mb-2">Reset Password</h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                Enter your account email and choose a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-dark mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }}
                    placeholder="Enter your email"
                    className="input-base pl-11"
                  />
                </div>
              </div>

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
              Remember your password?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">Sign In</Link>
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

export default ForgotPasswordPage;
