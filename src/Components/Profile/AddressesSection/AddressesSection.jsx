import { useState } from 'react';
import { useAddresses } from '../../../Context/Addresses';
import { useToast } from '../../../Context/ToastContext';
import AddressCard from './AddressCard';
import AddressForm from './AddressForm';
import styles from './AddressesSection.module.css';

// 'closed' | 'add' | { mode: 'edit', address }
function AddressesSection() {
  const { addresses, isLoading, addAddress, updateAddress, deleteAddress, setDefaultAddress } =
    useAddresses();
  const { showSuccess } = useToast();
  const [formState, setFormState] = useState('closed');

  const handleAdd = async (values) => {
    addAddress(values);
    showSuccess('تم إضافة العنوان بنجاح');
    setFormState('closed');
  };

  const handleEdit = async (values) => {
    updateAddress(formState.address.id, values);
    showSuccess('تم تعديل العنوان بنجاح');
    setFormState('closed');
  };

  const handleDelete = (addressId) => {
    deleteAddress(addressId);
    showSuccess('تم حذف العنوان');
  };

  const handleSetDefault = (addressId) => {
    setDefaultAddress(addressId);
    showSuccess('تم تعيين العنوان الافتراضي');
  };

  return (
    <div className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>العناوين</h2>
        {formState === 'closed' && (
          <button type="button" className={styles.addButton} onClick={() => setFormState('add')}>
            + إضافة عنوان
          </button>
        )}
      </div>

      {formState === 'add' && (
        <AddressForm onSubmit={handleAdd} onCancel={() => setFormState('closed')} />
      )}

      {formState !== 'closed' && formState.mode === 'edit' && (
        <AddressForm
          initialAddress={formState.address}
          onSubmit={handleEdit}
          onCancel={() => setFormState('closed')}
        />
      )}

      {isLoading ? (
        <p className={styles.emptyState}>جاري تحميل العناوين...</p>
      ) : addresses.length === 0 && formState === 'closed' ? (
        <p className={styles.emptyState}>لا يوجد عناوين محفوظة بعد</p>
      ) : (
        <div className={styles.list}>
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(addr) => setFormState({ mode: 'edit', address: addr })}
              onDelete={handleDelete}
              onSetDefault={handleSetDefault}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AddressesSection;