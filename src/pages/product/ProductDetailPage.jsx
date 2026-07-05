import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs, Navigation } from 'swiper/modules';
import { cn } from '@utils/cn';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { addToCart } from '@redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@redux/slices/wishlistSlice';
import { openCart } from '@redux/slices/uiSlice';
import ProductGrid from '@components/product/ProductGrid';
import products from '@data/products.json';
import reviews from '@data/reviews.json';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/thumbs';
import 'swiper/css/navigation';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const product = products.find((p) => p.slug === slug);
  const isWishlisted = useSelector(selectIsWishlisted(product?.id || ''));

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');

  const productReviews = reviews.filter((r) => r.productId === product?.id);
  const discount = product ? calculateDiscount(product.price, product.salePrice) : 0;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter((p) => p.category === product.category && p.id !== product.id)
      .slice(0, 4);
  }, [product]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center section-container">
        <h1 className="font-heading text-2xl text-dark mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary text-sm">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({
      productId: product.id,
      name: product.name,
      image: product.thumbnail,
      price: product.salePrice || product.price,
      color: selectedColor,
      size: selectedSize,
      quantity,
    }));
    dispatch(openCart());
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    dispatch(toggleWishlist(product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  return (
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${product.category}`} className="hover:text-primary transition-colors capitalize">
            {product.category}
          </Link>
          <ChevronRight size={14} />
          <span className="text-dark font-medium truncate">{product.name}</span>
        </nav>

        {/* Product Section — 2 Column */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left — Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Main Image */}
            <Swiper
              modules={[Thumbs, Navigation]}
              thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
              navigation={true}
              className="rounded-lg overflow-hidden aspect-product bg-background mb-3"
            >
              {product.images.map((img) => (
                <SwiperSlide key={img.id}>
                  <div className="w-full h-full group cursor-zoom-in overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                slidesPerView={4}
                spaceBetween={8}
                className="thumbs-swiper"
              >
                {product.images.map((img) => (
                  <SwiperSlide key={img.id} className="cursor-pointer">
                    <div className="aspect-square rounded-md overflow-hidden border-2 border-transparent hover:border-primary/50 transition-colors">
                      <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            )}
          </motion.div>

          {/* Right — Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-col"
          >
            {/* Title */}
            <h1 className="font-heading text-2xl lg:text-3xl text-dark mb-2">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className={i < Math.floor(product.ratingsAverage) ? 'text-warning fill-warning' : 'text-border'}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                ({product.ratingsAverage}) · {product.ratingsCount} Reviews
              </span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-button text-2xl lg:text-3xl font-bold text-dark">
                {formatPrice(product.salePrice || product.price)}
              </span>
              {product.isOnSale && product.salePrice && (
                <>
                  <span className="text-text-muted text-lg line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="badge-sale text-xs">-{discount}% OFF</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            {/* Color Selector */}
            <div className="mb-5">
              <p className="text-sm font-medium text-dark mb-2.5">
                Color: <span className="text-text-secondary font-normal">{selectedColor}</span>
              </p>
              <div className="flex items-center gap-2.5">
                {product.colors.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => setSelectedColor(color.name)}
                    className={cn(
                      'w-8 h-8 rounded-full border-2 transition-all duration-200',
                      selectedColor === color.name
                        ? 'border-primary ring-2 ring-primary/30 scale-110'
                        : 'border-border hover:scale-110'
                    )}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div className="mb-5">
              <p className="text-sm font-medium text-dark mb-2.5">Size:</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => size.stock > 0 && setSelectedSize(size.name)}
                    disabled={size.stock === 0}
                    className={cn(
                      'min-w-[44px] h-11 px-3 rounded-md border text-sm font-medium transition-all duration-200',
                      selectedSize === size.name
                        ? 'bg-primary text-white border-primary'
                        : size.stock > 0
                          ? 'border-border text-dark hover:border-primary hover:text-primary'
                          : 'border-border text-text-muted line-through opacity-40 cursor-not-allowed'
                    )}
                  >
                    {size.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-sm font-medium text-dark mb-2.5">Quantity:</p>
              <div className="inline-flex items-center border border-border rounded-md">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="w-12 h-10 flex items-center justify-center font-medium text-sm border-x border-border">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-primary/5 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleAddToCart} className="btn-primary flex-1 justify-center gap-2 py-3.5">
                <ShoppingBag size={18} />
                Add to Cart
              </button>
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-12 h-12 rounded-md border flex items-center justify-center transition-all',
                  isWishlisted
                    ? 'bg-secondary/10 border-secondary text-secondary'
                    : 'border-border text-dark/60 hover:border-secondary hover:text-secondary'
                )}
              >
                <Heart size={20} className={isWishlisted ? 'fill-current' : ''} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-3 py-4 border-t border-border">
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'On orders over ₹500' },
                { icon: RotateCcw, label: 'Easy Returns', sub: '30 days return policy' },
                { icon: ShieldCheck, label: 'Secure Checkout', sub: '100% secure payment' },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center">
                  <Icon size={18} className="text-primary mx-auto mb-1" />
                  <p className="text-[11px] font-medium text-dark">{label}</p>
                  <p className="text-[10px] text-text-muted">{sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tabs — Description / Reviews */}
        <div className="mt-12 lg:mt-16">
          <div className="flex border-b border-border mb-6">
            {['description', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'px-6 py-3 text-sm font-medium capitalize transition-colors relative',
                  activeTab === tab ? 'text-primary' : 'text-text-secondary hover:text-dark'
                )}
              >
                {tab} {tab === 'reviews' && `(${productReviews.length})`}
                {activeTab === tab && (
                  <motion.div
                    layoutId="productTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  />
                )}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl">
              <p className="text-text-secondary text-sm leading-relaxed">
                {product.description}
              </p>
            </motion.div>
          )}

          {activeTab === 'reviews' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 max-w-3xl">
              {productReviews.length > 0 ? productReviews.map((review) => (
                <div key={review.id} className="p-4 bg-background rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={12} className={i < review.rating ? 'text-warning fill-warning' : 'text-border'} />
                      ))}
                    </div>
                    <span className="text-xs text-text-muted">by {review.user.name}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-dark mb-1">{review.title}</h4>
                  <p className="text-text-secondary text-sm">{review.comment}</p>
                </div>
              )) : (
                <p className="text-text-muted text-sm">No reviews yet for this product.</p>
              )}
            </motion.div>
          )}
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="section-heading mb-8">You May Also Like</h2>
            <ProductGrid products={relatedProducts} columns={{ sm: 2, md: 2, lg: 4 }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
