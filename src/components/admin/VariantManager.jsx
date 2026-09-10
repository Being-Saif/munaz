import { useState, useEffect } from 'react';
import { cn } from '@utils/cn';

const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'];
const SIZE_OPTIONS = ['XXS', 'XS', 'S', 'SM', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL', 'Free Size'];

const makeSku = (name, color, size) => {
  const base = (name || 'PRD').replace(/\s+/g, '').slice(0, 4).toUpperCase();
  return `${base}-${color.slice(0, 3).toUpperCase()}-${size}`;
};

/**
 * VariantManager - color/size picker for generating variant combinations.
 *
 * Pre-populated from the colors/sizes already chosen in Step 2 (Basic Details)
 * so the admin isn't asked to select the same thing twice. They can still
 * add/remove selections here if a specific variant combination doesn't apply.
 */
const VariantManager = ({ productName, existingVariants, initialColors = [], initialSizes = [], onGenerate, darkMode }) => {
  const [colors, setColors] = useState(initialColors);
  const [sizes, setSizes] = useState(initialSizes);

  // If Step 2's selections change (e.g. admin goes back and edits them),
  // keep this in sync as long as the admin hasn't already generated variants.
  useEffect(() => {
    if (existingVariants.length === 0) {
      setColors(initialColors);
      setSizes(initialSizes);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialColors.join(','), initialSizes.join(',')]);

  const toggle = (list, setList, value) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const handleGenerate = () => {
    if (colors.length === 0 || sizes.length === 0) return;

    const newVariants = [];
    colors.forEach((color) => {
      sizes.forEach((size) => {
        // Don't duplicate a combination that already exists in the table
        const exists = existingVariants.some((v) => v.color === color && v.size === size);
        if (!exists) {
          newVariants.push({ color, size, sku: makeSku(productName, color, size), stock: 0, price: '', images: [] });
        }
      });
    });
    onGenerate(newVariants);
  };

  const chipClass = (selected) => cn(
    'min-w-[44px] h-9 px-3 rounded-lg border text-sm font-medium transition-colors',
    selected
      ? 'bg-primary text-white border-primary'
      : darkMode ? 'border-gray-600 text-gray-300 hover:border-gray-500' : 'border-gray-300 text-gray-600 hover:border-gray-400'
  );

  return (
    <div className={cn('rounded-lg border p-4 space-y-4', darkMode ? 'border-gray-700 bg-gray-800/50' : 'border-gray-200 bg-gray-50')}>
      {(initialColors.length > 0 || initialSizes.length > 0) && (
        <p className={cn('text-xs', darkMode ? 'text-gray-400' : 'text-gray-500')}>
          Pre-filled from the colors/sizes you picked in Basic Details — adjust below if needed.
        </p>
      )}

      <div>
        <p className={cn('text-sm font-medium mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>Color</p>
        <div className="flex flex-wrap gap-2">
          {COLOR_OPTIONS.map((color) => (
            <button key={color} type="button" onClick={() => toggle(colors, setColors, color)} className={chipClass(colors.includes(color))}>
              {color}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={cn('text-sm font-medium mb-2', darkMode ? 'text-gray-300' : 'text-gray-700')}>Size</p>
        <div className="flex flex-wrap gap-2">
          {SIZE_OPTIONS.map((size) => (
            <button key={size} type="button" onClick={() => toggle(sizes, setSizes, size)} className={chipClass(sizes.includes(size))}>
              {size}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={colors.length === 0 || sizes.length === 0}
        className="w-full sm:w-auto px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Generate Variants
      </button>
    </div>
  );
};

export default VariantManager;
