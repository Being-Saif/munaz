import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useApi from '@hooks/useApi';
import bannersData from '@data/banners.json';

const PromoBanner = () => {
  const { data: banners } = useApi('/banners?position=promotional', bannersData.filter(b => b.position === 'promotional'));

  const promoBanners = banners.length > 0 ? banners : bannersData.filter(b => b.position === 'promotional');

  if (promoBanners.length === 0) return null;

  if (promoBanners.length === 1) {
    const banner = promoBanners[0];
    return (
      <section className="py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <Link to={banner.link} className="group block relative overflow-hidden rounded-xl">
              <img loading="lazy" src={banner.image} alt={banner.subtitle} className="w-full h-[200px] sm:h-[280px] lg:h-[350px] object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-0 bg-gradient-to-r from-primary/80 via-primary/40 to-transparent flex items-center">
                <div className="px-8 sm:px-12 lg:px-16">
                  <p className="text-white/80 font-button text-xs sm:text-sm uppercase tracking-wider mb-1">{banner.title}</p>
                  <h3 className="font-heading text-xl sm:text-3xl lg:text-4xl text-white font-bold mb-2">{banner.subtitle}</h3>
                  <p className="text-white/70 text-sm mb-4 max-w-sm hidden sm:block">{banner.description}</p>
                  <span className="inline-flex items-center gap-2 bg-white text-dark font-button text-sm font-medium px-5 py-2.5 rounded-md group-hover:bg-secondary group-hover:text-white transition-all duration-300">
                    {banner.buttonText} <ArrowRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {promoBanners.slice(0, 2).map((banner, index) => (
            <motion.div key={banner._id || banner.id} initial={{ opacity: 0, x: index === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: index * 0.1 }}>
              <Link to={banner.link} className="group block relative overflow-hidden rounded-xl">
                <img loading="lazy" src={banner.image} alt={banner.subtitle} className="w-full h-[180px] sm:h-[220px] lg:h-[280px] object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end">
                  <div className="p-5 sm:p-6">
                    <p className="text-white/70 font-button text-[10px] sm:text-xs uppercase tracking-wider mb-1">{banner.title}</p>
                    <h3 className="font-heading text-lg sm:text-xl lg:text-2xl text-white font-bold mb-2">{banner.subtitle}</h3>
                    <span className="inline-flex items-center gap-1.5 text-white font-button text-xs sm:text-sm font-medium group-hover:gap-2.5 transition-all duration-300">
                      {banner.buttonText} <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromoBanner;
