import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useApi from '@hooks/useApi';
import occasionsData from '@data/occasions.json';

const ShopByOccasion = () => {
  const { data: occasions } = useApi('/occasions', occasionsData);

  const displayOccasions = occasions.length > 0 ? occasions : occasionsData;

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
            Shop By Occasion
          </h2>
          <p className="text-text-secondary text-sm sm:text-base mt-2">
            Find the perfect outfit for every moment
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {displayOccasions.map((occasion, index) => (
            <motion.div
              key={occasion._id || occasion.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <Link to={occasion.link} className="group block relative overflow-hidden rounded-xl aspect-[3/4]">
                <img src={occasion.image} alt={occasion.name} className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent group-hover:from-primary/80 transition-all duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 lg:p-6 text-white">
                  <h3 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold mb-0.5">{occasion.name}</h3>
                  <p className="text-white/70 text-xs sm:text-sm font-body">{occasion.tagline}</p>
                  <span className="inline-block mt-2 sm:mt-3 text-xs font-button font-medium tracking-wide uppercase border-b border-white/50 pb-0.5 group-hover:border-white transition-colors duration-300">
                    Shop Now
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ShopByOccasion;
