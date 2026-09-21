import { cn } from '@utils/cn';
import { useProductForm } from '@hooks/useProductForm';
import DynamicAttributeRenderer from '@components/admin/DynamicAttributeRenderer';

// Attribute configuration — drives DynamicAttributeRenderer.
// This is deliberately data-driven so more attributes/categories can be added later
// without touching the renderer component itself.
const BASIC_DETAILS_CONFIG = [
  { name: 'fabric', label: 'Fabric', type: 'dropdown', allowCustom: true, options: ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Linen', 'Rayon', 'Crepe', 'Velvet'] },
  { name: 'color', label: 'Color', type: 'multi-select', required: true, allowCustom: true, options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'] },
  { name: 'fit', label: 'Fit / Shape', type: 'dropdown', allowCustom: true, options: ['A-Line', 'Straight', 'Flared', 'Regular Fit', 'Slim Fit', 'Relaxed Fit'] },
  { name: 'length', label: 'Length', type: 'dropdown', allowCustom: true, options: ['Above Knee', 'Knee Length', 'Calf Length', 'Mid-Calf', 'Ankle Length', 'Floor Length', 'Short', 'Regular'] },
  { name: 'neck', label: 'Neck', type: 'dropdown', allowCustom: true, options: ['Round Neck', 'V-Neck', 'Collar Neck', 'Boat Neck', 'High Neck', 'Sweetheart Neck'] },
  { name: 'sleeve', label: 'Sleeve', type: 'dropdown', allowCustom: true, options: ['Sleeveless', 'Short Sleeve', 'Half Sleeve', '3/4 Sleeve', 'Full Sleeve', 'Cap Sleeve', 'Puff Sleeve', 'Bell Sleeve'] },
  { name: 'occasion', label: 'Occasion', type: 'multi-select', allowCustom: true, options: ['Wedding', 'Party', 'Casual', 'Festive', 'Office Wear', 'Daily Wear'] },
  { name: 'size', label: 'Size', type: 'chips', required: true, allowCustom: true, options: ['XXS', 'XS', 'S', 'SM', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL', 'Free Size'] },
];

// Bottom & Dupatta details — shown for kurta sets / co-ords. Kept as a separate
// config block so the section can be visually grouped under its own heading.
const SET_DETAILS_CONFIG = [
  { name: 'bottomType', label: 'Bottom Type', type: 'dropdown', allowCustom: true, options: ['Palazzo', 'Pant', 'Churidar', 'Salwar', 'Sharara', 'Skirt', 'Leggings', 'Dhoti'] },
  { name: 'bottomColor', label: 'Bottom Color', type: 'dropdown', allowCustom: true, options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'] },
  { name: 'bottomFabric', label: 'Bottom Fabric', type: 'dropdown', allowCustom: true, options: ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Linen', 'Rayon', 'Crepe', 'Velvet'] },
  { name: 'dupattaColor', label: 'Dupatta Color', type: 'dropdown', allowCustom: true, options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'] },
  { name: 'dupattaFabric', label: 'Dupatta Fabric', type: 'dropdown', allowCustom: true, options: ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Linen', 'Rayon', 'Crepe', 'Velvet', 'Net'] },
];

/**
 * Step 2 — Basic Details
 * Category-specific dynamic attributes (fabric, color, fit, length, neck, occasion, size).
 */
const Step2BasicDetails = ({ darkMode }) => {
  const { draft, setSection } = useProductForm();

  const handleChange = (name, value) => {
    setSection('basicDetails', { ...draft.basicDetails, [name]: value });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <DynamicAttributeRenderer
        config={BASIC_DETAILS_CONFIG}
        values={draft.basicDetails}
        onChange={handleChange}
        darkMode={darkMode}
      />

      {/* Bottom & Dupatta details — for kurta sets / co-ords (all optional) */}
      <div className={cn('border-t pt-5', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <h3 className={cn('text-sm font-semibold mb-1', darkMode ? 'text-gray-200' : 'text-gray-800')}>
          Bottom & Dupatta Details <span className={cn('font-normal', darkMode ? 'text-gray-400' : 'text-gray-500')}>(optional)</span>
        </h3>
        <p className={cn('text-xs mb-4', darkMode ? 'text-gray-400' : 'text-gray-500')}>
          Fill these only if the product is a set (kurta with bottom / dupatta).
        </p>
        <DynamicAttributeRenderer
          config={SET_DETAILS_CONFIG}
          values={draft.basicDetails}
          onChange={handleChange}
          darkMode={darkMode}
        />
      </div>
    </div>
  );
};

export const validateStep2 = (draft) => {
  const errors = {};
  const { color, size } = draft.basicDetails;
  // Fabric is no longer mandatory.
  if (!color || color.length === 0) errors.color = 'Select at least one color';
  if (!size || size.length === 0) errors.size = 'Select at least one size';
  return errors;
};

export default Step2BasicDetails;
