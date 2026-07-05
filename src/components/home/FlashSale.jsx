import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Heart, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import CountdownTimer from './CountdownTimer';
import { cn } from '@utils/cn';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { addToCart } from '@redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@redux/slices/wishlistSlice';
import { openCart } from '@redux/slices/uiSlice';
import products from '@data/products.json';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';

const flashSaleProducts = products.filter((p) => p.flashSale?.isActive);
const flashSaleEndTime = flashSaleProducts[0]?.flashSale?.endTime || '2026-07-10T23:59:59Z';

const FlashSaleCard = ({ product }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const discount = calculateDiscount(product.price, product.salePrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      image: product.thumbnail,
      price: product.salePrice || product.price,
      color: product.colors?.[0]?.name || 'Default',
      size: product.sizes?.[0]?.name || 'Free Size',
      quantity: 1,
    }));
    dispatch(openCart());
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="group bg-dark-surface rounded-lg overflow-hidden border border-white/10 hover:border-primary/30 transition-all duration-400 ease-velora hover:shadow-glow">
      <Link to={`/product/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-product overflow-hidden">
          {discount > 0 && (
            <span className="absolute top-2 left-2 z-10 badge-sale text-[10px] px-2 py-0.5">
              -{discount}%
            </span>
          )}
          <button
            onClick={(e) => {
              e.preventDefault();
              dispatch(toggleWishlist(product.id));
            }}
            className={cn(
              'absolute top-2 right-2 z-10 w-7 h-7 rounded-full flex items-center justify-center transition-all',
              isWishlisted ? 'bg-secondary text-white' : 'bg-white/20 text-white hover:bg-white/40'
            )}
          >
            <Heart size={12} className={isWishlisted ? 'fill-current' : ''} />
          </button>
          <img
            src={product.thumbnail}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-velora"
          />
          {/* Add to Cart overlay */}
          <button
            onClick={handleAddToCart}
            className="absolute bottom-2 left-2 right-2 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium py-2 rounded-md opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-primary-dark"
          >
            <ShoppingBag size={12} />
            Add to Cart
          </button>
        </div>

        {/* Info */}
        <div className="p-3">
          <h4 className="text-white text-sm font-medium line-clamp-2 mb-1">
            {product.name}
          </h4>
          <div className="flex items-center gap-2">
            <span className="font-button text-accent font-bold text-sm">
              {formatPrice(product.salePrice)}
            </span>
            <span className="text-white/40 text-xs line-through">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const FlashSale = () => {
  return (
    <section className="bg-gradient-dark py-12 lg:py-16 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-heading text-section-mobile lg:text-section text-white mb-2"
            >
              Flash Sale
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-white/60 text-sm"
            >
              Limited time offer — grab them before they're gone!
            </motion.p>
          </div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <CountdownTimer endTime={flashSaleEndTime} />
          </motion.div>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <Swiper
            modules={[Autoplay, Navigation]}
            spaceBetween={16}
            slidesPerView={2}
            navigation={{
              prevEl: '.flash-prev',
              nextEl: '.flash-next',
            }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2, spaceBetween: 16 },
              768: { slidesPerView: 3, spaceBetween: 20 },
              1024: { slidesPerView: 4, spaceBetween: 20 },
              1280: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="pb-4"
          >
            {flashSaleProducts.map((product) => (
              <SwiperSlide key={product.id}>
                <FlashSaleCard product={product} />
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Custom Navigation */}
          <button className="flash-prev absolute -left-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hidden lg:flex">
            <ChevronLeft size={16} />
          </button>
          <button className="flash-next absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all hidden lg:flex">
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Shop Now Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <Link
            to="/shop?filter=sale"
            className="inline-flex items-center gap-2 btn bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-3 rounded-lg hover:bg-white/20 hover:border-white/40 transition-all duration-300 animate-pulse-glow"
          >
            Shop All Deals
            <ChevronRight size={16} />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSale;
