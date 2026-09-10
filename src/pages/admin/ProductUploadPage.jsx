import { useState, useEffect } from 'react';
import { useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Save, Check } from 'lucide-react';
import { cn } from '@utils/cn';
import api from '@services/api';
import toast from 'react-hot-toast';
import { ProductFormProvider, useProductForm } from '@hooks/useProductForm';
import ProductStepper from '@components/admin/ProductStepper';
import Step1AddProduct, { validateStep1 } from '@components/admin/product-wizard/Step1AddProduct';
import Step2BasicDetails, { validateStep2 } from '@components/admin/product-wizard/Step2BasicDetails';
import Step3AdditionalDetails, { validateStep3 } from '@components/admin/product-wizard/Step3AdditionalDetails';
import Step4Variants, { validateStep4 } from '@components/admin/product-wizard/Step4Variants';
import Step5Review from '@components/admin/product-wizard/Step5Review';

const STEP_VALIDATORS = { 1: validateStep1, 2: validateStep2, 3: validateStep3, 4: validateStep4 };

/**
 * Builds the API payload from the wizard draft shape into the Product model shape.
 */
const buildPayload = (draft, status) => {
  const primaryImage = draft.images.find((img) => img.isPrimary) || draft.images[0];
  const totalStock = draft.variants.reduce((sum, v) => sum + (Number(v.stock) || 0), 0);
  const colors = [...new Set(draft.variants.map((v) => v.color))];
  const sizes = [...new Set(draft.variants.map((v) => v.size))].map((size) => ({
    name: size,
    stock: draft.variants.filter((v) => v.size === size).reduce((sum, v) => sum + (Number(v.stock) || 0), 0),
  }));

  return {
    name: draft.name,
    description: draft.description,
    category: draft.category?._id,
    images: draft.images.map((img) => ({ url: img.url, isPrimary: !!img.isPrimary })),
    thumbnail: primaryImage?.url,
    price: draft.pricing.mrp ? Number(draft.pricing.mrp) : undefined,
    salePrice: draft.pricing.sellingPrice ? Number(draft.pricing.sellingPrice) : undefined,
    gst: Number(draft.pricing.gst) || 5,
    returnsPrice: draft.pricing.returnsPrice ? Number(draft.pricing.returnsPrice) : undefined,
    isOnSale: !!(draft.pricing.sellingPrice && draft.pricing.mrp && Number(draft.pricing.sellingPrice) < Number(draft.pricing.mrp)),
    colors: colors.map((name) => ({ name, hex: '' })),
    sizes,
    totalStock,
    variants: draft.variants.map((v) => ({
      color: v.color,
      size: v.size,
      sku: v.sku,
      stock: Number(v.stock) || 0,
      price: v.price ? Number(v.price) : undefined,
      images: (v.images || []).map((img) => ({ url: img.url, isPrimary: !!img.isPrimary })),
    })),
    sizeChart: draft.sizeChart,
    attributes: {
      fabric: draft.basicDetails.fabric,
      fit: draft.basicDetails.fit,
      length: draft.basicDetails.length,
      neck: draft.basicDetails.neck,
      occasion: draft.basicDetails.occasion,
    },
    additionalDetails: draft.additionalDetails,
    brand: draft.additionalDetails.brand || undefined,
    status,
  };
};

/**
 * Maps a fetched product (from API) back into the wizard's draft shape,
 * used when resuming a draft or editing an existing product.
 */
const productToDraft = (product) => ({
  category: product.category || null,
  images: (product.images || []).map((img) => ({ url: img.url, isPrimary: img.isPrimary })),
  name: product.name || '',
  description: product.description || '',
  basicDetails: {
    fabric: product.attributes?.fabric || '',
    color: (product.colors || []).map((c) => c.name),
    fit: product.attributes?.fit || '',
    length: product.attributes?.length || '',
    neck: product.attributes?.neck || '',
    occasion: product.attributes?.occasion || [],
    sizes: (product.sizes || []).map((s) => s.name),
  },
  additionalDetails: {
    brand: product.brand || '',
    pattern: product.additionalDetails?.pattern || '',
    ornamentation: product.additionalDetails?.ornamentation || '',
    styleCode: product.additionalDetails?.styleCode || '',
    careInstructions: product.additionalDetails?.careInstructions || '',
    countryOfOrigin: product.additionalDetails?.countryOfOrigin || 'India',
    manufacturer: product.additionalDetails?.manufacturer || '',
    netQuantity: product.additionalDetails?.netQuantity ?? 1,
    unit: product.additionalDetails?.unit || 'Piece',
  },
  variants: (product.variants || []).map((v) => ({ color: v.color, size: v.size, sku: v.sku, stock: v.stock, price: v.price || '', images: (v.images || []).map((img) => ({ url: img.url, isPrimary: img.isPrimary })) })),
  sizeChart: product.sizeChart || [],
  pricing: {
    mrp: product.price || '',
    sellingPrice: product.salePrice || '',
    returnsPrice: product.returnsPrice || '',
    gst: String(product.gst ?? 5),
  },
});

const WizardContent = () => {
  const { darkMode } = useOutletContext();
  const navigate = useNavigate();
  const { id } = useParams(); // present when editing/resuming a draft
  const { draft, setSection, setField, reset } = useProductForm();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [productId, setProductId] = useState(id || null);

  // Load existing product (edit or resume draft)
  useEffect(() => {
    if (!id) {
      reset();
      return;
    }
    api.get(`/products/admin/${id}`)
      .then((res) => {
        const product = res.data;
        const loadedDraft = productToDraft(product);
        Object.entries(loadedDraft).forEach(([key, value]) => {
          if (['category', 'images', 'name', 'description'].includes(key)) setField(key, value);
          else setSection(key, value);
        });
        setCurrentStep(product.draftStep || 1);
      })
      .catch(() => toast.error('Failed to load product'))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const goToStep = (step) => setCurrentStep(step);

  const handleNext = () => {
    const validator = STEP_VALIDATORS[currentStep];
    const stepErrors = validator ? validator(draft) : {};
    setErrors(stepErrors);
    if (Object.keys(stepErrors).length > 0) {
      const firstError = Object.values(stepErrors)[0];
      toast.error(firstError || 'Please fix the errors before continuing');
      return;
    }
    setCurrentStep((s) => Math.min(s + 1, 5));
  };

  const handleBack = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const saveDraft = async () => {
    setSaving(true);
    try {
      const payload = { ...buildPayload(draft, 'draft'), draftStep: currentStep };
      if (productId) {
        await api.put(`/products/${productId}`, payload);
      } else {
        const res = await api.post('/products', payload);
        setProductId(res.data._id);
      }
      toast.success('Saved as draft');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const submitProduct = async () => {
    const step4Errors = validateStep4(draft);
    if (Object.keys(step4Errors).length > 0) {
      toast.error('Please complete pricing and variants before submitting');
      setCurrentStep(4);
      return;
    }

    setSaving(true);
    try {
      const payload = buildPayload(draft, 'active');
      if (productId) {
        await api.put(`/products/${productId}`, payload);
      } else {
        await api.post('/products', payload);
      }
      toast.success('Product created successfully');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Failed to create product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={cn('text-center py-16', darkMode ? 'text-gray-400' : 'text-gray-500')}>
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        Loading product...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className={cn('text-2xl font-heading font-bold', darkMode ? 'text-white' : 'text-gray-900')}>
          {productId ? 'Edit Product' : 'Create Product'}
        </h1>
      </div>

      <div className={cn('rounded-xl border p-4 sm:p-5', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <ProductStepper currentStep={currentStep} darkMode={darkMode} onStepClick={goToStep} />
      </div>

      <div className={cn('rounded-xl border p-5 sm:p-6', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        {currentStep === 1 && <Step1AddProduct darkMode={darkMode} />}
        {currentStep === 2 && <Step2BasicDetails darkMode={darkMode} />}
        {currentStep === 3 && <Step3AdditionalDetails darkMode={darkMode} />}
        {currentStep === 4 && <Step4Variants darkMode={darkMode} errors={errors} />}
        {currentStep === 5 && <Step5Review darkMode={darkMode} onGoToStep={goToStep} />}
      </div>

      {/* Footer navigation */}
      <div className={cn('flex items-center justify-between rounded-xl border p-4 sm:p-5', darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200')}>
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 1}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-40 disabled:cursor-not-allowed',
            darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          )}
        >
          <ArrowLeft size={15} /> Back
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={saveDraft}
            disabled={saving}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors disabled:opacity-50',
              darkMode ? 'border-gray-600 text-gray-300 hover:bg-gray-700' : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            )}
          >
            <Save size={15} /> Save as Draft
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors"
            >
              Next <ArrowRight size={15} />
            </button>
          ) : (
            <button
              type="button"
              onClick={submitProduct}
              disabled={saving}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary-dark transition-colors disabled:opacity-50"
            >
              <Check size={15} /> Submit Product
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const ProductUploadPage = () => (
  <ProductFormProvider>
    <WizardContent />
  </ProductFormProvider>
);

export default ProductUploadPage;
