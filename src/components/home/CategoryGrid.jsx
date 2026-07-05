import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import categories from '@data/categories.json';

const CategoryGrid = () => {
  return (
    <section className="section-container section-padding">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-8 lg:mb-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="section-heading"
        >
          Shop By Category
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link
            to="/shop"
            className="flex items-center gap-1.5 text-primary font-button text-sm font-medium hover:gap-2.5 transition-all duration-300"
          >
            View All
            <ArrowRight size={16} />
          </Link>
        </motion.div>
      </div>

      {/* Category Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
        {categories.map((category, index) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-30px' }}
            transition={{
              delay: index * 0.08,
              duration: 0.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <Link
              to={`/shop?category=${category.slug}`}
              className="group block text-center"
            >
              {/* Image Container */}
              <div className="relative mx-auto w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 rounded-full overflow-hidden mb-3 border-2 border-transparent group-hover:border-primary/30 transition-all duration-400 ease-velora group-hover:shadow-lg group-hover:scale-105">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 ease-velora group-hover:scale-110"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 rounded-full" />
              </div>

              {/* Text */}
              <h3 className="font-body text-sm font-semibold text-dark group-hover:text-primary transition-colors duration-300">
                {category.name}
              </h3>
              <p className="text-text-muted text-xs mt-0.5">
                {category.productCount} Items
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
