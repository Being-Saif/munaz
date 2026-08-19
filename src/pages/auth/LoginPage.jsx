import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import { setCredentials } from '@redux/slices/authSlice';
import { loginUser } from '@services/authService';
import GoogleAuthButton from '@components/auth/GoogleAuthButton';
import toast from 'react-hot-toast';
import { cn } from '@utils/cn';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!email) errs.email = 'Username or email is required';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    const result = loginUser(email, password);
    setIsLoading(false);

    if (result.success) {
      dispatch(setCredentials({ user: result.user, accessToken: 'demo_token_' + Date.now() }));
      toast.success(`Welcome back, ${result.user.firstName}! 🎉`);
      navigate('/');
    } else {
      setErrors({ password: result.error });
      toast.error(result.error);
    }
  };

  return (
    <div>
      {/* Heading */}
      <div className="mb-8">
        <h2 className="font-heading text-2xl sm:text-3xl text-dark mb-2">
          Welcome Back
        </h2>
        <p className="text-text-secondary text-sm">
          Sign in to your account to continue shopping
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Username or Email</label>
          <div className="relative">
            <Mail size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type="text"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: '' })); }}
              placeholder="Enter username or email"
              className={cn(
                'input-base pl-11',
                errors.email && 'border-error focus:border-error focus:ring-error/10'
              )}
            />
          </div>
          {errors.email && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1.5">
              {errors.email}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-dark mb-1.5">Password</label>
          <div className="relative">
            <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: '' })); }}
              placeholder="Enter your password"
              className={cn(
                'input-base pl-11 pr-11',
                errors.password && 'border-error focus:border-error focus:ring-error/10'
              )}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-dark transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-error text-xs mt-1.5">
              {errors.password}
            </motion.p>
          )}
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
            />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary font-medium hover:underline">
            Forgot Password?
          </Link>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full justify-center gap-2 py-3.5 text-[15px]"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Sign In
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-border" />
        <span className="text-text-muted text-xs">or continue with</span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Google Login */}
      <GoogleAuthButton mode="login" />

      {/* Sign Up Link */}
      <p className="text-center text-sm text-text-secondary mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-primary font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
