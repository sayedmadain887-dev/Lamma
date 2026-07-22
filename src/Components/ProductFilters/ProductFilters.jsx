import categories from '../../data/categories';
import styles from './ProductFilters.module.css';

const RATING_OPTIONS = [4, 3, 2, 1];

// Controlled component: the parent (Products page) owns the filter state
// and passes it in as `filters`, plus an `onChange` callback for updates.
// Keeping this "dumb" (no internal state) makes it trivial to sync with
// the URL later if we want shareable filtered links.
function ProductFilters({ filters, onChange, maxPossiblePrice }) {
  const toggleCategory = (slug) => {
    const isSelected = filters.categories.includes(slug);
    const nextCategories = isSelected
      ? filters.categories.filter((item) => item !== slug)
      : [...filters.categories, slug];
    onChange({ ...filters, categories: nextCategories });
  };

  return (
    <aside className={styles.panel}>
      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Category</h3>
        {categories.map((category) => (
          <label key={category.id} className={styles.checkboxRow}>
            <input
              type="checkbox"
              checked={filters.categories.includes(category.slug)}
              onChange={() => toggleCategory(category.slug)}
            />
            <span>{category.label}</span>
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Max Price</h3>
        <input
          type="range"
          min={0}
          max={maxPossiblePrice}
          step={10}
          value={filters.maxPrice}
          onChange={(event) =>
            onChange({ ...filters, maxPrice: Number(event.target.value) })
          }
          className={styles.rangeInput}
        />
        <span className={styles.rangeValue}>Up to {filters.maxPrice} EGP</span>
      </div>

      <div className={styles.group}>
        <h3 className={styles.groupTitle}>Rating</h3>
        <label className={styles.checkboxRow}>
          <input
            type="radio"
            name="rating"
            checked={filters.minRating === 0}
            onChange={() => onChange({ ...filters, minRating: 0 })}
          />
          <span>Any rating</span>
        </label>
        {RATING_OPTIONS.map((rating) => (
          <label key={rating} className={styles.checkboxRow}>
            <input
              type="radio"
              name="rating"
              checked={filters.minRating === rating}
              onChange={() => onChange({ ...filters, minRating: rating })}
            />
            <span>{rating}+ stars</span>
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={filters.inStockOnly}
            onChange={(event) =>
              onChange({ ...filters, inStockOnly: event.target.checked })
            }
          />
          <span>In stock only</span>
        </label>
      </div>
    </aside>
  );
}

export default ProductFilters;