import { useState } from 'react';
import { useProducts } from '../../../Context/ProductsContext';
import { useToast } from '../../../Context/ToastContext';
import categories from '../../../data/categories';
import styles from './ProductForm.module.css';

const EMPTY_PRODUCT = {
  name: '',
  image: '',
  price: '',
  category: categories[0]?.slug || '',
  quantity: '',
  description: '',
  discountPercent: 0,
};

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = 'Name is required';
  if (!values.image.trim()) errors.image = 'Image URL is required';
  if (!values.price || Number(values.price) <= 0) errors.price = 'Enter a valid price';
  if (values.quantity === '' || Number(values.quantity) < 0) errors.quantity = 'Enter a valid quantity';
  return errors;
}

function ProductForm({ initialProduct, onClose }) {
  const { addProduct, updateProduct, discountOptions } = useProducts();
  const { showSuccess } = useToast();
  const [values, setValues] = useState(initialProduct || EMPTY_PRODUCT);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const setField = (field) => (event) => {
    setValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    const payload = {
      ...values,
      price: Number(values.price),
      quantity: Number(values.quantity),
      discountPercent: Number(values.discountPercent),
      rating: values.rating || 0,
      inStock: Number(values.quantity) > 0,
    };

    if (initialProduct) {
      updateProduct(initialProduct.id, payload);
      showSuccess('Product updated');
    } else {
      addProduct(payload);
      showSuccess('Product added');
    }
    setIsSaving(false);
    onClose();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.input} value={values.name} onChange={setField('name')} disabled={isSaving} />
          {errors.name && <span className={styles.fieldError}>{errors.name}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Image URL</label>
          <input className={styles.input} value={values.image} onChange={setField('image')} disabled={isSaving} />
          {errors.image && <span className={styles.fieldError}>{errors.image}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Price (EGP)</label>
          <input type="number" className={styles.input} value={values.price} onChange={setField('price')} disabled={isSaving} />
          {errors.price && <span className={styles.fieldError}>{errors.price}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Quantity in Stock</label>
          <input type="number" className={styles.input} value={values.quantity} onChange={setField('quantity')} disabled={isSaving} />
          {errors.quantity && <span className={styles.fieldError}>{errors.quantity}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Category</label>
          <select className={styles.input} value={values.category} onChange={setField('category')} disabled={isSaving}>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>{category.label}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>Discount</label>
          <select className={styles.input} value={values.discountPercent} onChange={setField('discountPercent')} disabled={isSaving}>
            {discountOptions.map((option) => (
              <option key={option} value={option}>{option === 0 ? 'No discount' : `${option}%`}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>Description</label>
        <textarea className={styles.textarea} rows={3} value={values.description} onChange={setField('description')} disabled={isSaving} />
      </div>

      <div className={styles.formActions}>
        <button type="button" className={styles.cancelButton} onClick={onClose} disabled={isSaving}>Cancel</button>
        <button type="submit" className={styles.saveButton} disabled={isSaving}>
          {isSaving ? 'Saving...' : initialProduct ? 'Save Changes' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}

export default ProductForm;