import { AlertCircle } from 'lucide-react';
import { cn } from '@utils/cn';
import { useProductForm } from '@hooks/useProductForm';
import VariantManager from '@components/admin/VariantManager';
import VariantTable from '@components/admin/VariantTable';
import SizeChartEditor from '@components/admin/SizeChartEditor';
import PricingForm from '@components/admin/PricingForm';

// Categories where a size chart is relevant. Matched against category name/slug (case-insensitive).
const CLOTHING_CATEGORY_HINTS = ['kurta', 'saree', 'co-ord', 'dress', 'palazzo', 'top', 'shirt', 'fashion', 'ethnic'];

const isClothingCategory = (category) => {
  if (!category) return false;
  const text = `${category.name || ''} ${category.slug || ''}`.toLowerCase();
  return CLOTHING_CATEGORY_HINTS.some((hint) => text.includes(hint));
};

/**
 * Step 4 — Variants
 * Generate color x size variant combinations, edit stock/SKU/price per variant,
 * optional size chart (clothing categories only), and overall pricing.
 */
const Step4Variants = ({ darkMode, errors = {} }) => {
  const { draft, addVariant, updateVariant, removeVariant, setSection, addSizeChartRow, updateSizeChartRow, removeSizeChartRow } = useProductForm();

  const handleGenerate = (newVariants) => {
    newVariants.forEach((v) => addVariant(v));
  };

  const showSizeChart = isClothingCategory(draft.category);
  const errorClass = 'text-red-500 text-xs mt-2';
  const errorMessages = Object.values(errors).filter(Boolean);

  return (
    <div className="max-w-3xl space-y-8">
      {/* Prominent error summary — unmissable, regardless of scroll position */}
      {errorMessages.length > 0 && (
        <div className={cn('flex items-start gap-2.5 rounded-lg border p-4', darkMode ? 'bg-red-950/40 border-red-800' : 'bg-red-50 border-red-200')}>
          <AlertCircle size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className={cn('text-sm font-medium', darkMode ? 'text-red-300' : 'text-red-700')}>Please fix before continuing:</p>
            <ul className={cn('text-sm mt-1 space-y-0.5 list-disc list-inside', darkMode ? 'text-red-300' : 'text-red-600')}>
              {errorMessages.map((msg, i) => <li key={i}>{msg}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Variant creation */}
      <div>
        <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-gray-200' : 'text-gray-800')}>Create Variants</h3>
        <VariantManager
          productName={draft.name}
          existingVariants={draft.variants}
          initialColors={draft.basicDetails.color || []}
          initialSizes={draft.basicDetails.size || []}
          onGenerate={handleGenerate}
          darkMode={darkMode}
        />
        {errors.variants && <p className={errorClass}>{errors.variants}</p>}
      </div>

      {/* Variant table */}
      {draft.variants.length > 0 && (
        <div>
          <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-gray-200' : 'text-gray-800')}>Variants ({draft.variants.length})</h3>
          <VariantTable
            variants={draft.variants}
            onUpdate={updateVariant}
            onRemove={removeVariant}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* Size chart — clothing categories only */}
      {showSizeChart && (
        <div>
          <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-gray-200' : 'text-gray-800')}>Size Chart</h3>
          <SizeChartEditor
            rows={draft.sizeChart}
            onAddRow={addSizeChartRow}
            onUpdateRow={updateSizeChartRow}
            onRemoveRow={removeSizeChartRow}
            darkMode={darkMode}
          />
        </div>
      )}

      {/* ─── Divider between Variants and Pricing sections ─── */}
      <div className={cn('border-t pt-6', darkMode ? 'border-gray-700' : 'border-gray-200')}>
        <h3 className={cn('text-sm font-semibold mb-3', darkMode ? 'text-gray-200' : 'text-gray-800')}>Pricing & Tax Details</h3>
        <PricingForm
          pricing={draft.pricing}
          onChange={(pricing) => setSection('pricing', pricing)}
          darkMode={darkMode}
        />
        {errors.mrp && <p className={errorClass}>{errors.mrp}</p>}
        {errors.sellingPrice && <p className={errorClass}>{errors.sellingPrice}</p>}
      </div>
    </div>
  );
};

export const validateStep4 = (draft) => {
  const errors = {};
  if (draft.variants.length === 0) errors.variants = 'Please generate at least one variant';
  if (!draft.pricing.mrp) errors.mrp = 'MRP is required';
  if (!draft.pricing.sellingPrice) errors.sellingPrice = 'Selling price is required';
  if (draft.pricing.mrp && draft.pricing.sellingPrice && Number(draft.pricing.sellingPrice) >= Number(draft.pricing.mrp)) {
    errors.sellingPrice = 'Selling price must be less than MRP';
  }
  return errors;
};

export default Step4Variants;
