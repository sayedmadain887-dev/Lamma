import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PersonIcon from "@mui/icons-material/Person"
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { useAuth } from '../../Context/AuthContext';
import AccountInfoSection from '../../Components/Profile/AccountInfoSection/AccountInfoSection';
import SecuritySection from '../../Components/SecuritySection/SecuritySection';
import OrdersSection from '../../Components/Profile/OrdersSection/OrdersSection';
import AddressesSection from '../../Components/Profile/AddressesSection/AddressesSection';
import SettingsSection from '../../Components/Profile/SettingsSection/SettingsSection';
import styles from './Profile.module.css';

const TABS = [
  { id: 'account', label: 'Account Info', icon: PersonIcon },
  { id: 'security', label: 'Security', icon: LockOutlinedIcon },
  { id: 'orders', label: 'My Orders', icon: Inventory2OutlinedIcon },
  { id: 'addresses', label: 'Addresses', icon: LocationOnOutlinedIcon },
  { id: 'wishlist', label: 'Wishlist', icon: FavoriteBorderIcon },
  { id: 'settings', label: 'Settings', icon: SettingsOutlinedIcon },
];

function Profile() {
  const { user, isLoggedIn, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('account');

  // Guard: only logged-in users can view this page.
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      navigate('/login');
    }
  }, [isLoading, isLoggedIn, navigate]);

  if (!isLoggedIn) return null;

  const renderActiveSection = () => {
    switch (activeTab) {
      case 'account':
        return <AccountInfoSection />;
      case 'security':
        return <SecuritySection />;
      case 'orders':
        return <OrdersSection />;
      case 'addresses':
        return <AddressesSection />;
      case 'wishlist':
        // Wishlist has its own full page - this tab is just a shortcut to it.
        return (
          <div className={styles.comingSoon}>
            <h2 className={styles.title}>Wishlist</h2>
            <p>
              Manage your saved items on the <Link to="/wishlist">Wishlist page</Link>.
            </p>
          </div>
        );
      case 'settings':
        return <SettingsSection />;
      default:
        return null;
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Hi, {user?.name || 'there'}</h1>

        <div className={styles.layout}>
          <nav className={styles.sidebar}>
            {TABS.map((tab) => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  className={`${styles.tabButton} ${
                    activeTab === tab.id ? styles.tabButtonActive : ''
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <TabIcon fontSize="small" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          <div className={styles.content}>{renderActiveSection()}</div>
        </div>
      </div>
    </div>
  );
}

export default Profile;