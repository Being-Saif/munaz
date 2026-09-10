import { Plus, Trash2 } from 'lucide-react';
import { cn } from '@utils/cn';

const COLUMNS = [
  { key: 'size', label: 'Size' },
  { key: 'chest', label: 'Chest (in)' },
  { key: 'waist', label: 'Waist (in)' },
  { key: 'length', label: 'Length (in)' },
];

/**
 * SizeChartEditor - editable table for size measurements.
 * Conditionally rendered only for clothing categories by the parent step.
 */
const SizeChartEditor = ({ rows, onAddRow, onUpdateRow, onRemoveRow, darkMode }) => {
  const cellInput = cn(
    'w-full px-2 py-1.5 rounded-md border text-sm outline-none focus:ring-2 focus:ring-primary/30 transition-colors',
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  );

  return (
    <div>
      <div className={cn('rounded-lg border overflow-hidden', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className={cn('text-xs uppercase', darkMode ? 'bg-gray-700/50 text-gray-400' : 'bg-gray-50 text-gray-500')}>
                {COLUMNS.map((col) => (
                  <th key={col.key} className="px-4 py-2.5 text-left font-medium">{col.label}</th>
                ))}
                <th className="px-4 py-2.5 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className={cn('divide-y', darkMode ? 'divide-gray-700' : 'divide-gray-100')}>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={COLUMNS.length + 1} className={cn('px-4 py-6 text-center text-sm', darkMode ? 'text-gray-500' : 'text-gray-400')}>
                    No size chart rows yet — click &quot;Add Row&quot; below.
                  </td>
                </tr>
              )}
              {rows.map((row, index) => (
                <tr key={index} className={darkMode ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}>
                  {COLUMNS.map((col) => (
                    <td key={col.key} className="px-4 py-2.5">
                      <input
                        value={row[col.key] || ''}
                        onChange={(e) => onUpdateRow(index, { [col.key]: e.target.value })}
                        className={cellInput}
                      />
                    </td>
                  ))}
                  <td className="px-4 py-2.5 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveRow(index)}
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

      <button
        type="button"
        onClick={() => onAddRow({ size: '', chest: '', waist: '', length: '' })}
        className={cn(
          'mt-3 flex items-center gap-1.5 text-sm font-medium transition-colors',
          darkMode ? 'text-primary-light hover:text-primary' : 'text-primary hover:text-primary-dark'
        )}
      >
        <Plus size={15} /> Add Row
      </button>
    </div>
  );
};

export default SizeChartEditor;
