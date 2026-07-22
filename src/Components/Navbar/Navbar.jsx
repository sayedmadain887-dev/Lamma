import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import SearchBar from '../SearchBar/SearchBar';
import CategoriesDropdown from '../CategoriesDropdown/CategoriesDropdown';
import UserMenu from '../UserMenu/UserMenu';
import { useCart } from '../../Context/CartContext';
import styles from './Navbar.module.css';

// This component only handles LAYOUT - it arranges the smaller,
// independent pieces (SearchBar, CategoriesDropdown, UserMenu).
// Each piece manages its own state, so a bug in one (e.g. search)
// can't break the others (e.g. the cart icon or the categories menu).
function Navbar() {
  const { itemCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Same "click outside to close" pattern used in CategoriesDropdown and
  // UserMenu - no overlay div needed, which avoids an invisible layer
  // ever sitting on top of the page and blocking clicks by mistake.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.navbar} ref={navRef}>
      <div className={styles.container}>
        <div className={styles.startGroup}>
          <Link to="/" className={styles.logo} onClick={closeMobileMenu}>
            Lamma
          </Link>

          {/* Categories + Search only show inline on desktop.
              On mobile they move inside the dropdown menu below. */}
          <div className={styles.desktopOnly}>
            <CategoriesDropdown />
          </div>
        </div>

        <div className={`${styles.searchWrapper} ${styles.desktopOnly}`}>
          <SearchBar />
        </div>

        <div className={`${styles.actions} ${styles.desktopOnly}`}>
          <UserMenu />

          <Link to="/wishlist" className={styles.iconLink} aria-label="Wishlist">
            <FavoriteBorderIcon fontSize="medium" />
          </Link>

          <Link to="/cart" className={styles.cartLink} aria-label="Shopping cart">
            <ShoppingCartOutlinedIcon fontSize="medium" />
            {itemCount > 0 && <span className={styles.cartBadge}>{itemCount}</span>}
          </Link>
        </div>

        {/* Hamburger button - only visible on mobile */}
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          aria-label="Menu"
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile dropdown menu - a normal panel that drops down below the
          bar, not a fixed full-screen overlay. Tapping any link inside it
          closes it via each Link's own onClick; tapping anywhere else on
          the page closes it via the outside-click listener above. */}
      {isMobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <div className={styles.mobileSearchWrapper}>
            <SearchBar />
          </div>

          <CategoriesDropdown />

          <div className={styles.mobileActions}>
            <UserMenu />

            <Link to="/wishlist" className={styles.mobileLink} onClick={closeMobileMenu}>
              <FavoriteBorderIcon fontSize="small" />
              <span>Wishlist</span>
            </Link>

            <Link to="/cart" className={styles.mobileLink} onClick={closeMobileMenu}>
              <ShoppingCartOutlinedIcon fontSize="small" />
              <span>Cart{itemCount > 0 ? ` (${itemCount})` : ''}</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;