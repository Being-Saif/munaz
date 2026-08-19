import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import useApi from '@hooks/useApi';
import bannersData from '@data/banners.json';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const HeroBanner = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: banners } = useApi('/banners?position=hero', bannersData.filter(b => b.position === 'hero'));

  const heroSlides = banners.length > 0 ? banners : bannersData.filter(b => b.position === 'hero');

  if (heroSlides.length === 0) return null;

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        autoplay={{
          delay: 4500,
          disableOnInteraction: false,
        }}
        loop={true}
        speed={700}
        pagination={{
          clickable: true,
          el: '.hero-pagination',
          bulletClass: 'hero-bullet',
          bulletActiveClass: 'hero-bullet-active',
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide._id || slide.id}>
            <div className="relative w-full h-[55vh] sm:h-[65vh] lg:h-[80vh]">
              <img
                src={slide.image}
                alt={slide.subtitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              <AnimatePresence mode="wait">
                {activeIndex === index && (
                  <motion.div
                    key={slide._id || slide.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="absolute bottom-12 sm:bottom-16 left-6 sm:left-12 lg:left-16 z-10"
                  >
                    <p className="text-white/80 font-button text-xs sm:text-sm uppercase tracking-widest mb-2">
                      {slide.title}
                    </p>
                    <h2 className="font-heading text-2xl sm:text-4xl lg:text-5xl text-white font-bold mb-3 max-w-lg">
                      {slide.subtitle}
                    </h2>
                    <p className="text-white/70 text-sm sm:text-base mb-5 max-w-md hidden sm:block">
                      {slide.description}
                    </p>
                    <Link
                      to={slide.link}
                      className="inline-flex items-center gap-2 bg-white text-dark font-button text-sm font-medium px-6 py-3 rounded-md hover:bg-primary hover:text-white transition-all duration-300"
                    >
                      {slide.buttonText}
                      <ArrowRight size={16} />
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-pagination absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2" />

      <style>{`
        .hero-bullet {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
        }
        .hero-bullet-active {
          background: #7E57C2;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
};

export default HeroBanner;
