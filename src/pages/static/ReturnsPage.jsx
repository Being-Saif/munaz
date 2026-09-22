import { useState, useEffect } from 'react';
import { RotateCcw, MapPin, ShieldCheck } from 'lucide-react';
import api from '@services/api';

const ReturnsPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings/public').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const days = settings?.returnWindowDays ?? 7;
  const returnAddress = settings?.returnAddress;

  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">Returns &amp; Refunds</h1>
        <p className="text-text-secondary text-sm mb-8">Our policy for returns and exchanges.</p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
            <RotateCcw size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">{days}-Day Return Window</p>
              <p className="text-sm text-text-secondary mt-1">
                You can request a return within <strong>{days} days</strong> of receiving your order for items that are
                unused, unwashed, and in their original condition with tags intact.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
            <ShieldCheck size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Wrong or Defective Items</p>
              <p className="text-sm text-text-secondary mt-1">
                If you received a wrong or defective product, please contact us within {days} days and we'll make it right.
              </p>
            </div>
          </div>

          {returnAddress && (
            <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
              <MapPin size={20} className="text-primary mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-dark">Return Address</p>
                <p className="text-sm text-text-secondary mt-1">{returnAddress}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReturnsPage;
