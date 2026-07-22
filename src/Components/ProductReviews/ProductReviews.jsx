import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import { useAuth } from '../../Context/AuthContext';
import styles from './ProductReviews.module.css';

function StarRatingInput({ value, onChange }) {
  return (
    <div className={styles.starInput}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={styles.starButton}
          onClick={() => onChange(star)}
          aria-label={`${star} star${star > 1 ? 's' : ''}`}
        >
          {star <= value ? (
            <StarIcon fontSize="small" />
          ) : (
            <StarBorderIcon fontSize="small" />
          )}
        </button>
      ))}
    </div>
  );
}

// TODO: reviews are held in local component state for now (via `initialReviews`
// passed from the parent). Once a backend exists, submitting a review should
// POST to something like /api/products/:id/reviews, and the list should be
// re-fetched (or optimistically updated) instead of only living in memory.
function ProductReviews({ initialReviews, onReviewAdded }) {
  const [reviews, setReviews] = useState(initialReviews);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const { isLoggedIn, user } = useAuth();

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
      : null;

  const handleSubmit = (event) => {
    event.preventDefault();
    if (newRating === 0 || !newComment.trim()) return;

    const review = {
      id: `local-${Date.now()}`,
      author: user?.name || 'You',
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toISOString().slice(0, 10),
    };

    setReviews((prev) => [review, ...prev]);
    setNewRating(0);
    setNewComment('');
    if (onReviewAdded) onReviewAdded(review);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Reviews & Ratings</h2>
        <span className={styles.count}>
          {reviews.length} review{reviews.length !== 1 ? 's' : ''}
          {averageRating && ` · ${averageRating} average`}
        </span>
      </div>

      {isLoggedIn ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <StarRatingInput value={newRating} onChange={setNewRating} />
          <textarea
            className={styles.textarea}
            placeholder="Share your thoughts about this product..."
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            rows={3}
          />
          <button
            type="submit"
            className={styles.submitButton}
            disabled={newRating === 0 || !newComment.trim()}
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className={styles.loginPrompt}>
          <Link to="/login">Log in</Link> to write a review.
        </p>
      )}

      <div className={styles.list}>
        {reviews.length === 0 && (
          <p className={styles.emptyMessage}>No reviews yet - be the first!</p>
        )}
        {reviews.map((review) => (
          <div key={review.id} className={styles.reviewItem}>
            <div className={styles.reviewHeader}>
              <span className={styles.author}>{review.author}</span>
              <span className={styles.date}>{review.date}</span>
            </div>
            <div className={styles.reviewStars}>
              {[1, 2, 3, 4, 5].map((star) =>
                star <= review.rating ? (
                  <StarIcon key={star} fontSize="inherit" />
                ) : (
                  <StarBorderIcon key={star} fontSize="inherit" />
                )
              )}
            </div>
            <p className={styles.comment}>{review.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductReviews;