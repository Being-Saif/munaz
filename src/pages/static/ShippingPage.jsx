import { useState, useEffect } from 'react';
import { Truck, Clock, IndianRupee } from 'lucide-react';
import api from '@services/api';

const ShippingPage = () => {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    api.get('/settings/public').then((res) => setSettings(res.data)).catch(() => {});
  }, []);

  const fee = settings?.shippingFee ?? 10;
  const threshold = settings?.freeShippingThreshold ?? 500;

  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container max-w-3xl mx-auto">
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-dark mb-2">Shipping Information</h1>
        <p className="text-text-secondary text-sm mb-8">Everything you need to know about how we deliver your order.</p>

        <div className="space-y-4">
          <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
            <IndianRupee size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Shipping Charges</p>
              <p className="text-sm text-text-secondary mt-1">
                A flat shipping fee of <strong>₹{fee}</strong> applies to orders below <strong>₹{threshold}</strong>.
                Orders of <strong>₹{threshold} or more ship free</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
            <Clock size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Delivery Time</p>
              <p className="text-sm text-text-secondary mt-1">
                Standard delivery takes <strong>5–7 business days</strong>. Express delivery (where available)
                arrives in <strong>2–3 business days</strong>.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-5 rounded-xl border border-border bg-surface">
            <Truck size={20} className="text-primary mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-dark">Order Tracking</p>
              <p className="text-sm text-text-secondary mt-1">
                Once your order ships, you'll receive an update. You can also view your order status anytime under
                <strong> My Account → Orders</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingPage;
