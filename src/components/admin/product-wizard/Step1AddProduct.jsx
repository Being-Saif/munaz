import { useState } from 'react';
import { cn } from '@utils/cn';
import { useProductForm } from '@hooks/useProductForm';
import CategorySelector from '@components/admin/CategorySelector';
import ProductImageUploader from '@components/admin/ProductImageUploader';

/**
 * Step 1 — Add Product
 * Collects: category, product images, product name, description
 */
const Step1AddProduct = ({ darkMode }) => {
  const { draft, setField } = useProductForm();
  const [errors, setErrors] = useState({});

  const labelClass = cn('text-sm font-medium mb-1.5 block', darkMode ? 'text-gray-300' : 'text-gray-700');
  const inputClass = cn(
    'w-full px-3.5 py-2.5 rounded-lg border text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30',
    darkMode ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500' : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
  );
  const errorClass = 'text-red-500 text-xs mt-1';

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className={labelClass}>Category *</label>
        <CategorySelector
          value={draft.category}
          onChange={(cat) => { setField('category', cat); setErrors((p) => ({ ...p, category: '' })); }}
          darkMode={darkMode}
        />
        {errors.category && <p className={errorClass}>{errors.category}</p>}
      </div>

      <div>
        <label className={labelClass}>Product Images *</label>
        <ProductImageUploader
          images={draft.images}
          onChange={(images) => { setField('images', images); setErrors((p) => ({ ...p, images: '' })); }}
          darkMode={darkMode}
        />
        {errors.images && <p className={errorClass}>{errors.images}</p>}
      </div>

      <div>
        <label className={labelClass}>Product Name *</label>
        <input
          value={draft.name}
          onChange={(e) => { setField('name', e.target.value); setErrors((p) => ({ ...p, name: '' })); }}
          placeholder="e.g. Designer Silk Kurti"
          className={inputClass}
        />
        {errors.name && <p className={errorClass}>{errors.name}</p>}
      </div>

      <div>
        <label className={labelClass}>Description *</label>
        <textarea
          value={draft.description}
          onChange={(e) => { setField('description', e.target.value); setErrors((p) => ({ ...p, description: '' })); }}
          rows={4}
          maxLength={1000}
          placeholder="Describe the product — fabric feel, fit, occasion, styling tips..."
          className={inputClass}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? <p className={errorClass}>{errors.description}</p> : <span />}
          <span className={cn('text-xs', darkMode ? 'text-gray-500' : 'text-gray-400')}>{draft.description.length}/1000</span>
        </div>
      </div>
    </div>
  );
};

// Validation used by the wizard container before allowing "Next"
export const validateStep1 = (draft) => {
  const errors = {};
  if (!draft.category) errors.category = 'Please select a category';
  if (!draft.images || draft.images.length === 0) errors.images = 'Please upload at least one image';
  if (!draft.name?.trim()) errors.name = 'Product name is required';
  if (!draft.description?.trim()) errors.description = 'Description is required';
  return errors;
};

export default Step1AddProduct;
