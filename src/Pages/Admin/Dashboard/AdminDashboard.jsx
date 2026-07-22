import { useOrders } from '../../../Context/Orders';
import { useProducts } from '../../../Context/ProductsContext';
import { useUsers } from '../../../Context/UsersContext';
import { getOrderStatusConfig } from '../../../utils/orderStatus';
import StatCard from '../../../Components/Admin/StatCard/StatCard';
import styles from './AdminDashboard.module.css';

function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function AdminDashboard() {
  const { orders, getOrderTotal } = useOrders();
  const { products, lowStockProducts, outOfStockProducts } = useProducts();
  const { users } = useUsers();

  const totalSales = orders.reduce((sum, order) => sum + getOrderTotal(order), 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>

      <div className={styles.statsGrid}>
        <StatCard icon="💰" label="Total Sales" value={`${totalSales} EGP`} />
        <StatCard icon="📦" label="Total Orders" value={orders.length} />
        <StatCard icon="👥" label="Total Users" value={users.length} />
        <StatCard icon="🛍️" label="Total Products" value={products.length} />
      </div>

      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className={styles.alertBox}>
          <span className={styles.alertIcon}>⚠️</span>
          <span>
            {lowStockProducts.length > 0 && `${lowStockProducts.length} product(s) are running low. `}
            {outOfStockProducts.length > 0 && `${outOfStockProducts.length} product(s) are out of stock.`}
          </span>
        </div>
      )}

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Recent Orders</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Price</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order) => {
              const statusConfig = getOrderStatusConfig(order.status);
              return (
                <tr key={order.id}>
                  <td>{order.customerInfo?.name || '—'}</td>
                  <td>{getOrderTotal(order)} EGP</td>
                  <td>
                    <span className={styles.statusBadge} style={{ backgroundColor: statusConfig.color }}>
                      {statusConfig.label}
                    </span>
                  </td>
                  <td>{formatDate(order.createdAt)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export default AdminDashboard;