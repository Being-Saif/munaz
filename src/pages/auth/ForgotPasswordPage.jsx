import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { cn } from '@utils/cn';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Email is required');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email');
      return;
    }

    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSent(true);
    toast.success('Reset link sent!');
  };

  return (
    <div>
      <AnimatePresence mode="wait">
        {!isSent ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, x: -20 }}
          >
            {/* Back Link */}
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <ArrowLeft size={14} />
              Back to Sign In
            </Link>

            {/* Heading */}
            <div className="mb-8">
              <h2 className="font-heading text-2xl sm:text-3xl text-dark mb-2">
                Forgot Password?
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed">
                No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
              </p>
            </div>

            {/* Form */}
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
                    className={cn(
                      'input-base pl-11',
                      error && 'border-error focus:border-error focus:ring-error/10'
                    )}
                  />
                </div>
                {error && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1.5">
                    {error}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full justify-center gap-2 py-3.5 text-[15px]"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Sign Up */}
            <p className="text-center text-sm text-text-secondary mt-6">
              Remember your password?{' '}
              <Link to="/login" className="text-primary font-semibold hover:underline">
                Sign In
              </Link>
            </p>
          </motion.div>
        ) : (
          /* Success State */
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
              className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle size={32} className="text-success" />
            </motion.div>

            <h2 className="font-heading text-2xl text-dark mb-2">
              Check Your Email
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-2">
              We've sent a password reset link to:
            </p>
            <p className="text-dark font-medium text-sm mb-6">
              {email}
            </p>
            <p className="text-text-muted text-xs mb-8">
              Didn't receive the email? Check your spam folder or{' '}
              <button
                onClick={() => { setIsSent(false); }}
                className="text-primary hover:underline"
              >
                try again
              </button>
            </p>

            <Link
              to="/login"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ForgotPasswordPage;
