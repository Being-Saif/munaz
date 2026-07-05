import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Calendar, ShoppingBag, Heart, MapPin, LogOut, ChevronRight, Settings, Package } from 'lucide-react';
import { selectCurrentUser, logout } from '@redux/slices/authSlice';
import { selectCartTotalItems } from '@redux/slices/cartSlice';
import { selectWishlistCount } from '@redux/slices/wishlistSlice';
import { getInitials } from '@utils/helpers';
import { formatDate } from '@utils/formatters';
import toast from 'react-hot-toast';

const menuItems = [
  { icon: Package, label: 'My Orders', description: 'Track, return, or buy again', href: '/account/orders' },
  { icon: Heart, label: 'My Wishlist', description: 'Items you saved for later', href: '/wishlist' },
  { icon: MapPin, label: 'My Addresses', description: 'Manage delivery addresses', href: '/account/addresses' },
  { icon: Settings, label: 'Account Settings', description: 'Password, notifications, preferences', href: '/account/settings' },
];

const ProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(selectCurrentUser);
  const cartCount = useSelector(selectCartTotalItems);
  const wishlistCount = useSelector(selectWishlistCount);

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container max-w-4xl mx-auto">
        {/* Profile Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-surface rounded-2xl border border-border shadow-card overflow-hidden mb-6"
        >
          {/* Gradient Top Bar */}
          <div className="h-24 sm:h-32 bg-gradient-cta" />

          {/* Profile Content */}
          <div className="px-5 sm:px-8 pb-6 -mt-12 sm:-mt-14">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-cta border-4 border-surface shadow-lg flex items-center justify-center"
              >
                <span className="text-white text-2xl sm:text-3xl font-bold font-heading">
                  {getInitials(`${user.firstName} ${user.lastName}`)}
                </span>
              </motion.div>

              {/* Name + Email */}
              <div className="flex-1">
                <h1 className="font-heading text-xl sm:text-2xl text-dark">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-text-secondary text-sm flex items-center gap-1.5 mt-0.5">
                  <Mail size={13} />
                  {user.email}
                </p>
              </div>

              {/* Logout Button - Desktop */}
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-error border border-error/20 px-4 py-2 rounded-lg hover:bg-error/5 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3 sm:gap-4 mb-6"
        >
          {[
            { icon: ShoppingBag, label: 'Cart Items', value: cartCount },
            { icon: Heart, label: 'Wishlist', value: wishlistCount },
            { icon: Calendar, label: 'Member Since', value: user.createdAt ? formatDate(user.createdAt).split(',')[0] : 'Jul 2026' },
          ].map(({ icon: Icon, label, value }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="bg-surface rounded-xl border border-border p-4 text-center shadow-sm"
            >
              <Icon size={20} className="text-primary mx-auto mb-2" />
              <p className="font-button text-lg sm:text-xl font-bold text-dark">{value}</p>
              <p className="text-text-muted text-[10px] sm:text-xs">{label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-surface rounded-2xl border border-border shadow-card overflow-hidden"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.25 + index * 0.05 }}
                onClick={() => navigate(item.href)}
                className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-surface-hover transition-colors border-b border-border last:border-0 text-left"
              >
                <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-body text-sm font-semibold text-dark">{item.label}</h3>
                  <p className="text-text-muted text-xs">{item.description}</p>
                </div>
                <ChevronRight size={16} className="text-text-muted flex-shrink-0" />
              </motion.button>
            );
          })}
        </motion.div>

        {/* Logout Button - Mobile */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={handleLogout}
          className="sm:hidden w-full mt-6 flex items-center justify-center gap-2 text-sm font-medium text-error border border-error/20 px-4 py-3 rounded-xl hover:bg-error/5 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </motion.button>
      </div>
    </div>
  );
};

export default ProfilePage;
