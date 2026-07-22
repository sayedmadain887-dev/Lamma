import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import { useWishlist } from '../../Context/WishlistContext';
import { useCart } from '../../Context/CartContext';
import { useToast } from '../../Context/ToastContext';
import styles from './Wishlist.module.css';

function Wishlist() {
  const { items, removeItem } = useWishlist();
  const { addItem } = useCart();
  const { showSuccess } = useToast();

  const handleMoveToCart = (product) => {
    addItem(product, 1);
    removeItem(product.id);
    showSuccess(`${product.name} moved to cart`);
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <h1 className={styles.emptyTitle}>Your wishlist is empty</h1>
          <p className={styles.emptyText}>Save items you love to find them here later.</p>
          <Link to="/products" className={styles.browseButton}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Wishlist</h1>

        <div className={styles.grid}>
          {items.map((product) => (
            <div key={product.id} className={styles.card}>
              <Link to={`/product/${product.id}`} className={styles.imageLink}>
                <img src={product.image} alt={product.name} className={styles.image} />
              </Link>

              <div className={styles.info}>
                <span className={styles.name}>{product.name}</span>
                <span className={styles.price}>{product.price} EGP</span>
              </div>

              <div className={styles.actions}>
                <button
                  type="button"
                  className={styles.moveButton}
                  onClick={() => handleMoveToCart(product)}
                  disabled={!product.inStock}
                >
                  {product.inStock ? 'Move to Cart' : 'Out of Stock'}
                </button>
                <button
                  type="button"
                  className={styles.removeButton}
                  onClick={() => removeItem(product.id)}
                  aria-label={`Remove ${product.name}`}
                >
                  <DeleteIcon fontSize="small" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Wishlist;