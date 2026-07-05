import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@utils/cn';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import { addToCart } from '@redux/slices/cartSlice';
import { toggleWishlist, selectIsWishlisted } from '@redux/slices/wishlistSlice';
import { openQuickView, openCart } from '@redux/slices/uiSlice';
import toast from 'react-hot-toast';

const ProductCard = ({ product, index = 0, isHovered, onHover, onLeave }) => {
  const dispatch = useDispatch();
  const isWishlisted = useSelector(selectIsWishlisted(product.id));
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = calculateDiscount(product.price, product.salePrice);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
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

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleWishlist(product.id));
    toast.success(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist! ❤️'
    );
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(openQuickView(product));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{
        delay: index * 0.08,
        duration: 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={cn(
        'group relative bg-surface rounded-lg border border-border overflow-hidden',
        'transition-all duration-400 ease-velora cursor-pointer',
        // Focus state (this card is hovered)
        isHovered === true && 'scale-[1.03] -translate-y-2 shadow-xl z-10 border-primary/20',
        // Unfocus state (another card in the grid is hovered)
        isHovered === false && 'scale-[0.97] opacity-75',
        // Default state (no hover in grid)
        isHovered === undefined && 'hover:shadow-lg hover:-translate-y-1',
      )}
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-product overflow-hidden bg-background">
          {/* Sale Badge */}
          {product.isOnSale && discount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute top-3 left-3 z-10 badge-sale px-2 py-1 text-[10px] font-bold"
            >
              -{discount}%
            </motion.span>
          )}

          {/* New Badge */}
          {product.isNewArrival && !product.isOnSale && (
            <span className="absolute top-3 left-3 z-10 badge-new px-2 py-1 text-[10px] font-bold">
              NEW
            </span>
          )}

          {/* Wishlist Heart */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center',
              'transition-all duration-300',
              isWishlisted
                ? 'bg-secondary text-white shadow-md'
                : 'bg-white/80 backdrop-blur-sm text-dark/60 hover:bg-white hover:text-secondary'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              size={14}
              className={cn(
                'transition-transform duration-300',
                isWishlisted && 'fill-current scale-110'
              )}
            />
          </button>

          {/* Product Image */}
          <img
            src={product.thumbnail}
            alt={product.name}
            onLoad={() => setImageLoaded(true)}
            className={cn(
              'w-full h-full object-cover transition-transform duration-500 ease-velora',
              'group-hover:scale-[1.08]',
              !imageLoaded && 'opacity-0'
            )}
          />

          {/* Skeleton while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton" />
          )}

          {/* Hover Actions Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-400 ease-velora">
            <div className="flex gap-2">
              {/* Quick View */}
              <button
                onClick={handleQuickView}
                className="flex-1 flex items-center justify-center gap-1.5 bg-white/90 backdrop-blur-sm text-dark text-xs font-medium py-2.5 rounded-md hover:bg-white transition-colors"
              >
                <Eye size={14} />
                Quick View
              </button>
              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium py-2.5 rounded-md hover:bg-primary-dark transition-colors"
              >
                <ShoppingBag size={14} />
                Add to Cart
              </button>
            </div>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-3 sm:p-4">
          {/* Category */}
          <p className="text-text-muted text-[10px] uppercase tracking-wider font-medium mb-1">
            {product.subcategory || product.category}
          </p>

          {/* Title */}
          <h3 className="font-body text-sm font-semibold text-dark line-clamp-2 mb-1.5 group-hover:text-primary transition-colors duration-300">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  className={cn(
                    i < Math.floor(product.ratingsAverage)
                      ? 'text-warning fill-warning'
                      : 'text-border'
                  )}
                />
              ))}
            </div>
            <span className="text-text-muted text-[10px]">
              ({product.ratingsCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2">
            <span className="font-button text-base font-bold text-dark">
              {formatPrice(product.salePrice || product.price)}
            </span>
            {product.isOnSale && product.salePrice && (
              <span className="text-text-muted text-xs line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Color Options */}
          {product.colors && product.colors.length > 1 && (
            <div className="flex items-center gap-1.5 mt-2.5">
              {product.colors.slice(0, 4).map((color) => (
                <span
                  key={color.name}
                  className="w-4 h-4 rounded-full border border-border shadow-sm"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-text-muted text-[10px]">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
