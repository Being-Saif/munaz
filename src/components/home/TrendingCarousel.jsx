import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import useApi from '@hooks/useApi';
import productsData from '@data/products.json';

import 'swiper/css';
import 'swiper/css/navigation';

const TrendingCarousel = () => {
  const { data: products } = useApi('/products?isTrending=true&limit=10', productsData.filter(p => p.isTrending || p.isBestSeller).slice(0, 10));

  const trendingProducts = products.length > 0 ? products : productsData.filter(p => p.isTrending || p.isBestSeller).slice(0, 10);

  if (trendingProducts.length === 0) return null;

  return (
    <section className="py-10 sm:py-14 lg:py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8 lg:mb-10"
        >
          <div>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl text-dark font-bold">
              Trending Now
            </h2>
            <p className="text-text-secondary text-sm mt-1">Most loved by our customers</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="trending-prev w-9 h-9 rounded-full border border-dark/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300" aria-label="Previous">
              <ChevronLeft size={18} />
            </button>
            <button className="trending-next w-9 h-9 rounded-full border border-dark/20 flex items-center justify-center hover:bg-primary hover:border-primary hover:text-white transition-all duration-300" aria-label="Next">
              <ChevronRight size={18} />
            </button>
          </div>
        </motion.div>

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={16}
          slidesPerView={2}
          navigation={{ prevEl: '.trending-prev', nextEl: '.trending-next' }}
          autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
          breakpoints={{
            480: { slidesPerView: 2.3, spaceBetween: 16 },
            640: { slidesPerView: 3, spaceBetween: 18 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
            1280: { slidesPerView: 5, spaceBetween: 20 },
          }}
          className="!overflow-visible"
        >
          {trendingProducts.map((product) => (
            <SwiperSlide key={product._id || product.id}>
              <Link to={`/product/${product.slug}`} className="group block">
                <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-3">
                  <img loading="lazy" src={product.thumbnail} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  {product.isOnSale && (
                    <span className="absolute top-2 left-2 bg-secondary text-white text-[10px] font-button font-semibold px-2 py-0.5 rounded">
                      {product.discountPercent}% OFF
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="font-body text-sm text-dark font-medium line-clamp-1 group-hover:text-primary transition-colors duration-200">{product.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-button text-sm font-semibold text-dark">₹{product.salePrice || product.price}</span>
                    {product.salePrice && <span className="text-text-muted text-xs line-through">₹{product.price}</span>}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center mt-8">
          <Link to="/shop?filter=trending" className="inline-flex items-center gap-2 border border-primary text-primary font-button text-sm font-medium px-6 py-2.5 rounded-md hover:bg-primary hover:text-white transition-all duration-300">
            View All Trending <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TrendingCarousel;
