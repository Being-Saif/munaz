import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useApi from '@hooks/useApi';
import categoriesData from '@data/categories.json';

const CategoryStrip = () => {
  const { data: categories } = useApi('/categories', categoriesData);

  const displayCategories = categories.length > 0 ? categories : categoriesData;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 lg:mb-10"
        >
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-dark font-bold">
            Shop By Category
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Explore our curated collections
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {displayCategories.map((category, index) => (
            <motion.div
              key={category._id || category.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
            >
              <Link
                to={`/shop?category=${category.slug}`}
                className="group block relative overflow-hidden rounded-lg aspect-[3/4]"
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                  <h3 className="font-button text-white text-sm sm:text-base font-semibold leading-tight">
                    {category.name}
                  </h3>
                  <p className="text-white/70 text-xs mt-0.5">
                    {category.productCount} Products
                  </p>
                </div>
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/15 transition-colors duration-300" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryStrip;
