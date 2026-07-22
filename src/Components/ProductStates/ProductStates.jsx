import styles from './ProductStates.module.css';

// These are ready to use once the full Products/category page is built.
// LoadingState: show while a product API request is in flight.
export function LoadingState({ message = 'Loading products...' }) {
  return (
    <div className={styles.stateWrapper}>
      <div className={styles.spinner} />
      <span>{message}</span>
    </div>
  );
}

// EmptyState: show when a search/filter returns zero products.
export function EmptyState({ message = 'No products found.' }) {
  return (
    <div className={styles.stateWrapper}>
      <span className={styles.emptyIcon}>🔍</span>
      <span>{message}</span>
    </div>
  );
}