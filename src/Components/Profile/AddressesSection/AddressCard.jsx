import { useState } from 'react';
import { getAddressLabelText, formatAddressDetails } from '../../../utils/addressLabels';
import styles from './AddressCard.module.css';

function AddressCard({ address, onEdit, onDelete, onSetDefault }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.labelGroup}>
          <span className={styles.label}>{getAddressLabelText(address.label)}</span>
          {address.isDefault && <span className={styles.defaultBadge}>الافتراضي</span>}
        </div>
        <button type="button" className={styles.editLink} onClick={() => onEdit(address)}>
          تعديل
        </button>
      </div>

      <p className={styles.name}>{address.fullName}</p>
      <p className={styles.phone}>{address.phone}</p>
      <p className={styles.details}>{formatAddressDetails(address)}</p>
      {address.notes && <p className={styles.notes}>{address.notes}</p>}

      <div className={styles.actions}>
        {!address.isDefault && (
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => onSetDefault(address.id)}
          >
            اجعله الافتراضي
          </button>
        )}

        {!isConfirmingDelete ? (
          <button
            type="button"
            className={styles.deleteLink}
            onClick={() => setIsConfirmingDelete(true)}
          >
            حذف
          </button>
        ) : (
          <div className={styles.confirmRow}>
            <span>تأكيد الحذف؟</span>
            <button
              type="button"
              className={styles.deleteLink}
              onClick={() => onDelete(address.id)}
            >
              نعم، احذف
            </button>
            <button
              type="button"
              className={styles.cancelLink}
              onClick={() => setIsConfirmingDelete(false)}
            >
              إلغاء
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddressCard;