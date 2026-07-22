import { useAddresses } from '../../../Context/Addresses';
import { useOrders } from '../../../Context/Orders';
import { getOrderStatusConfig } from '../../../utils/orderStatus';
import { getAddressLabelText, formatAddressLine } from '../../../utils/addressLabels';
import styles from './OrderCard.module.css';

function formatOrderDate(isoString) {
  return new Date(isoString).toLocaleDateString('ar-EG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function OrderCard({ order }) {
  const { getAddressById } = useAddresses();
  const { getOrderTotal } = useOrders();

  const address = getAddressById(order.addressId);
  const statusConfig = getOrderStatusConfig(order.status);
  const itemsSummary = order.items.map((item) => `${item.name} ×${item.quantity}`).join('، ');

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <span className={styles.orderNumber}>طلب {order.orderNumber}</span>
          <span className={styles.orderDate}>{formatOrderDate(order.createdAt)}</span>
        </div>
        <span className={styles.statusBadge} style={{ backgroundColor: statusConfig.color }}>
          {statusConfig.label}
        </span>
      </div>

      <p className={styles.items}>{itemsSummary}</p>

      {address && (
        <div className={styles.addressRow}>
          <span className={styles.addressLabel}>{getAddressLabelText(address.label)}</span>
          <span className={styles.addressLine}>{formatAddressLine(address)}</span>
        </div>
      )}

      <div className={styles.footer}>
        <span className={styles.totalLabel}>الإجمالي</span>
        <span className={styles.totalValue}>{getOrderTotal(order)} جنيه</span>
      </div>
    </div>
  );
}

export default OrderCard;