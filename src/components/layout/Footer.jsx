import { Link } from 'react-router-dom';
import { Globe, MessageCircle, Camera, MapPin } from 'lucide-react';
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from '@utils/constants';

const Footer = () => {
  return (
    <footer className="bg-dark text-white">
      {/* Main Footer */}
      <div className="section-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h2 className="font-heading text-2xl font-bold italic mb-3">
              {APP_NAME}
            </h2>
            <p className="text-white/60 text-sm leading-relaxed mb-4">
              Your destination for premium quality fashion and timeless style. {APP_TAGLINE}.
            </p>
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
