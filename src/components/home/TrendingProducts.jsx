import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductGrid from '@components/product/ProductGrid';
import products from '@data/products.json';
import { cn } from '@utils/cn';

const tabs = [
  { id: 'trending', label: 'Trending', filter: (p) => p.isTrending },
  { id: 'new-arrivals', label: 'New Arrivals', filter: (p) => p.isNewArrival },
  { id: 'best-sellers', label: 'Best Sellers', filter: (p) => p.isBestSeller },
];

const TrendingProducts = () => {
  const [activeTab, setActiveTab] = useState('trending');

  const currentTab = tabs.find((t) => t.id === activeTab);
  const filteredProducts = products.filter(currentTab.filter).slice(0, 6);

  return (
    <section className="section-container section-padding max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 lg:mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          Our Collection
        </motion.h2>

        <Link
          to="/shop"
          className="flex items-center gap-1.5 text-primary font-button text-sm font-medium hover:gap-2.5 transition-all duration-300"
        >
          View All
          <ArrowRight size={16} />
        </Link>
      </div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center gap-1 bg-background rounded-lg p-1 mb-8 w-fit"
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative px-4 sm:px-6 py-2.5 rounded-md font-button text-xs sm:text-sm font-medium transition-colors duration-300',
              activeTab === tab.id
                ? 'text-white'
                : 'text-text-secondary hover:text-dark'
            )}
          >
            {/* Active tab background */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 bg-primary rounded-md"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </motion.div>

      {/* Product Grid with animation on tab change */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {filteredProducts.length > 0 ? (
            <ProductGrid
              products={filteredProducts}
              columns={{ sm: 2, md: 3, lg: 3 }}
            />
          ) : (
            <div className="text-center py-16">
              <p className="text-text-muted">No products found in this category.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Load More Button */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="text-center mt-10"
      >
        <Link
          to={`/shop?filter=${activeTab}`}
          className="btn-outline inline-flex items-center gap-2 text-sm"
        >
          Load More
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
};

export default TrendingProducts;
