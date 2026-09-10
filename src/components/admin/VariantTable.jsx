import { useState, Fragment } from 'react';
import { Trash2, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@utils/cn';
import ProductImageUploader from '@components/admin/ProductImageUploader';

/**
 * VariantTable - lists generated color/size variants with inline-editable
 * SKU, stock, and price. Each row can be expanded to add variant-specific
 * images (e.g. the actual Blue product photos for the Blue variant) —
 * generated first, images added after, per the recommended flow.
 */
const VariantTable = ({ variants, onUpdate, onRemove, darkMode }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  if (!variants || variants.length === 0) return null;

  const cellInput = cn(
    'w-full px-2 py-1.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-colors',
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  );

  return (
    <div className={cn('rounded-lg border overflow-hidden', darkMode ? 'border-gray-700' : 'border-gray-200')}>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
              <th className="px-4 py-2.5 text-left font-medium">Color</th>
              <th className="px-4 py-2.5 text-left font-medium">Size</th>
              <th className="px-4 py-2.5 text-left font-medium">SKU</th>
              <th className="px-4 py-2.5 text-left font-medium w-28">Stock</th>
              <th className="px-4 py-2.5 text-left font-medium w-32">Price (₹)</th>
              <th className="px-4 py-2.5 text-left font-medium w-28">Images <span className="opacity-60">(optional)</span></th>
              <th className="px-4 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
            {variants.map((variant, index) => {
              const imageCount = variant.images?.length || 0;
              const isExpanded = expandedIndex === index;

              return (
                <Fragment key={`${variant.color}-${variant.size}-${index}`}>
                  <tr className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}>
                    <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>{variant.color}</td>
                    <td className={cn('px-4 py-2.5 text-sm', darkMode ? 'text-gray-200' : 'text-gray-800')}>{variant.size}</td>
                    <td className="px-4 py-2.5">
                      <input
                        value={variant.sku}
                        onChange={(e) => onUpdate(index, { sku: e.target.value })}
                        className={cellInput}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        value={variant.stock === 0 ? '' : variant.stock}
                        onChange={(e) => onUpdate(index, { stock: e.target.value === '' ? 0 : Number(e.target.value) })}
                        placeholder="0"
                        className={cellInput}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <input
                        type="number"
                        min="0"
                        value={variant.price}
                        onChange={(e) => onUpdate(index, { price: e.target.value })}
                        placeholder="Optional"
                        className={cellInput}
                      />
                    </td>
                    <td className="px-4 py-2.5">
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(isExpanded ? null : index)}
                        className={cn(
                          'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors',
                          imageCount > 0
                            ? darkMode ? 'bg-primary/20 text-primary-light hover:bg-primary/30' : 'bg-primary/10 text-primary hover:bg-primary/20'
                            : darkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        )}
                      >
                        <ImageIcon size={13} />
                        {imageCount > 0 ? `${imageCount} photo${imageCount > 1 ? 's' : ''}` : 'Add Images'}
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        type="button"
                        onClick={() => onRemove(index)}
                        className={cn('p-1.5 rounded-lg transition-colors', darkMode ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-600 hover:bg-gray-100')}
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr className={darkMode ? 'bg-gray-800/70' : 'bg-gray-50/70'}>
                      <td colSpan={7} className="px-4 py-4">
                        <p className={cn('text-xs font-medium mb-2', darkMode ? 'text-gray-400' : 'text-gray-500')}>
                          Photos for {variant.color} · {variant.size} — optional. Falls back to the product&apos;s main photos if left empty.
                        </p>
                        <ProductImageUploader
                          images={variant.images || []}
                          onChange={(images) => onUpdate(index, { images })}
                          darkMode={darkMode}
                        />
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantTable;
