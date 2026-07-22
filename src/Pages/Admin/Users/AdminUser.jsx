import { useUsers } from '../../../Context/UsersContext';
import { useOrders } from '../../../Context/Orders';
import styles from './AdminUser.module.css';

function AdminUsers() {
  const { users, isLoading } = useUsers();
  const { orders } = useOrders();

  const getOrderCount = (userId) => orders.filter((order) => order.userId === userId).length;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>

      {isLoading ? (
        <p className={styles.emptyState}>Loading users...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined</th>
              <th>Orders</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.joinedAt}</td>
                <td>{getOrderCount(user.id)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminUsers;