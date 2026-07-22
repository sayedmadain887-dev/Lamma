import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import tshirt1 from '../../assets/products/f1.jpg';
import tshirt2 from '../../assets/products/f2.jpg';
import tshirt3 from '../../assets/products/f3.jpg';
import AboutSection from '../../Components/AboutSection/AboutSection';
import FeaturedProducts from '../../Components/FeaturedProducts/FeaturedProducts';
import styles from './Home.module.css';

// Placeholder product data for the hero showcase.
// Swap the imported files above to use different images later.
const showcaseProducts = [
  { id: 1, name: 'Classic Tee', price: 249, image: tshirt1 },
  { id: 2, name: 'Urban Fit', price: 299, image: tshirt2 },
  { id: 3, name: 'Essential Crew', price: 279, image: tshirt3 },
];

function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto-cycle through the showcase products every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % showcaseProducts.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        {/* Empty background image slot for later.
            To add a background photo: put the file in src/assets/,
            import it above, then set it as this div's backgroundImage
            (see the commented example in Home.module.css under .heroBackground). */}
        <div className={styles.heroBackground} />

        <div className={styles.heroContent}>
          <div className={styles.textBlock}>
            <h1 className={styles.headline}>
              Welcome to <span className={styles.highlight}>Lamma</span> - Where
              Everything Comes Together.
            </h1>
            <p className={styles.prog}>
              Fashion, electronics, accessories, and more - all gathered in one
              place for you.
            </p>

            <div className={styles.discountNote}>
              <LocalOfferOutlinedIcon fontSize="small" />
              <span>Up to 50% Off</span>
            </div>

            <Link to="/products" className={styles.ctaButton}>
              Shop Now
            </Link>
          </div>

          <div className={styles.showcase}>
            {showcaseProducts.map((product, index) => (
              <div
                key={product.id}
                className={`${styles.productCard} ${
                  index === activeIndex ? styles.active : ''
                }`}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className={styles.productImage}
                />
                <span className={styles.productName}>{product.name}</span>
                <span className={styles.productPrice}>{product.price} EGP</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AboutSection />
      <FeaturedProducts />
    </div>
  );
}

export default Home;