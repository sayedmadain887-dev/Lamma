import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import styles from './AdminLayout.module.css';

const ADMIN_NAV = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
//   { to: '/admin/settings', label: 'Settings' },
];

// Guard: only logged-in users with isAdmin=true can see anything under /admin.
// A regular customer landing here (by guessing the URL) is bounced to the
// homepage instead of seeing a blank page or an error.
function AdminLayout() {
  const { user, isLoggedIn, isLoading } = useAuth();

  if (isLoading) return null;
  if (!isLoggedIn || !user?.isAdmin) return <Navigate to="/" replace />;

  return (
    <div className={styles.layout}>
      <nav className={styles.sidebar}>
        <span className={styles.brand}>Admin Panel</span>
        {ADMIN_NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;