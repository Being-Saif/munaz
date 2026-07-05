import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import categories from '@data/categories.json';
import products from '@data/products.json';

const CategoriesPage = () => {
  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 lg:mb-14"
        >
          <h1 className="font-heading text-3xl lg:text-5xl text-dark mb-3">
            Shop By Category
          </h1>
          <p className="text-text-secondary text-sm sm:text-base max-w-lg mx-auto">
            Explore our curated collections — find your perfect style across every category.
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {categories.map((category, index) => {
            // Get sample products for this category
            const categoryProducts = products.filter((p) => p.category === category.slug).slice(0, 3);

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <Link
                  to={`/shop?category=${category.slug}`}
                  className="group block bg-surface rounded-xl border border-border overflow-hidden shadow-card hover:shadow-xl transition-all duration-400 ease-velora hover:-translate-y-1"
                >
                  {/* Category Image */}
                  <div className="relative h-56 sm:h-64 overflow-hidden">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-velora"
                    />
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-dark/20 to-transparent" />

                    {/* Category Name on Image */}
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h2 className="font-heading text-xl lg:text-2xl text-white mb-1">
                        {category.name}
                      </h2>
                      <p className="text-white/70 text-sm">
                        {category.productCount} Products
                      </p>
                    </div>
                  </div>

                  {/* Bottom Section */}
                  <div className="p-4">
                    <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Sample Product Thumbnails */}
                    {categoryProducts.length > 0 && (
                      <div className="flex items-center gap-2 mb-3">
                        {categoryProducts.map((product) => (
                          <div key={product.id} className="w-10 h-10 rounded-md overflow-hidden border border-border">
                            <img src={product.thumbnail} alt="" className="w-full h-full object-cover" />
                          </div>
                        ))}
                        {category.productCount > 3 && (
                          <span className="text-text-muted text-xs">+{category.productCount - 3} more</span>
                        )}
                      </div>
                    )}

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-primary font-button text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                      Shop {category.name}
                      <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
