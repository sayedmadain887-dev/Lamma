import { useState } from 'react';
import { useProducts } from '../../../Context/ProductsContext';
import { useToast } from '../../../Context/ToastContext';
import { getStockStatus } from '../../../utils/productHelpers';
import ProductForm from './ProductForm';
import styles from './AdminProducts.module.css';

function AdminProducts() {
  const { products, isLoading, deleteProduct } = useProducts();
  const { showSuccess } = useToast();
  const [formState, setFormState] = useState('closed'); // 'closed' | 'add' | { mode: 'edit', product }
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const handleDelete = (productId) => {
    deleteProduct(productId);
    setConfirmDeleteId(null);
    showSuccess('Product deleted');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Products</h1>
        {formState === 'closed' && (
          <button type="button" className={styles.addButton} onClick={() => setFormState('add')}>
            + Add Product
          </button>
        )}
      </div>

      {formState === 'add' && (
        <ProductForm onClose={() => setFormState('closed')} />
      )}
      {formState !== 'closed' && formState.mode === 'edit' && (
        <ProductForm initialProduct={formState.product} onClose={() => setFormState('closed')} />
      )}

      {isLoading ? (
        <p className={styles.emptyState}>Loading products...</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stockStatus = getStockStatus(product.quantity);
              return (
                <tr key={product.id}>
                  <td><img src={product.image} alt={product.name} className={styles.thumb} /></td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.price} EGP</td>
                  <td>{product.discountPercent > 0 ? `${product.discountPercent}%` : '—'}</td>
                  <td>
                    <span className={`${styles.stockBadge} ${styles[`stock_${stockStatus}`]}`}>
                      {product.quantity} in stock
                    </span>
                  </td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.editLink}
                      onClick={() => setFormState({ mode: 'edit', product })}
                    >
                      Edit
                    </button>
                    {confirmDeleteId === product.id ? (
                      <>
                        <button type="button" className={styles.deleteLink} onClick={() => handleDelete(product.id)}>
                          Confirm
                        </button>
                        <button type="button" className={styles.cancelLink} onClick={() => setConfirmDeleteId(null)}>
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button type="button" className={styles.deleteLink} onClick={() => setConfirmDeleteId(product.id)}>
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminProducts;