import ProductCard from '../ProductCard/ProductCard';
import { useProducts } from '../../Context/ProductsContext';
import styles from './FeaturedProducts.module.css';

function FeaturedProducts() {
  const { products, isLoading } = useProducts();

  // Shows the 6 most recently added products - keeps the Home page from
  // becoming a full product listing while still surfacing what's new.
  const featuredProducts = products.slice(0, 6);

  if (isLoading || featuredProducts.length === 0) return null;

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2 className={styles.title}>Featured Products</h2>

        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturedProducts;