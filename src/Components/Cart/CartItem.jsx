import DeleteIcon from '@mui/icons-material/Delete';
import { useCart } from '../../Context/CartContext';
import styles from './CartItem.module.css';

function CartItem({ item }) {
  const { updateQuantity, removeItem } = useCart();

  const total = item.price * item.quantity;

  return (
    <div className={styles.item}>
      <img src={item.image} alt={item.name} className={styles.image} />

      <div className={styles.info}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.price}>{item.price} EGP</span>
      </div>

      <div className={styles.quantity}>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          aria-label="Decrease quantity"
        >
          -
        </button>
        <span className={styles.quantityValue}>{item.quantity}</span>
        <button
          type="button"
          className={styles.quantityButton}
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <span className={styles.total}>{total} EGP</span>

      <button
        type="button"
        className={styles.removeButton}
        onClick={() => removeItem(item.productId)}
        aria-label={`Remove ${item.name}`}
      >
        <DeleteIcon fontSize="small" />
      </button>
    </div>
  );
}

export default CartItem;