import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import AccountCircleIcon from '@mui/icons-material/AccountCircleIcon';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../../Context/AuthContext';
import styles from './UserMenu.module.css';
import PersonIcon from "@mui/icons-material/Person"
function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    navigate('/');
  };

  // Not logged in: show explicit Login / Sign Up buttons instead of a hidden icon
  if (!isLoggedIn) {
    return (
      <div className={styles.authButtons}>
        <Link to="/login" className={styles.loginButton}>
          Login
        </Link>
        <Link to="/register" className={styles.signupButton}>
          Sign Up
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.iconButton}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label="User account"
      >
        <PersonIcon  fontSize="small" /> 
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          <div className={styles.userInfo}>{user?.name || user?.email}</div>

          <Link to="/profile" className={styles.item} onClick={() => setIsOpen(false)}>
            {/* <PersonOutlineIcon fontSize="small" /> */}
            <span>My Profile</span>
          </Link>

          <Link to="/orders" className={styles.item} onClick={() => setIsOpen(false)}>
            <Inventory2OutlinedIcon fontSize="small" />
            <span>My Orders</span>
          </Link>

          <Link to="/wishlist" className={styles.item} onClick={() => setIsOpen(false)}>
            <FavoriteBorderIcon fontSize="small" />
            <span>Wishlist</span>
          </Link>

          <button type="button" className={styles.logoutItem} onClick={handleLogout}>
            <LogoutIcon fontSize="small" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
}

export default UserMenu;
