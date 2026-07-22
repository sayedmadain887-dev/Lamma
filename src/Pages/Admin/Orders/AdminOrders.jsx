import { useState } from 'react';
import { useOrders } from '../../../Context/Orders';
import { useToast } from '../../../Context/ToastContext';
import { getOrderStatusConfig, ORDER_STATUS } from '../../../utils/orderStatus';
import styles from './AdminOrders.module.css';

const STATUS_OPTIONS = Object.values(ORDER_STATUS);

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AdminOrders() {
  const { orders, isLoading, getOrderTotal, updateOrderStatus } = useOrders();
  const { showSuccess } = useToast();
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
    showSuccess('Order status updated');
  };

  const toggleExpanded = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Orders</h1>

      {isLoading ? (
        <p className={styles.emptyState}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className={styles.emptyState}>No orders yet.</p>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const statusConfig = getOrderStatusConfig(order.status);
                const isExpanded = expandedOrderId === order.id;
                const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);

                return (
                  <>
                    <tr key={order.id} className={styles.row}>
                      <td>{order.orderNumber}</td>
                      <td>{order.customerInfo?.name || '—'}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.itemsToggle}
                          onClick={() => toggleExpanded(order.id)}
                        >
                          {itemCount} item{itemCount !== 1 ? 's' : ''}
                          <span className={styles.chevron}>{isExpanded ? '▲' : '▼'}</span>
                        </button>
                      </td>
                      <td>{getOrderTotal(order)} EGP</td>
                      <td>{formatDate(order.createdAt)}</td>
                      <td>
                        <select
                          className={styles.statusSelect}
                          style={{ borderColor: statusConfig.color, color: statusConfig.color }}
                          value={order.status}
                          onChange={(event) => handleStatusChange(order.id, event.target.value)}
                        >
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {getOrderStatusConfig(status).label}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr key={`${order.id}-details`} className={styles.detailsRow}>
                        <td colSpan={6}>
                          <div className={styles.itemsList}>
                            {order.items.map((item) => (
                              <div key={item.id} className={styles.itemRow}>
                                <span className={styles.itemName}>{item.name}</span>
                                <span className={styles.itemQty}>×{item.quantity}</span>
                                <span className={styles.itemPrice}>{item.price * item.quantity} EGP</span>
                              </div>
                            ))}
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminOrders;