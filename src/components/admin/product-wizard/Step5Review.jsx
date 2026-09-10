import { Edit2 } from 'lucide-react';
import { cn } from '@utils/cn';
import { useProductForm } from '@hooks/useProductForm';

const SectionHeader = ({ title, onEdit, darkMode }) => (
  <div className="flex items-center justify-between mb-3">
    <h3 className={cn('text-sm font-semibold', darkMode ? 'text-gray-200' : 'text-gray-800')}>{title}</h3>
    <button
      type="button"
      onClick={onEdit}
      className={cn('flex items-center gap-1 text-xs font-medium transition-colors', darkMode ? 'text-primary-light hover:text-primary' : 'text-primary hover:text-primary-dark')}
    >
      <Edit2 size={12} /> Edit
    </button>
  </div>
);

/**
 * Step 5 — Review & Submit
 * Shows a full summary of the draft product before creation, with per-section
 * Edit links that jump the wizard back to the relevant step.
 */
const Step5Review = ({ darkMode, onGoToStep }) => {
  const { draft } = useProductForm();
  const { category, images, name, description, basicDetails, additionalDetails, variants, pricing } = draft;

  const cardClass = cn('rounded-lg border p-4', darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-white');
  const rowLabel = cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400');
  const rowValue = cn('text-sm font-medium', darkMode ? 'text-gray-200' : 'text-gray-800');

  const discount = pricing.mrp && pricing.sellingPrice
    ? Math.round(((Number(pricing.mrp) - Number(pricing.sellingPrice)) / Number(pricing.mrp)) * 100)
    : 0;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Product basics */}
      <div className={cardClass}>
        <SectionHeader title="Product Details" onEdit={() => onGoToStep(1)} darkMode={darkMode} />

        {images.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto">
            {images.map((img) => (
              <img key={img.publicId || img.url} src={img.url} alt="" className="w-16 h-16 rounded-lg object-cover border border-gray-200 flex-shrink-0" />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p className={rowLabel}>Product Name</p>
            <p className={rowValue}>{name || '—'}</p>
          </div>
          <div>
            <p className={rowLabel}>Category</p>
            <p className={rowValue}>{category?.name || '—'}</p>
          </div>
        </div>
        <div className="mt-3">
          <p className={rowLabel}>Description</p>
          <p className={cn('text-sm mt-0.5', darkMode ? 'text-gray-300' : 'text-gray-600')}>{description || '—'}</p>
        </div>
      </div>

      {/* Basic details */}
      <div className={cardClass}>
        <SectionHeader title="Basic Details" onEdit={() => onGoToStep(2)} darkMode={darkMode} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div><p className={rowLabel}>Fabric</p><p className={rowValue}>{basicDetails.fabric || '—'}</p></div>
          <div><p className={rowLabel}>Fit</p><p className={rowValue}>{basicDetails.fit || '—'}</p></div>
          <div><p className={rowLabel}>Length</p><p className={rowValue}>{basicDetails.length || '—'}</p></div>
          <div><p className={rowLabel}>Neck</p><p className={rowValue}>{basicDetails.neck || '—'}</p></div>
          <div><p className={rowLabel}>Color</p><p className={rowValue}>{basicDetails.color?.join(', ') || '—'}</p></div>
          <div><p className={rowLabel}>Occasion</p><p className={rowValue}>{basicDetails.occasion?.join(', ') || '—'}</p></div>
        </div>
      </div>

      {/* Additional details */}
      <div className={cardClass}>
        <SectionHeader title="Additional Details" onEdit={() => onGoToStep(3)} darkMode={darkMode} />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div><p className={rowLabel}>Brand</p><p className={rowValue}>{additionalDetails.brand || '—'}</p></div>
          <div><p className={rowLabel}>Pattern</p><p className={rowValue}>{additionalDetails.pattern || '—'}</p></div>
          <div><p className={rowLabel}>Style Code</p><p className={rowValue}>{additionalDetails.styleCode || '—'}</p></div>
        </div>
      </div>

      {/* Variants */}
      <div className={cardClass}>
        <SectionHeader title="Variants" onEdit={() => onGoToStep(4)} darkMode={darkMode} />
        {variants.length === 0 ? (
          <p className={cn('text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>No variants added</p>
        ) : (
          <div className="space-y-1.5">
            {variants.map((v, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{v.color} - {v.size}</span>
                <span className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>SKU: {v.sku} · Stock {v.stock}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Price */}
      <div className={cardClass}>
        <SectionHeader title="Price" onEdit={() => onGoToStep(4)} darkMode={darkMode} />
        <div className="flex items-center gap-4">
          <div>
            <p className={rowLabel}>MRP</p>
            <p className={rowValue}>₹{pricing.mrp || '—'}</p>
          </div>
          <div>
            <p className={rowLabel}>Selling Price</p>
            <p className={cn(rowValue, 'text-primary')}>₹{pricing.sellingPrice || '—'}</p>
          </div>
          {discount > 0 && (
            <div>
              <p className={rowLabel}>Discount</p>
              <p className="text-sm font-medium text-green-600">{discount}% off</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
