import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import styles from './ConfirmationModal.module.css';

/**
 * ConfirmationModal
 * A centered overlay confirming an action (added to cart / wishlist).
 * Unlike the corner toasts (which auto-dismiss for passive notices like
 * login success), this requires the user to actively click a button to
 * continue - appropriate for a purchase-adjacent action they should
 * consciously acknowledge.
 *
 * @param {string} icon - emoji or short glyph shown at the top
 * @param {string} title - short headline, e.g. "Added to Cart"
 * @param {string} message - one-line detail, e.g. "Classic Tee (Blue, M) x1"
 * @param {object} image - product image shown alongside the message
 * @param {string} primaryActionLabel - e.g. "View Cart"
 * @param {string} primaryActionTo - route the primary button links to
 * @param {function} onClose - closes the modal (also used by the secondary button)
 */
function ConfirmationModal({
  icon,
  title,
  message,
  image,
  primaryActionLabel,
  primaryActionTo,
  onClose,
}) {
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <button type="button" className={styles.closeButton} onClick={onClose} aria-label="Close">
          <CloseIcon fontSize="small" />
        </button>

        <div className={styles.iconCircle}>{icon}</div>

        {image && <img src={image} alt="" className={styles.productImage} />}

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.message}>{message}</p>

        <div className={styles.actions}>
          <button type="button" className={styles.secondaryButton} onClick={onClose}>
            Continue Shopping
          </button>
          <Link to={primaryActionTo} className={styles.primaryButton} onClick={onClose}>
            {primaryActionLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;