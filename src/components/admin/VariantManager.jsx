import { useState } from 'react';
import { cn } from '@utils/cn';

const COLOR_OPTIONS = ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const makeSku = (name, color, size) => {
  const base = (name || 'PRD').replace(/\s+/g, '').slice(0, 4).toUpperCase();
  return `${base}-${color.slice(0, 3).toUpperCase()}-${size}`;
};

/**
 * VariantManager - pick colors + sizes, then generate the cross-product of
 * color x size combinations into the variants table.
 */
const VariantManager = ({ productName, existingVariants, onGenerate, darkMode }) => {
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

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
