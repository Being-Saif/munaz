import { useState, useEffect, useRef } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';

/**
 * CategorySelector - searchable dropdown for picking a product category
 * Fetches live categories from the backend (reuses existing category management).
 */
const CategorySelector = ({ value, onChange, darkMode }) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    api.get('/categories')
      .then((res) => setCategories(res.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));

  const inputBase = cn(
    'w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-sm transition-colors cursor-pointer',
    darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300 text-gray-900'
  );

  return (
    <div ref={ref} className="relative">
      <button type="button" onClick={() => setOpen(!open)} className={inputBase}>
        <span className={cn(!value && (darkMode ? 'text-gray-500' : 'text-gray-400'))}>
          {value ? value.name : 'Select Category'}
        </span>
        <ChevronDown size={16} className={cn('transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <div className={cn(
          'absolute z-20 mt-1.5 w-full rounded-lg border shadow-lg overflow-hidden',
          darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        )}>
          <div className={cn('flex items-center gap-2 px-3 py-2 border-b', darkMode ? 'border-gray-700' : 'border-gray-100')}>
            <Search size={14} className="text-gray-400" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search category..."
              className={cn('flex-1 bg-transparent text-sm outline-none', darkMode ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400')}
            />
          </div>
          <div className="max-h-56 overflow-y-auto">
            {loading && <p className="px-3.5 py-3 text-sm text-gray-400">Loading categories...</p>}
            {!loading && filtered.length === 0 && <p className="px-3.5 py-3 text-sm text-gray-400">No categories found</p>}
            {filtered.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => { onChange(cat); setOpen(false); setQuery(''); }}
                className={cn(
                  'w-full flex items-center justify-between px-3.5 py-2.5 text-sm text-left transition-colors',
                  darkMode ? 'hover:bg-gray-700 text-gray-200' : 'hover:bg-gray-50 text-gray-700'
                )}
              >
                {cat.name}
                {value?._id === cat._id && <Check size={15} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySelector;
