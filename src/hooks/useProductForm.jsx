import { createContext, useContext, useReducer, useCallback } from 'react';

const initialDraft = {
  // Step 1: Add Product
  category: null, // { _id, name, slug }
  images: [], // [{ url, publicId, isPrimary }]
  name: '',
  description: '',

  // Step 2: Basic Details (dynamic attributes)
  basicDetails: {
    fabric: '',
    color: [],
    fit: '',
    length: '',
    occasion: [],
    size: [], // ['S', 'M', 'L', 'XL'] — key matches DynamicAttributeRenderer's config name
  },

  // Step 3: Additional Details
  additionalDetails: {
    brand: '',
    pattern: '',
    ornamentation: '',
    styleCode: '',
    careInstructions: '',
    countryOfOrigin: 'India',
    manufacturer: '',
    netQuantity: 1,
    unit: 'Piece',
  },

  // Step 4: Variants + Size Chart + Pricing
  variants: [], // [{ color, size, sku, stock, price }]
  sizeChart: [], // [{ size, chest, waist, length }]
  pricing: {
    mrp: '',
    sellingPrice: '',
    returnsPrice: '',
    gst: '5',
  },
};

const ProductFormContext = createContext(null);

function draftReducer(state, action) {
  switch (action.type) {
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    case 'SET_NESTED_FIELD':
      return {
        ...state,
        [action.section]: { ...state[action.section], [action.field]: action.value },
      };
    case 'SET_SECTION':
      return { ...state, [action.section]: action.value };
    case 'ADD_VARIANT':
      return { ...state, variants: [...state.variants, action.variant] };
    case 'UPDATE_VARIANT':
      return {
        ...state,
        variants: state.variants.map((v, i) => (i === action.index ? { ...v, ...action.variant } : v)),
      };
    case 'REMOVE_VARIANT':
      return { ...state, variants: state.variants.filter((_, i) => i !== action.index) };
    case 'ADD_SIZE_CHART_ROW':
      return { ...state, sizeChart: [...state.sizeChart, action.row] };
    case 'UPDATE_SIZE_CHART_ROW':
      return {
        ...state,
        sizeChart: state.sizeChart.map((r, i) => (i === action.index ? { ...r, ...action.row } : r)),
      };
    case 'REMOVE_SIZE_CHART_ROW':
      return { ...state, sizeChart: state.sizeChart.filter((_, i) => i !== action.index) };
    case 'RESET':
      return initialDraft;
    default:
      return state;
  }
}

export const ProductFormProvider = ({ children }) => {
  const [draft, dispatch] = useReducer(draftReducer, initialDraft);

  const setField = useCallback((field, value) => dispatch({ type: 'SET_FIELD', field, value }), []);
  const setNestedField = useCallback((section, field, value) => dispatch({ type: 'SET_NESTED_FIELD', section, field, value }), []);
  const setSection = useCallback((section, value) => dispatch({ type: 'SET_SECTION', section, value }), []);
  const addVariant = useCallback((variant) => dispatch({ type: 'ADD_VARIANT', variant }), []);
  const updateVariant = useCallback((index, variant) => dispatch({ type: 'UPDATE_VARIANT', index, variant }), []);
  const removeVariant = useCallback((index) => dispatch({ type: 'REMOVE_VARIANT', index }), []);
  const addSizeChartRow = useCallback((row) => dispatch({ type: 'ADD_SIZE_CHART_ROW', row }), []);
  const updateSizeChartRow = useCallback((index, row) => dispatch({ type: 'UPDATE_SIZE_CHART_ROW', index, row }), []);
  const removeSizeChartRow = useCallback((index) => dispatch({ type: 'REMOVE_SIZE_CHART_ROW', index }), []);
  const reset = useCallback(() => dispatch({ type: 'RESET' }), []);

  const value = {
    draft, setField, setNestedField, setSection,
    addVariant, updateVariant, removeVariant,
    addSizeChartRow, updateSizeChartRow, removeSizeChartRow,
    reset,
  };

  return <ProductFormContext.Provider value={value}>{children}</ProductFormContext.Provider>;
};

export const useProductForm = () => {
  const ctx = useContext(ProductFormContext);
  if (!ctx) throw new Error('useProductForm must be used within ProductFormProvider');
  return ctx;
};

export default useProductForm;
