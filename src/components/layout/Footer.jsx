import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Globe, MessageCircle, Camera, MapPin, Mail, Phone } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from '@utils/constants';
import Logo from '@components/common/Logo';
import { logout } from '@redux/slices/authSlice';
import api from '@services/api';
import toast from 'react-hot-toast';

const Footer = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings/public')
      .then((res) => setSettings(res.data))
      .catch(() => { /* footer still renders without dynamic contact info */ });
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  const contactEmail = settings?.contactEmail;
  const contactPhone = settings?.supportPhone;

  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="mb-3">
              <Logo variant="light" size="md" />
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Your destination for premium quality fashion and timeless style. {APP_TAGLINE}.
            </p>

            {/* Contact info */}
            {(contactEmail || contactPhone) && (
              <div className="space-y-2 mb-4">
                {contactEmail && (
                  <a href={`mailto:${contactEmail}`} className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors">
                    <Mail size={15} /> {contactEmail}
                  </a>
                )}
                {contactPhone && (
                  <a href={`tel:${contactPhone}`} className="flex items-center gap-2 text-white/70 text-sm hover:text-white transition-colors">
                    <Phone size={15} /> {contactPhone}
                  </a>
                )}
              </div>
            )}

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, Camera, MapPin].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300"
                  aria-label={`Social link ${index + 1}`}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.help.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-body text-sm font-semibold uppercase tracking-wider mb-4">
              Account
            </h3>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.label}>
                  {link.action === 'logout' ? (
                    <button
                      onClick={handleLogout}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </button>
                  ) : (
                    <Link
                      to={link.href}
                      className="text-white/60 text-sm hover:text-white transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-container py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.
          </p>
          {/* Payment Icons Placeholder */}
          <div className="flex items-center gap-3">
            {['VISA', 'MC', 'PayPal', 'GPay'].map((method) => (
              <span
                key={method}
                className="px-2 py-1 bg-white/10 rounded text-[10px] font-medium text-white/60"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
