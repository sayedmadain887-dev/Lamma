import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../Components/ProductCard/ProductCard';
import ProductFilters from '../../Components/ProductFilters/ProductFilters';
import { LoadingState, EmptyState } from '../../Components/ProductStates/ProductStates';
import { useProducts } from '../../Context/ProductsContext';
import { getStockStatus } from '../../utils/productHelpers';
import styles from './Products.module.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top Rated' },
];

function Products() {
  const { products: allProducts, isLoading } = useProducts();

  // Reads ?category= and ?search= if the page was reached via a category
  // link or a future navbar "view all results" link - this page never
  // renders its own separate search box (there's only one search, in the
  // Navbar).
  const [searchParams] = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const searchTerm = (searchParams.get('search') || '').trim().toLowerCase();

  const maxPossiblePrice = useMemo(
    () => (allProducts.length > 0 ? Math.max(...allProducts.map((product) => product.price)) : 0),
    [allProducts]
  );

  const [filters, setFilters] = useState({
    categories: categoryFromUrl ? [categoryFromUrl] : [],
    maxPrice: null, // null = no limit yet, until products have loaded
    minRating: 0,
    inStockOnly: false,
  });
  const [sortBy, setSortBy] = useState('newest');

  // Once products load and we know the real max price, seed the filter
  // with it (only the first time - doesn't override a value the user set).
  useMemo(() => {
    if (filters.maxPrice === null && maxPossiblePrice > 0) {
      setFilters((prev) => ({ ...prev, maxPrice: maxPossiblePrice }));
    }
  }, [maxPossiblePrice, filters.maxPrice]);

  const visibleProducts = useMemo(() => {
    if (filters.maxPrice === null) return [];

    let result = allProducts.filter((product) => {
      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(product.category)
      ) {
        return false;
      }
      if (product.price > filters.maxPrice) return false;
      if (product.rating < filters.minRating) return false;
      if (filters.inStockOnly && getStockStatus(product.quantity) === 'out') return false;
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm)) {
        return false;
      }
      return true;
    });

    switch (sortBy) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        result = [...result].sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
      default:
        result = [...result].sort(
          (a, b) => new Date(b.dateAdded) - new Date(a.dateAdded)
        );
        break;
    }

    return result;
  }, [allProducts, filters, sortBy, searchTerm]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>All Products</h1>

          <div className={styles.sortWrapper}>
            <label htmlFor="sort" className={styles.sortLabel}>
              Sort by
            </label>
            <select
              id="sort"
              className={styles.sortSelect}
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.layout}>
          <ProductFilters
            filters={filters}
            onChange={setFilters}
            maxPossiblePrice={maxPossiblePrice}
          />

          <div className={styles.results}>
            {isLoading ? (
              <LoadingState />
            ) : visibleProducts.length === 0 ? (
              <EmptyState message="No products match your filters." />
            ) : (
              <div className={styles.grid}>
                {visibleProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Products;