import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import products from '@data/products.json';

const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 8);
// Fallback to featured if no new arrivals
const displayProducts = newArrivals.length >= 4 ? newArrivals : products.filter((p) => p.isFeatured).slice(0, 8);

const NewArrivals = () => {
  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 lg:mb-10"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-dark font-bold">
              New Arrivals
            </h2>
            <p className="text-text-secondary text-sm mt-1">Fresh styles just dropped</p>
          </div>
          <Link
            to="/shop?filter=new-arrivals"
            className="hidden sm:flex items-center gap-1.5 text-primary font-button text-sm font-medium hover:gap-2.5 transition-all duration-300"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Product Grid - clean image-focused like biba.in */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ delay: index * 0.06, duration: 0.5 }}
            >
              <Link
                to={`/product/${product.slug}`}
                className="group block"
              >
                {/* Image Container */}
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                  <img
                    src={product.thumbnail}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Sale Badge */}
                  {product.isOnSale && (
                    <span className="absolute top-2 left-2 bg-secondary text-white text-[10px] sm:text-xs font-button font-semibold px-2 py-0.5 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  )}

                  {/* Quick hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                </div>

                {/* Product Info */}
                <div className="px-0.5">
                  <h3 className="font-body text-sm sm:text-base text-dark font-medium line-clamp-1 group-hover:text-primary transition-colors duration-200">
                    {product.name}
                  </h3>
                  <p className="text-text-muted text-xs mt-0.5 line-clamp-1">{product.subcategory}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="font-button text-sm sm:text-base font-semibold text-dark">
                      ₹{product.salePrice || product.price}
                    </span>
                    {product.salePrice && (
                      <span className="text-text-muted text-xs line-through">
                        ₹{product.price}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Mobile View All Link */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/shop?filter=new-arrivals"
            className="inline-flex items-center gap-2 text-primary font-button text-sm font-medium"
          >
            View All New Arrivals
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default NewArrivals;
