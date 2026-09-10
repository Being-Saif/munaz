import { cn } from '@utils/cn';

const GST_OPTIONS = ['0', '5', '12', '18', '28'];

/**
 * PricingForm - MRP, Selling Price, GST%. Validates selling price < MRP.
 */
const PricingForm = ({ pricing, onChange, darkMode }) => {
  const labelClass = cn('text-sm font-medium mb-1.5 block', darkMode ? 'text-gray-300' : 'text-gray-700');
  const inputClass = cn(
    'w-full pl-7 pr-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  );

  const mrp = Number(pricing.mrp) || 0;
  const sellingPrice = Number(pricing.sellingPrice) || 0;
  const priceError = mrp > 0 && sellingPrice > 0 && sellingPrice >= mrp;
  const discount = mrp > 0 && sellingPrice > 0 && sellingPrice < mrp
    ? Math.round(((mrp - sellingPrice) / mrp) * 100)
    : 0;

  return (
    <div className="max-w-2xl space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>MRP *</label>
          <div className="relative">
            <span className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>₹</span>
            <input
              type="number"
              min="0"
              value={pricing.mrp}
              onChange={(e) => onChange({ ...pricing, mrp: e.target.value })}
              placeholder="0"
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Selling Price *</label>
          <div className="relative">
            <span className={cn('absolute left-3 top-1/2 -translate-y-1/2 text-sm', darkMode ? 'text-gray-400' : 'text-gray-500')}>₹</span>
            <input
              type="number"
              min="0"
              value={pricing.sellingPrice}
              onChange={(e) => onChange({ ...pricing, sellingPrice: e.target.value })}
              placeholder="0"
              className={cn(inputClass, priceError && 'border-red-500 focus:ring-red-500/30')}
            />
          </div>
          {priceError && <p className="text-red-500 text-xs mt-1">Selling price must be less than MRP</p>}
          {!priceError && discount > 0 && <p className="text-green-600 text-xs mt-1">{discount}% off — looks good</p>}
        </div>
      </div>

      <div>
        <label className={labelClass}>GST %</label>
        <select
          value={pricing.gst}
          onChange={(e) => onChange({ ...pricing, gst: e.target.value })}
          className={cn(inputClass, 'pl-3.5')}
        >
          {GST_OPTIONS.map((g) => <option key={g} value={g}>{g}%</option>)}
        </select>
      </div>
    </div>
  );
};

export default PricingForm;
