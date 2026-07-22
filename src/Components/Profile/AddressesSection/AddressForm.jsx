import { useState } from 'react';
import { isValidEgyptianPhone } from '../../../utils/Validators';
import { ADDRESS_LABEL_OPTIONS } from '../../../utils/addressLabels';
import styles from './AddressForm.module.css';

const EMPTY_ADDRESS = {
  label: 'home',
  fullName: '',
  phone: '',
  city: '',
  area: '',
  street: '',
  building: '',
  apartment: '',
  notes: '',
  isDefault: false,
};

function validate(values) {
  const errors = {};
  if (!values.fullName.trim()) errors.fullName = 'الاسم مطلوب';
  if (!isValidEgyptianPhone(values.phone)) errors.phone = 'رقم هاتف مصري غير صحيح';
  if (!values.city.trim()) errors.city = 'المدينة مطلوبة';
  if (!values.area.trim()) errors.area = 'المنطقة مطلوبة';
  if (!values.street.trim()) errors.street = 'الشارع مطلوب';
  return errors;
}

function AddressForm({ initialAddress, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialAddress || EMPTY_ADDRESS);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const setField = (field) => (event) => {
    const value = field === 'isDefault' ? event.target.checked : event.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    await onSubmit(values);
    setIsSaving(false);
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.labelPicker}>
        {ADDRESS_LABEL_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.labelOption} ${
              values.label === option.value ? styles.labelOptionActive : ''
            }`}
            onClick={() => setValues((prev) => ({ ...prev, label: option.value }))}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>الاسم بالكامل</label>
          <input
            className={styles.input}
            value={values.fullName}
            onChange={setField('fullName')}
            disabled={isSaving}
          />
          {errors.fullName && <span className={styles.fieldError}>{errors.fullName}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>رقم الهاتف</label>
          <input
            type="tel"
            className={styles.input}
            value={values.phone}
            onChange={setField('phone')}
            placeholder="01xxxxxxxxx"
            disabled={isSaving}
          />
          {errors.phone && <span className={styles.fieldError}>{errors.phone}</span>}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>المدينة</label>
          <input
            className={styles.input}
            value={values.city}
            onChange={setField('city')}
            disabled={isSaving}
          />
          {errors.city && <span className={styles.fieldError}>{errors.city}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>المنطقة</label>
          <input
            className={styles.input}
            value={values.area}
            onChange={setField('area')}
            disabled={isSaving}
          />
          {errors.area && <span className={styles.fieldError}>{errors.area}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>الشارع</label>
        <input
          className={styles.input}
          value={values.street}
          onChange={setField('street')}
          disabled={isSaving}
        />
        {errors.street && <span className={styles.fieldError}>{errors.street}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.fieldLabel}>المبنى (اختياري)</label>
          <input
            className={styles.input}
            value={values.building}
            onChange={setField('building')}
            disabled={isSaving}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>الشقة (اختياري)</label>
          <input
            className={styles.input}
            value={values.apartment}
            onChange={setField('apartment')}
            disabled={isSaving}
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.fieldLabel}>ملاحظات (اختياري)</label>
        <input
          className={styles.input}
          value={values.notes}
          onChange={setField('notes')}
          disabled={isSaving}
        />
      </div>

      <label className={styles.checkboxRow}>
        <input type="checkbox" checked={values.isDefault} onChange={setField('isDefault')} />
        اجعله العنوان الافتراضي
      </label>

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
          disabled={isSaving}
        >
          إلغاء
        </button>
        <button type="submit" className={styles.saveButton} disabled={isSaving}>
          {isSaving ? 'جاري الحفظ...' : 'حفظ العنوان'}
        </button>
      </div>
    </form>
  );
}

export default AddressForm;