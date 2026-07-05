import { Link, Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { APP_NAME } from '@utils/constants';

const AuthLayout = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left — Image Side (hidden on mobile, shown on lg+) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200"
          alt="Fashion"
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/50 to-primary/30" />

        {/* Content on image */}
        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-14 w-full">
          {/* Logo */}
          <Link to="/">
            <h1 className="font-heading text-3xl font-bold italic text-white">
              {APP_NAME}
            </h1>
          </Link>

          {/* Middle Text */}
          <div className="max-w-md">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="font-heading text-4xl xl:text-5xl text-white leading-tight mb-4"
            >
              Discover Your{' '}
              <span className="italic text-accent">Perfect Style</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="text-white/70 text-base leading-relaxed"
            >
              Join the Munaz family and explore premium luxury fashion curated just for you. Exclusive collections, member-only deals, and more.
            </motion.p>
          </div>

          {/* Bottom Quote */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-white/40 text-sm"
          >
            "Fashion is the armor to survive everyday life." — Bill Cunningham
          </motion.p>
        </div>
      </div>

      {/* Right — Form Side */}
      <div className="flex-1 flex flex-col min-h-screen lg:min-h-0">
        {/* Mobile Header with background */}
        <div className="lg:hidden relative h-48 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800"
            alt="Fashion"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark/70 to-dark/90" />
          <div className="relative z-10 flex items-center justify-center h-full">
            <Link to="/">
              <h1 className="font-heading text-3xl font-bold italic text-white">
                {APP_NAME}
              </h1>
            </Link>
          </div>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-8 lg:py-12 bg-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
