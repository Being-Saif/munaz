import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import banners from '@data/banners.json';

import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';

const heroSlides = banners.filter((b) => b.position === 'hero');

const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.15,
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
};

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative w-full h-[60vh] sm:h-[70vh] lg:h-[85vh] bg-gradient-hero overflow-hidden">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        effect="fade"
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop={true}
        speed={800}
        navigation={{
          prevEl: '.hero-prev',
          nextEl: '.hero-next',
        }}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="w-full h-full"
      >
        {heroSlides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-full flex items-center">
              {/* Background Image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/60 to-transparent lg:from-background/80 lg:via-background/40" />
              </div>

              {/* Text Content */}
              <div className="relative z-10 section-container w-full">
                <div className="max-w-lg lg:max-w-xl">
                  <AnimatePresence mode="wait">
                    {activeIndex === index && (
                      <motion.div key={slide.id}>
                        {/* Subtitle */}
                        <motion.p
                          custom={0}
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-primary font-button text-xs sm:text-sm uppercase tracking-[0.2em] mb-3"
                        >
                          {slide.title}
                        </motion.p>

                        {/* Main Heading */}
                        <motion.h1
                          custom={1}
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-dark leading-tight mb-2"
                        >
                          {slide.subtitle.split(' ').slice(0, -1).join(' ')}{' '}
                          <span className="italic text-gradient block sm:inline">
                            {slide.subtitle.split(' ').slice(-1)}
                          </span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p
                          custom={2}
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          className="text-text-secondary text-sm sm:text-base lg:text-lg mb-6 lg:mb-8 max-w-md"
                        >
                          {slide.description}
                        </motion.p>

                        {/* CTA Button */}
                        <motion.div
                          custom={3}
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          <Link
                            to={slide.link}
                            className="btn-primary inline-flex items-center gap-2 text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-lg"
                          >
                            {slide.buttonText}
                            <ChevronRight size={16} />
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6">
        <button
          className="hero-prev w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
          aria-label="Previous slide"
        >
          <ChevronLeft size={18} />
        </button>

        {/* Pagination: 01 —— 03 */}
        <div className="flex items-center gap-3 font-button text-sm text-dark/60">
          <span className="font-semibold text-dark">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <div className="relative w-12 h-0.5 bg-dark/20 rounded-full overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 h-full bg-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              key={activeIndex}
            />
          </div>
          <span>{String(heroSlides.length).padStart(2, '0')}</span>
        </div>

        <button
          className="hero-next w-10 h-10 rounded-full border border-dark/20 flex items-center justify-center hover:bg-dark hover:text-white hover:border-dark transition-all duration-300"
          aria-label="Next slide"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  );
};

export default HeroSlider;
