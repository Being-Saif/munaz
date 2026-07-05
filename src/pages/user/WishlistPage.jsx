import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectWishlistItems, removeFromWishlist } from '@redux/slices/wishlistSlice';
import { addToCart } from '@redux/slices/cartSlice';
import { openCart } from '@redux/slices/uiSlice';
import { formatPrice, calculateDiscount } from '@utils/formatters';
import products from '@data/products.json';
import toast from 'react-hot-toast';
import { cn } from '@utils/cn';

const WishlistPage = () => {
  const dispatch = useDispatch();
  const wishlistIds = useSelector(selectWishlistItems);

  // Get full product data for wishlisted items
  const wishlistProducts = wishlistIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  const handleRemove = (productId) => {
    dispatch(removeFromWishlist(productId));
    toast.success('Removed from wishlist');
  };

  const handleAddToCart = (product) => {
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
    <div className="pt-28 lg:pt-32 pb-16">
      <div className="section-container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-heading text-3xl lg:text-4xl text-dark mb-2">
            My Wishlist
          </h1>
          <p className="text-text-secondary text-sm">
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </motion.div>

        {/* Empty State */}
        {wishlistProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-secondary/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart size={32} className="text-secondary/40" />
            </div>
            <h3 className="font-heading text-xl text-dark mb-2">Your wishlist is empty</h3>
            <p className="text-text-muted text-sm mb-6 max-w-sm mx-auto">
              Start saving items you love by clicking the heart icon on any product.
            </p>
            <Link to="/shop" className="btn-primary text-sm">
              Explore Products
            </Link>
          </motion.div>
        ) : (
          /* Wishlist Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {wishlistProducts.map((product, index) => {
              const discount = calculateDiscount(product.price, product.salePrice);

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-surface rounded-lg border border-border overflow-hidden shadow-card hover:shadow-lg transition-all duration-400 ease-velora"
                >
                  {/* Image */}
                  <Link to={`/product/${product.slug}`} className="block relative aspect-product overflow-hidden">
                    {product.isOnSale && discount > 0 && (
                      <span className="absolute top-2 left-2 z-10 badge-sale text-[10px] px-2 py-0.5">
                        -{discount}%
                      </span>
                    )}
                    <img
                      src={product.thumbnail}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>

                  {/* Details */}
                  <div className="p-4">
                    <Link to={`/product/${product.slug}`}>
                      <h3 className="font-body text-sm font-semibold text-dark mb-1 line-clamp-2 hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Price */}
                    <div className="flex items-center gap-2 mb-3">
                      <span className="font-button text-base font-bold text-dark">
                        {formatPrice(product.salePrice || product.price)}
                      </span>
                      {product.isOnSale && product.salePrice && (
                        <span className="text-text-muted text-xs line-through">
                          {formatPrice(product.price)}
                        </span>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-primary text-white text-xs font-medium py-2.5 rounded-md hover:bg-primary-dark transition-colors"
                      >
                        <ShoppingBag size={14} />
                        Add to Cart
                      </button>
                      <button
                        onClick={() => handleRemove(product.id)}
                        className="w-10 h-10 flex items-center justify-center rounded-md border border-border text-text-muted hover:text-error hover:border-error transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
