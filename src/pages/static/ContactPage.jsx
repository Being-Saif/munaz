import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import api from '@services/api';

const ContactPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings/public').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const email = settings?.contactEmail;
  const phone = settings?.supportPhone;
  const address = settings?.address;

  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">Contact Us</h1>
        <p className="text-text-secondary text-sm mb-8">
          We'd love to hear from you. Reach out with any questions about your order, our products, or anything else.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {email && (
            <a href={`mailto:${email}`} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface hover:shadow-card transition-shadow">
              <Mail size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Email</p>
                <p className="text-sm text-dark font-medium break-all">{email}</p>
              </div>
            </a>
          )}
          {phone && (
            <a href={`tel:${phone}`} className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface hover:shadow-card transition-shadow">
              <Phone size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Phone</p>
                <p className="text-sm text-dark font-medium">{phone}</p>
              </div>
            </a>
          )}
          {address && (
            <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface sm:col-span-2">
              <MapPin size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-xs font-medium text-text-muted uppercase tracking-wide">Address</p>
                <p className="text-sm text-dark">{address}</p>
              </div>
            </div>
          )}
        </div>

        {!email && !phone && !address && (
          <p className="text-text-secondary text-sm">
            Contact details are being updated. Please check back soon.
          </p>
        )}
      </div>
    </div>
  );
};

export default ContactPage;
