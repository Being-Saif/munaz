import { useProductForm } from '@hooks/useProductForm';
import DynamicAttributeRenderer from '@components/admin/DynamicAttributeRenderer';

// Attribute configuration — drives DynamicAttributeRenderer.
// This is deliberately data-driven so more attributes/categories can be added later
// without touching the renderer component itself.
const BASIC_DETAILS_CONFIG = [
  { name: 'fabric', label: 'Fabric', type: 'dropdown', required: true, options: ['Cotton', 'Silk', 'Georgette', 'Chiffon', 'Linen', 'Rayon', 'Crepe', 'Velvet'] },
  { name: 'color', label: 'Color', type: 'multi-select', required: true, options: ['Red', 'Blue', 'Green', 'Yellow', 'Pink', 'Black', 'White', 'Gold', 'Maroon', 'Navy', 'Beige', 'Purple'] },
  { name: 'fit', label: 'Fit / Shape', type: 'dropdown', options: ['A-Line', 'Straight', 'Flared', 'Regular Fit', 'Slim Fit', 'Relaxed Fit'] },
  { name: 'length', label: 'Length', type: 'dropdown', options: ['Above Knee', 'Knee Length', 'Calf Length', 'Mid-Calf', 'Ankle Length', 'Floor Length', 'Short', 'Regular'] },
  { name: 'neck', label: 'Neck', type: 'dropdown', options: ['Round Neck', 'V-Neck', 'Collar Neck', 'Boat Neck', 'High Neck', 'Sweetheart Neck'] },
  { name: 'occasion', label: 'Occasion', type: 'multi-select', options: ['Wedding', 'Party', 'Casual', 'Festive', 'Office Wear', 'Daily Wear'] },
  { name: 'size', label: 'Size', type: 'chips', required: true, options: ['XXS', 'XS', 'S', 'SM', 'M', 'L', 'XL', 'XXL', '3XL', '4XL', '5XL', '6XL', '7XL', '8XL', '9XL', '10XL', 'Free Size'] },
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
    <div className="max-w-2xl">
      <DynamicAttributeRenderer
        config={BASIC_DETAILS_CONFIG}
        values={draft.basicDetails}
        onChange={handleChange}
        darkMode={darkMode}
      />
    </div>
  );
};

export const validateStep2 = (draft) => {
  const errors = {};
  const { fabric, color, size } = draft.basicDetails;
  if (!fabric) errors.fabric = 'Fabric is required';
  if (!color || color.length === 0) errors.color = 'Select at least one color';
  if (!size || size.length === 0) errors.size = 'Select at least one size';
  return errors;
};

export default Step2BasicDetails;
