import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import categories from '../../data/categories';
import styles from './CategoriesDropdown.module.css';

function CategoriesDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  // Close on outside click
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

  // Close on Escape key for accessibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className={styles.wrapper} ref={wrapperRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
      >
        <span>Categories</span>
        <KeyboardArrowDownIcon
          fontSize="small"
          className={isOpen ? styles.iconOpen : styles.icon}
        />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {categories.map((category) => {
            const CategoryIcon = category.icon;
            return (
              <Link
                key={category.id}
                to={`/products?category=${category.slug}`}
                className={styles.item}
                onClick={() => setIsOpen(false)}
              >
                <CategoryIcon fontSize="small" className={styles.itemIcon} />
                <span>{category.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CategoriesDropdown;