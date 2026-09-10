// Maps the fixed color-name palette used across the product wizard
// (VariantManager, DynamicAttributeRenderer) to real hex values, so
// color swatches actually render the correct color on the storefront
// instead of an empty/default background.
export const COLOR_HEX_MAP = {
  Red: '#DC2626',
  Blue: '#2563EB',
  Green: '#16A34A',
  Yellow: '#EAB308',
  Pink: '#EC4899',
  Black: '#1F2937',
  White: '#F9FAFB',
  Gold: '#D97706',
  Maroon: '#800020',
  Navy: '#1E3A5F',
  Beige: '#D2B48C',
  Purple: '#7E57C2',
};

export const getColorHex = (name) => COLOR_HEX_MAP[name] || '#9CA3AF'; // neutral gray fallback for unknown names
