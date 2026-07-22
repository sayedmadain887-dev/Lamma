import { getAddressLabelText, formatAddressDetails } from '../../utils/addressLabels';
import styles from './AddressOption.module.css';

function AddressOption({ address, isSelected, onSelect }) {
  return (
    <label className={`${styles.option} ${isSelected ? styles.optionSelected : ''}`}>
      <input
        type="radio"
        name="shipping-address"
        checked={isSelected}
        onChange={() => onSelect(address.id)}
        className={styles.radio}
      />
      <div className={styles.details}>
        <div className={styles.headerRow}>
          <span className={styles.label}>{getAddressLabelText(address.label)}</span>
          {address.isDefault && <span className={styles.defaultBadge}>Default</span>}
        </div>
        <span className={styles.name}>{address.fullName} — {address.phone}</span>
        <span className={styles.line}>{formatAddressDetails(address)}, {address.area}, {address.city}</span>
      </div>
    </label>
  );
}

export default AddressOption;