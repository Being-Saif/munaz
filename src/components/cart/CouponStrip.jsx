import { useState, useEffect } from 'react';
import { Tag } from 'lucide-react';
import api from '@services/api';

/**
 * CouponStrip — shows available coupons (displayLocation 'cart') as small cards
 * with title, code and discount. A single coupon sits static; multiple coupons
 * scroll continuously (marquee). Purely informational.
 */
const CouponStrip = () => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    api.get('/coupons?location=cart')
      .then((res) => setCoupons(res.data || []))
      .catch(() => {});
  }, []);

  if (coupons.length === 0) return null;

  const label = (c) => c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} OFF`;

  const Card = ({ c }) => (
    <div className="flex items-center gap-2 flex-shrink-0 rounded-lg border border-dashed border-primary/40 bg-primary/5 px-3 py-2 mr-3">
      <Tag size={14} className="text-primary flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs font-semibold text-dark leading-tight truncate max-w-[140px]">{c.name}</p>
        <p className="text-[11px] text-text-secondary leading-tight">
          <span className="font-mono font-bold text-primary">{c.code}</span> · {label(c)}
        </p>
      </div>
    </div>
  );

  // Single coupon → static. Multiple → infinite marquee.
  const isMarquee = coupons.length > 1;

  return (
    <div className="mb-4 overflow-hidden">
      {isMarquee ? (
        <div className="relative overflow-hidden">
          <div className="flex w-max animate-coupon-marquee hover:[animation-play-state:paused]">
            {/* duplicate the set so the scroll loops seamlessly */}
            {[...coupons, ...coupons].map((c, i) => <Card key={`${c._id}-${i}`} c={c} />)}
          </div>
          <style>{`
            @keyframes coupon-marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
            .animate-coupon-marquee {
              animation: coupon-marquee ${coupons.length * 6}s linear infinite;
            }
          `}</style>
        </div>
      ) : (
        <div className="flex"><Card c={coupons[0]} /></div>
      )}
    </div>
  );
};

export default CouponStrip;
