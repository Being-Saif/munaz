import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, FolderTree, Image, ShoppingCart,
  Users, Settings, ChevronLeft, ChevronRight, Menu, X,
  Sun, Moon, Bell, Search, LogOut, Store
} from 'lucide-react';
import { cn } from '@utils/cn';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { label: 'Products', icon: Package, path: '/admin/products' },
  { label: 'Categories', icon: FolderTree, path: '/admin/categories' },
  { label: 'Banners', icon: Image, path: '/admin/banners' },
  { label: 'Orders', icon: ShoppingCart, path: '/admin/orders' },
  { label: 'Customers', icon: Users, path: '/admin/customers' },
  { label: 'Settings', icon: Settings, path: '/admin/settings' },
];

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('munaz_admin_theme') === 'dark';
  });
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem('munaz_admin_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={cn('min-h-screen flex transition-colors duration-300', darkMode ? 'bg-gray-900' : 'bg-gray-50')}>
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={cn(
          'fixed lg:sticky top-0 left-0 h-screen z-50 flex flex-col transition-all duration-300 ease-in-out',
          darkMode ? 'bg-gray-800 border-r border-gray-700' : 'bg-white border-r border-gray-200',
          collapsed ? 'w-[72px]' : 'w-[260px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className={cn('flex items-center h-16 px-4 border-b', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center flex-shrink-0">
              <Store size={18} className="text-white" />
            </div>
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className={cn('font-heading text-lg font-bold whitespace-nowrap', darkMode ? 'text-white' : 'text-gray-900')}
                >
                  Munaz Admin
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile close */}
          <button onClick={() => setMobileOpen(false)} className="ml-auto lg:hidden text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative',
                isActive
                  ? darkMode
                    ? 'bg-primary/20 text-primary-light'
                    : 'bg-primary/10 text-primary'
                  : darkMode
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              )}
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="admin-nav-active"
                      className={cn('absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full', darkMode ? 'bg-primary-light' : 'bg-primary')}
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  <item.icon size={20} className="flex-shrink-0" />
                  <AnimatePresence>
                    {!collapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        className="whitespace-nowrap overflow-hidden"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle */}
        <div className={cn('p-3 border-t hidden lg:block', darkMode ? 'border-gray-700' : 'border-gray-200')}>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn('w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors',
              darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-white' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            )}
          >
            {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Top Bar */}
        <header className={cn(
          'sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b transition-colors duration-300',
          darkMode ? 'bg-gray-800/80 backdrop-blur-xl border-gray-700' : 'bg-white/80 backdrop-blur-xl border-gray-200'
        )}>
          {/* Left - Mobile menu + Search */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMobileOpen(true)} className={cn('lg:hidden p-2 rounded-lg', darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}>
              <Menu size={20} />
            </button>
            <div className={cn('hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg border', darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200')}>
              <Search size={16} className={darkMode ? 'text-gray-400' : 'text-gray-400'} />
              <input
                type="text"
                placeholder="Search..."
                className={cn('bg-transparent text-sm outline-none w-40 lg:w-56', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
              />
            </div>
          </div>

          {/* Right - Theme + Notifications + Avatar */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={cn('p-2.5 rounded-lg transition-colors', darkMode ? 'text-yellow-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}
              title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Notifications */}
            <button className={cn('p-2.5 rounded-lg relative transition-colors', darkMode ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-100')}>
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full" />
            </button>

            {/* Admin Avatar */}
            <div className={cn('flex items-center gap-2 pl-2 ml-1 border-l', darkMode ? 'border-gray-700' : 'border-gray-200')}>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                MA
              </div>
              <button
                onClick={() => navigate('/')}
                className={cn('p-2 rounded-lg transition-colors', darkMode ? 'text-gray-400 hover:bg-gray-700 hover:text-red-400' : 'text-gray-500 hover:bg-gray-100 hover:text-red-500')}
                title="Back to Store"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto">
          <Outlet context={{ darkMode }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
