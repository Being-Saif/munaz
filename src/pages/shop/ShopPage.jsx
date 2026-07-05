import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import ProductGrid from '@components/product/ProductGrid';
import products from '@data/products.json';
import categories from '@data/categories.json';
import { cn } from '@utils/cn';
import { SORT_OPTIONS, SIZES } from '@utils/constants';
import { formatPrice } from '@utils/formatters';

const COLORS = [
  { name: 'Black', hex: '#1F2937' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Pink', hex: '#EC4899' },
  { name: 'Lavender', hex: '#B39DDB' },
  { name: 'Navy', hex: '#1E3A5F' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Teal', hex: '#0D9488' },
];

const ShopPage = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || '';
  const filterParam = searchParams.get('filter') || '';

  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [sortBy, setSortBy] = useState('popular');
  const [filters, setFilters] = useState({
    category: categoryParam,
    priceRange: [0, 200],
    sizes: [],
    colors: [],
  });

  // Apply filter from URL params
  const getInitialProducts = () => {
    if (filterParam === 'sale') return products.filter((p) => p.isOnSale);
    if (filterParam === 'new-arrivals') return products.filter((p) => p.isNewArrival);
    if (filterParam === 'trending') return products.filter((p) => p.isTrending);
    if (filterParam === 'best-sellers') return products.filter((p) => p.isBestSeller);
    return products;
  };

  // Filter + Sort logic
  const filteredProducts = useMemo(() => {
    let result = getInitialProducts();

    // Category filter
    if (filters.category) {
      result = result.filter((p) => p.category === filters.category);
    }

    // Price filter
    result = result.filter((p) => {
      const price = p.salePrice || p.price;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Size filter
    if (filters.sizes.length > 0) {
      result = result.filter((p) =>
        p.sizes.some((s) => filters.sizes.includes(s.name) && s.stock > 0)
      );
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((p) =>
        p.colors.some((c) => filters.colors.includes(c.name))
      );
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        result.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'rating':
        result.sort((a, b) => b.ratingsAverage - a.ratingsAverage);
        break;
      default:
        result.sort((a, b) => b.sold - a.sold);
    }

    return result;
  }, [filters, sortBy, filterParam]);

  const toggleSize = (size) => {
    setFilters((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const toggleColor = (color) => {
    setFilters((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const clearFilters = () => {
    setFilters({ category: '', priceRange: [0, 200], sizes: [], colors: [] });
  };

  const hasActiveFilters = filters.category || filters.sizes.length > 0 || filters.colors.length > 0 || filters.priceRange[1] < 200;

  // Sidebar Filters Component
  const FilterPanel = ({ className = '' }) => (
    <div className={cn('space-y-6', className)}>
      {/* Categories */}
      <div>
        <h3 className="font-body text-sm font-semibold text-dark mb-3 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-2">
          <button
            onClick={() => setFilters((p) => ({ ...p, category: '' }))}
            className={cn(
              'block text-sm transition-colors w-full text-left py-1',
              !filters.category ? 'text-primary font-medium' : 'text-text-secondary hover:text-dark'
            )}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilters((p) => ({ ...p, category: cat.slug }))}
              className={cn(
                'flex items-center justify-between text-sm transition-colors w-full text-left py-1',
                filters.category === cat.slug ? 'text-primary font-medium' : 'text-text-secondary hover:text-dark'
              )}
            >
              <span>{cat.name}</span>
              <span className="text-text-muted text-xs">({cat.productCount})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-body text-sm font-semibold text-dark mb-3 uppercase tracking-wider">
          Price Range
        </h3>
        <input
          type="range"
          min="0"
          max="200"
          value={filters.priceRange[1]}
          onChange={(e) => setFilters((p) => ({ ...p, priceRange: [0, Number(e.target.value)] }))}
          className="w-full accent-primary"
        />
        <div className="flex justify-between text-xs text-text-muted mt-1">
          <span>{formatPrice(0)}</span>
          <span>{formatPrice(filters.priceRange[1])}</span>
        </div>
      </div>

      {/* Sizes */}
      <div>
        <h3 className="font-body text-sm font-semibold text-dark mb-3 uppercase tracking-wider">
          Size
        </h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={cn(
                'w-10 h-10 rounded-md border text-xs font-medium transition-all duration-200',
                filters.sizes.includes(size)
                  ? 'bg-primary text-white border-primary'
                  : 'border-border text-text-secondary hover:border-primary hover:text-primary'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <h3 className="font-body text-sm font-semibold text-dark mb-3 uppercase tracking-wider">
          Color
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {COLORS.map((color) => (
            <button
              key={color.name}
              onClick={() => toggleColor(color.name)}
              className={cn(
                'w-7 h-7 rounded-full border-2 transition-all duration-200',
                filters.colors.includes(color.name)
                  ? 'border-primary ring-2 ring-primary/30 scale-110'
                  : 'border-border hover:scale-110'
              )}
              style={{ backgroundColor: color.hex }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="text-sm text-secondary font-medium hover:underline"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container">
        {/* Page Header */}
        <div className="mb-5">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-heading text-2xl sm:text-3xl lg:text-4xl text-dark mb-1"
          >
            {filterParam === 'sale' ? 'Sale' :
             filterParam === 'new-arrivals' ? 'New Arrivals' :
             filterParam === 'trending' ? 'Trending' :
             filters.category ? categories.find(c => c.slug === filters.category)?.name || 'Shop' :
             'Shop All'}
          </motion.h1>
          <p className="text-text-secondary text-xs sm:text-sm lg:hidden">
            {filteredProducts.length} results
          </p>
        </div>

        {/* Top Bar — Sort + Mobile Filter Toggle */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-4 border-b border-border">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="lg:hidden flex items-center gap-2 text-sm font-medium text-dark border border-border px-3 sm:px-4 py-2 rounded-md hover:border-primary transition-colors"
          >
            <SlidersHorizontal size={16} />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-primary text-white text-[10px] rounded-full flex items-center justify-center">
                !
              </span>
            )}
          </button>

          {/* Results count - hidden on mobile */}
          <p className="hidden lg:block text-text-secondary text-sm">
            Showing {filteredProducts.length} results
          </p>

          {/* Sort Dropdown */}
          <div className="relative ml-auto">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-surface border border-border rounded-md px-3 sm:px-4 py-2 pr-8 sm:pr-10 text-xs sm:text-sm font-body text-dark focus:outline-none focus:border-primary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
          </div>
        </div>

        {/* Main Content — Sidebar + Grid */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 xl:w-60 flex-shrink-0">
            <div className="sticky top-32">
              <FilterPanel />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={JSON.stringify(filters) + sortBy}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {filteredProducts.length > 0 ? (
                  <ProductGrid
                    products={filteredProducts}
                    columns={{ sm: 2, md: 3, lg: 3 }}
                  />
                ) : (
                  <div className="text-center py-20">
                    <div className="w-16 h-16 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <SlidersHorizontal size={24} className="text-primary/40" />
                    </div>
                    <h3 className="font-heading text-lg text-dark mb-2">No products found</h3>
                    <p className="text-text-muted text-sm mb-4">Try adjusting your filters.</p>
                    <button onClick={clearFilters} className="btn-outline text-sm">
                      Clear Filters
                    </button>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-[100] lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-dark/50 backdrop-blur-[2px]"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl max-h-[80vh] overflow-y-auto"
            >
              {/* Handle Bar */}
              <div className="flex items-center justify-center py-3">
                <div className="w-10 h-1 bg-border rounded-full" />
              </div>
              {/* Header */}
              <div className="flex items-center justify-between px-5 pb-4 border-b border-border">
                <h3 className="font-heading text-lg font-semibold">Filters</h3>
                <button onClick={() => setShowMobileFilters(false)}>
                  <X size={20} className="text-dark/60" />
                </button>
              </div>
              {/* Filter Content */}
              <div className="px-5 py-6">
                <FilterPanel />
              </div>
              {/* Apply Button */}
              <div className="px-5 pb-6">
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="btn-primary w-full justify-center"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShopPage;
