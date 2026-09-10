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
          <div><p className={rowLabel}>Net Quantity</p><p className={rowValue}>{additionalDetails.netQuantity || 1} {additionalDetails.unit || 'Piece'}</p></div>
        </div>
      </div>

      {/* Variants */}
      <div className={cardClass}>
        <SectionHeader title={`Variants (${variants.length})`} onEdit={() => onGoToStep(4)} darkMode={darkMode} />
        {variants.length === 0 ? (
          <p className={cn('text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>No variants added</p>
        ) : (
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <table className="w-full">
              <thead>
                <tr className={cn('text-xs uppercase', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                  <th className="px-4 sm:px-0 py-2 text-left font-medium">Photo</th>
                  <th className="px-4 sm:px-3 py-2 text-left font-medium">Color</th>
                  <th className="px-4 sm:px-3 py-2 text-left font-medium">Size</th>
                  <th className="px-4 sm:px-3 py-2 text-left font-medium">Price</th>
                  <th className="px-4 sm:px-3 py-2 text-left font-medium">Stock</th>
                </tr>
              </thead>
              <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
                {variants.map((v, i) => {
                  const thumb = v.images?.[0]?.url;
                  return (
                    <tr key={i}>
                      <td className="px-4 sm:px-0 py-2">
                        {thumb ? (
                          <img src={thumb} alt="" className="w-9 h-9 rounded-md object-cover border border-gray-200" />
                        ) : (
                          <div className={cn('w-9 h-9 rounded-md border', darkMode ? 'border-gray-700 bg-gray-700/50' : 'border-gray-200 bg-gray-50')} />
                        )}
                      </td>
                      <td className={cn('px-4 sm:px-3 py-2 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>{v.color}</td>
                      <td className={cn('px-4 sm:px-3 py-2 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>{v.size}</td>
                      <td className={cn('px-4 sm:px-3 py-2 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>
                        {v.price ? `₹${v.price}` : <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>—</span>}
                      </td>
                      <td className={cn('px-4 sm:px-3 py-2 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>{v.stock}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
          {pricing.returnsPrice && (
            <div>
              <p className={rowLabel}>Returns Price</p>
              <p className={rowValue}>₹{pricing.returnsPrice}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step5Review;
