import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../../Context/CartContext';
import { useAuth } from '../../Context/AuthContext';
import CartItem from '../../Components/Cart/CartItem';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';
import styles from './Cart.module.css';

function Cart() {
  const { items, subtotal } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  const handleCheckoutClick = () => {
    // Guests can browse and manage their cart freely, but need an account
    // once they're actually about to pay (so the order can be tied to
    // their addresses/order history). Redirect straight to Login if
    // they're not signed in yet, instead of showing the modal first.
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    setShowCheckoutModal(true);
  };

  if (items.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <h1 className={styles.emptyTitle}>Your cart is empty</h1>
            <p className={styles.emptyText}>Looks like you haven't added anything yet.</p>
            <Link to="/products" className={styles.browseButton}>
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>

        <div className={styles.list}>
          {items.map((item) => (
            <CartItem key={item.productId} item={item} />
          ))}
        </div>

        <div className={styles.summary}>
          <div className={styles.totalRow}>
            <span className={styles.totalLabel}>Total</span>
            <span className={styles.totalValue}>{subtotal.toFixed(0)} EGP</span>
          </div>

          <button type="button" className={styles.checkoutButton} onClick={handleCheckoutClick}>
            Proceed to Checkout
          </button>
        </div>
      </div>

      {showCheckoutModal && (
        <ConfirmationModal
          icon="🚚"
          title="Proceed to Checkout"
          message="Next, you'll choose a delivery address and payment method."
          primaryActionLabel="Continue"
          primaryActionTo="/checkout"
          onClose={() => setShowCheckoutModal(false)}
        />
      )}
    </div>
  );
}

export default Cart;