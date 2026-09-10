import { Trash2 } from 'lucide-react';
import { cn } from '@utils/cn';

/**
 * VariantTable - lists generated color/size variants with inline-editable
 * SKU, stock, and price. Supports row delete.
 */
const VariantTable = ({ variants, onUpdate, onRemove, darkMode }) => {
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
              <th className="px-4 py-2.5 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
            {variants.map((variant, index) => (
              <tr key={`${variant.color}-${variant.size}-${index}`} className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}>
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
                    value={variant.stock}
                    onChange={(e) => onUpdate(index, { stock: Number(e.target.value) })}
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VariantTable;
