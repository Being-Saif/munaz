import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Minus, Plus, Star, Truck, RotateCcw, ShieldCheck, ChevronRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { cn } from '@utils/cn';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { getColorHex } from '@utils/colorMap';
import { addToCart } from '@redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@redux/slices/wishlistSlice';
import { selectIsAuthenticated } from '@redux/slices/authSlice';
import { openCart } from '@redux/slices/uiSlice';
import ProductGrid from '@components/product/ProductGrid';
import AuthPromptModal from '@components/common/AuthPromptModal';
import useApi from '@hooks/useApi';
import toast from 'react-hot-toast';

import 'swiper/css';
import 'swiper/css/navigation';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  // Fetch product from live API by slug — no static fallback
  const { data: rawProduct, loading } = useApi(`/products/${slug}`, null);
  const { data: products } = useApi('/products?limit=100', []);

  // Normalize product — ensure images/colors/sizes always exist
  const product = rawProduct ? {
    ...rawProduct,
    images: (rawProduct.images && rawProduct.images.length > 0)
      ? rawProduct.images
      : [{ id: 'thumb', url: rawProduct.thumbnail, alt: rawProduct.name }],
    colors: rawProduct.colors || [],
    sizes: rawProduct.sizes || [],
  } : null;

  // Real reviews from the database for this product
  const { data: productReviews } = useApi(product ? `/reviews/${product._id || product.id}` : null, []);

  const isWishlisted = useSelector(selectIsWishlisted(product?._id || product?.id || ''));
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [mainSwiper, setMainSwiper] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [authPrompt, setAuthPrompt] = useState({ open: false, type: 'default' });

  // If the selected color has its own variant photos, show those instead of
  // the product's shared photos. Falls back to the shared set otherwise.
  const displayImages = useMemo(() => {
    if (!product) return [];
    const variantWithImages = product.variants?.find(
      (v) => v.color === selectedColor && v.images?.length > 0
    );
    return variantWithImages ? variantWithImages.images : product.images;
  }, [product, selectedColor]);

  const discount = product ? calculateDiscount(product.price, product.salePrice) : 0;

  const relatedProducts = useMemo(() => {
    if (!product) return [];
    const catId = typeof product.category === 'object' ? product.category?._id : product.category;
    return products
      .filter((p) => {
        const pCat = typeof p.category === 'object' ? p.category?._id : p.category;
        return pCat === catId && (p._id || p.id) !== (product._id || product.id);
      })
      .slice(0, 4);
  }, [product, products]);

  // Loading state
  if (loading && !product) {
    return (
      <div className="pt-8 pb-20 text-center section-container">
        <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-20" />
        <p className="text-text-secondary text-sm mt-4">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-8 pb-20 text-center section-container">
        <h1 className="font-heading text-2xl text-dark mb-4">Product Not Found</h1>
        <Link to="/shop" className="btn-primary text-sm">Back to Shop</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      setAuthPrompt({ open: true, type: 'cart' });
      return;
    }
    if (product.sizes.length > 0 && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    dispatch(addToCart({
      productId: product._id || product.id,
      name: product.name,
      image: product.thumbnail,
      price: product.salePrice || product.price,
      color: selectedColor || 'Default',
      size: selectedSize || 'Free Size',
      quantity,
    }));
    dispatch(openCart());
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      setAuthPrompt({ open: true, type: 'wishlist' });
      return;
    }
    dispatch(toggleWishlist(product._id || product.id));
    toast.success(isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️');
  };

  return (
    <div className="pt-6 lg:pt-8 pb-16">
      <div className="section-container">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-text-muted mb-6">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={14} />
          <Link to={`/shop?category=${typeof product.category === 'object' ? product.category?.slug : product.category}`} className="hover:text-primary transition-colors capitalize">
            {typeof product.category === 'object' ? product.category?.name : product.category}
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
            {/* Main Image — Swipeable */}
            <Swiper
              modules={[Navigation]}
              navigation={true}
              onSwiper={setMainSwiper}
              onSlideChange={(swiper) => setActiveImage(swiper.activeIndex)}
              className="rounded-lg overflow-hidden aspect-product bg-background mb-3"
              key={selectedColor}
            >
              {displayImages.map((img, i) => (
                <SwiperSlide key={img.id || img.url || i}>
                  <div className="w-full h-full group cursor-zoom-in overflow-hidden">
                    <img
                      src={img.url}
                      alt={img.alt || product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-150"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails — Click to select */}
            {displayImages.length > 1 && (
              <div className="flex gap-2">
                {displayImages.map((img, index) => (
                  <button
                    key={img.id || img.url || index}
                    onClick={() => {
                      setActiveImage(index);
                      if (mainSwiper) mainSwiper.slideTo(index);
                    }}
                    className={cn(
                      'w-16 h-20 sm:w-20 sm:h-24 rounded-md overflow-hidden border-2 transition-all duration-200',
                      activeImage === index
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50 opacity-70 hover:opacity-100'
                    )}
                  >
                    <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
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
            {product.colors.length > 0 && (
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
                    style={{ backgroundColor: color.hex || getColorHex(color.name) }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
            )}

            {/* Size Selector */}
            {product.sizes.length > 0 && (
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
            )}

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
                <div key={review._id || review.id} className="p-4 bg-background rounded-lg">
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

      {/* Auth Prompt */}
      <AuthPromptModal
        isOpen={authPrompt.open}
        onClose={() => setAuthPrompt({ open: false, type: 'default' })}
        type={authPrompt.type}
      />
    </div>
  );
};

export default ProductDetailPage;
