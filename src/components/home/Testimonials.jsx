import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { getInitials } from '@utils/helpers';
import reviews from '@data/reviews.json';

import 'swiper/css';

// Pick top reviews for testimonials
const testimonials = reviews.filter((r) => r.rating >= 4).slice(0, 8);

const TestimonialCard = ({ review }) => {
  return (
    <div className="bg-surface rounded-xl border border-border p-5 sm:p-6 shadow-card hover:shadow-lg transition-shadow duration-400 ease-velora h-full flex flex-col">
      {/* Quote Icon */}
      <div className="mb-3">
        <Quote size={24} className="text-primary/20" />
      </div>

      {/* Review Text */}
      <p className="text-text-secondary text-sm leading-relaxed flex-1 mb-4 line-clamp-3">
        "{review.comment}"
      </p>

      {/* Rating Stars */}
      <div className="flex items-center gap-0.5 mb-3">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < review.rating
                ? 'text-warning fill-warning'
                : 'text-border'
            }
          />
        ))}
      </div>

      {/* Author */}
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-cta flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">
            {getInitials(review.user.name)}
          </span>
        </div>
        <div>
          <h4 className="font-body text-sm font-semibold text-dark">
            {review.user.name}
          </h4>
          {review.isVerifiedPurchase && (
            <p className="text-primary text-[10px] font-medium">Verified Buyer ✓</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  return (
    <section className="section-padding overflow-hidden">
      <div className="section-container mb-8 lg:mb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-lg mx-auto"
        >
          <h2 className="section-heading mb-3">
            What Our Customers Say
          </h2>
          <p className="text-text-secondary text-sm sm:text-base">
            Real reviews from real people who love shopping with Munaz.
          </p>
        </motion.div>
      </div>

      {/* Auto-sliding carousel — shows 3 cards at a time */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Swiper
          modules={[Autoplay]}
          spaceBetween={20}
          slidesPerView={1.2}
          centeredSlides={false}
          loop={true}
          speed={600}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            480: { slidesPerView: 1.5, spaceBetween: 16 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 2.5, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 24 },
            1280: { slidesPerView: 3.2, spaceBetween: 24 },
          }}
          className="px-4 sm:px-6 lg:px-8 !overflow-visible"
        >
          {testimonials.map((review) => (
            <SwiperSlide key={review.id} className="h-auto">
              <TestimonialCard review={review} />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>
    </section>
  );
};

export default Testimonials;
