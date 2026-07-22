import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarHalfIcon from '@mui/icons-material/StarHalf';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import productDetails from '../../data/productDetails';
import { useProducts } from '../../Context/ProductsContext';
import { useCart } from '../../Context/CartContext';
import { useWishlist } from '../../Context/WishlistContext';
import { getStockStatus, getStockBadgeLabel, getDisplayPrice } from '../../utils/productHelpers';
import ConfirmationModal from '../../Components/ConfirmationModal/ConfirmationModal';
import ProductReviews from '../../Components/ProductReviews/ProductReviews';
import ProductCard from '../../Components/ProductCard/ProductCard';
import styles from './ProductDetails.module.css';

function RatingStars({ value }) {
  const stars = [];
  for (let i = 1; i <= 5; i += 1) {
    if (value >= i) stars.push(<StarIcon key={i} fontSize="inherit" />);
    else if (value >= i - 0.5) stars.push(<StarHalfIcon key={i} fontSize="inherit" />);
    else stars.push(<StarBorderIcon key={i} fontSize="inherit" />);
  }
  return <div className={styles.stars}>{stars}</div>;
}

function ProductDetails() {
  const { id } = useParams();
  const { products: allProducts, isLoading } = useProducts();
  const product = allProducts.find((item) => item.id === id);
  const details = productDetails[id];

  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeModal, setActiveModal] = useState(null); // 'cart' | 'wishlist' | null

  const { addItem } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();

  const selectedColor = details?.colors[selectedColorIndex];
  const galleryImages = selectedColor?.images || [];
  const mainImage = galleryImages[selectedImageIndex];

  // Related products: same category, closest in price, excluding this one -
  // recalculated only if the product list or this product's id changes.
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return allProducts
      .filter((item) => item.id !== product.id && item.category === product.category)
      .sort((a, b) => Math.abs(a.price - product.price) - Math.abs(b.price - product.price))
      .slice(0, 4);
  }, [allProducts, product]);

  if (isLoading) {
    return <div className={styles.notFound}><p>Loading product...</p></div>;
  }

  if (!product || !details) {
    return (
      <div className={styles.notFound}>
        <p>Product not found.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }

  const stockStatus = getStockStatus(product.quantity);
  const stockBadgeLabel = getStockBadgeLabel(product.quantity);
  const isOutOfStock = stockStatus === 'out';
  const { hasDiscount, original, final, discountPercent } = getDisplayPrice(product);

  const handleSelectColor = (index) => {
    setSelectedColorIndex(index);
    setSelectedImageIndex(0);
  };

  const handleAddToCart = () => {
    if (details.sizes.length > 0 && !selectedSize) return;
    if (isOutOfStock) return;
    addItem(
      {
        id: `${product.id}-${selectedColor.name}-${selectedSize || 'onesize'}`,
        name: product.name,
        price: final,
        image: mainImage,
      },
      quantity
    );
    setActiveModal('cart');
  };

  const handleToggleWishlist = () => {
    const nowFavorited = toggleItem(product);
    if (nowFavorited) setActiveModal('wishlist');
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topSection}>
          {/* ==== Gallery ==== */}
          <div className={styles.gallery}>
            <div className={styles.mainImageWrapper}>
              <img src={mainImage} alt={product.name} className={styles.mainImage} />
            </div>
            <div className={styles.thumbnailRow}>
              {galleryImages.map((image, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.thumbnail} ${
                    index === selectedImageIndex ? styles.thumbnailActive : ''
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                >
                  <img src={image} alt={`${product.name} view ${index + 1}`} />
                </button>
              ))}
            </div>
          </div>

          {/* ==== Info & purchase controls ==== */}
          <div className={styles.info}>
            <h1 className={styles.name}>{product.name}</h1>
            <RatingStars value={product.rating} />

            <div className={styles.priceRow}>
              {hasDiscount ? (
                <>
                  <span className={styles.priceOriginal}>{original} EGP</span>
                  <span className={styles.price}>{final} EGP</span>
                  <span className={styles.discountTag}>{discountPercent}% OFF</span>
                </>
              ) : (
                <span className={styles.price}>{original} EGP</span>
              )}
            </div>

            <span className={isOutOfStock ? styles.outOfStock : styles.inStock}>
              {isOutOfStock ? 'Out of Stock' : stockBadgeLabel || 'In Stock'}
            </span>

            <p className={styles.description}>{details.description}</p>

            {/* Colors */}
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>
                Color: <strong>{selectedColor.name}</strong>
              </span>
              <div className={styles.colorRow}>
                {details.colors.map((color, index) => (
                  <button
                    key={color.name}
                    type="button"
                    className={`${styles.colorSwatch} ${
                      index === selectedColorIndex ? styles.colorSwatchActive : ''
                    }`}
                    style={{ backgroundColor: color.hex }}
                    onClick={() => handleSelectColor(index)}
                    aria-label={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Sizes */}
            {details.sizes.length > 0 && (
              <div className={styles.optionGroup}>
                <span className={styles.optionLabel}>Size</span>
                <div className={styles.sizeRow}>
                  {details.sizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      className={`${styles.sizeButton} ${
                        size === selectedSize ? styles.sizeButtonActive : ''
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Quantity</span>
              <div className={styles.quantityRow}>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() => setQuantity((prev) => Math.max(prev - 1, 1))}
                  aria-label="Decrease quantity"
                >
                  <RemoveIcon fontSize="small" />
                </button>
                <span className={styles.quantityValue}>{quantity}</span>
                <button
                  type="button"
                  className={styles.quantityButton}
                  onClick={() => setQuantity((prev) => prev + 1)}
                  aria-label="Increase quantity"
                >
                  <AddIcon fontSize="small" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actionsRow}>
              <button
                type="button"
                className={styles.addToCartButton}
                onClick={handleAddToCart}
                disabled={isOutOfStock || (details.sizes.length > 0 && !selectedSize)}
              >
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                type="button"
                className={styles.wishlistButton}
                onClick={handleToggleWishlist}
                aria-label="Add to wishlist"
              >
                {isInWishlist(product.id) ? (
                  <FavoriteIcon fontSize="small" className={styles.wishlistIconActive} />
                ) : (
                  <FavoriteBorderIcon fontSize="small" />
                )}
              </button>
            </div>

            {details.sizes.length > 0 && !selectedSize && (
              <span className={styles.selectSizeHint}>Please select a size</span>
            )}
          </div>
        </div>

        {/* ==== Reviews ==== */}
        <ProductReviews initialReviews={details.reviews} />

        {/* ==== Related products ==== */}
        {relatedProducts.length > 0 && (
          <div className={styles.relatedSection}>
            <h2 className={styles.relatedTitle}>You Might Also Like</h2>
            <div className={styles.relatedGrid}>
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} product={related} />
              ))}
            </div>
          </div>
        )}
      </div>

      {activeModal === 'cart' && (
        <ConfirmationModal
          icon="🛒"
          title="Added to Cart"
          message={`${product.name} (${selectedColor.name}${
            selectedSize ? `, ${selectedSize}` : ''
          }) x${quantity}`}
          image={mainImage}
          primaryActionLabel="View Cart"
          primaryActionTo="/cart"
          onClose={() => setActiveModal(null)}
        />
      )}

      {activeModal === 'wishlist' && (
        <ConfirmationModal
          icon="❤️"
          title="Added to Wishlist"
          message={`${product.name} has been saved to your wishlist.`}
          image={mainImage}
          primaryActionLabel="View Wishlist"
          primaryActionTo="/wishlist"
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

export default ProductDetails;