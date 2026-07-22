import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { useToast } from '../../Context/ToastContext';
import { getStockStatus, getStockBadgeLabel, getDisplayPrice } from '../../utils/productHelpers';
import styles from './ProductCard.module.css';

// Renders a 5-star rating as filled / half / empty stars based on the
// numeric value (e.g. 4.5 -> 4 filled, 1 half, 0 empty).
function RatingStars({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) {
      stars.push(<StarIcon key={i} fontSize="inherit" />);
    } else if (value >= i - 0.5) {
      stars.push(<StarHalfIcon key={i} fontSize="inherit" />);
    } else {
      stars.push(<StarBorderIcon key={i} fontSize="inherit" />);
    }
  }
  return <div className={styles.stars}>{stars}</div>;
}

// This component is meant to be reused everywhere products are shown -
// the Home page featured section, the Products grid, related products on
// the details page. Keeping it self-contained (own cart/wishlist calls)
// means those places just need to pass a `product` object, nothing more.
//
// The card links to /product/:id EXCEPT for the favorite and add-to-cart
// buttons, which call event.preventDefault()/stopPropagation() so clicking
// them doesn't also trigger navigation.
function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const { showSuccess } = useToast();

  const isFavorited = isInWishlist(product.id);
  const stockStatus = getStockStatus(product.quantity);
  const stockBadgeLabel = getStockBadgeLabel(product.quantity);
  const isOutOfStock = stockStatus === 'out';
  const { hasDiscount, original, final, discountPercent } = getDisplayPrice(product);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    // Cart items should carry the price the customer actually pays.
    addItem({ ...product, price: final }, 1);
    showSuccess(`${product.name} added to cart`);
  };

  const handleToggleFavorite = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const nowFavorited = toggleItem(product);
    showSuccess(nowFavorited ? `${product.name} added to wishlist` : `${product.name} removed from wishlist`);
  };

  return (
    <div className={styles.card}>
      <Link to={`/product/${product.id}`} className={styles.cardLink}>
        <div className={styles.imageWrapper}>
          <img src={product.image} alt={product.name} className={styles.image} />

          {hasDiscount && (
            <span className={styles.discountBadge}>{discountPercent}% OFF</span>
          )}

          {!hasDiscount && product.badge && (
            <span
              className={`${styles.badge} ${
                product.badge === 'sale' ? styles.badgeSale : styles.badgeNew
              }`}
            >
              {product.badge === 'sale' ? 'Sale' : 'New'}
            </span>
          )}

          <button
            type="button"
            className={styles.favoriteButton}
            onClick={handleToggleFavorite}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            {isFavorited ? (
              <FavoriteIcon fontSize="small" className={styles.favoriteIconActive} />
            ) : (
              <FavoriteBorderIcon fontSize="small" />
            )}
          </button>

          {isOutOfStock && (
            <div className={styles.outOfStockOverlay}>
              <span>Out of Stock</span>
            </div>
          )}
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{product.name}</h3>
          <RatingStars value={product.rating} />

          <div className={styles.priceRow}>
            {hasDiscount ? (
              <>
                <span className={styles.priceOriginal}>{original} EGP</span>
                <span className={styles.price}>{final} EGP</span>
              </>
            ) : (
              <span className={styles.price}>{original} EGP</span>
            )}
          </div>

          {stockBadgeLabel && !isOutOfStock && (
            <span className={styles.lowStockBadge}>{stockBadgeLabel}</span>
          )}
        </div>
      </Link>

      <div className={styles.cardFooter}>
        <button
          type="button"
          className={styles.addToCartButton}
          onClick={handleAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

export default ProductCard;