import { useState } from 'react';
import { useAuth } from '../../../Context/AuthContext';
import { useToast } from '../../../Context/ToastContext';
import { isValidEgyptianPhone } from '../../../utils/Validators';
import AvatarPicker from '../AvatarPicker/AvatarPicker';
import styles from './AccountInfoSection.module.css';

function AccountInfoSection() {
  const { user, updateUser } = useAuth();
  const { showSuccess } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleAvatarChange = (avatar) => {
    updateUser({ avatar });
    // TODO: once the backend exists, this should also PATCH /api/users/me
    // with the new avatar before/while updating local state.
  };

  const handleCancel = () => {
    setName(user?.name || '');
    setPhone(user?.phone || '');
    setFieldErrors({});
    setIsEditing(false);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    const errors = {};
    if (!name.trim()) errors.name = 'Name is required';
    if (phone.trim() && !isValidEgyptianPhone(phone)) {
      errors.phone = 'Enter a valid Egyptian phone number';
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSaving(true);
    // TODO: replace with a real API call, e.g.:
    //   await axios.patch('/api/users/me', { name, phone });
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsSaving(false);

    updateUser({ name: name.trim(), phone: phone.trim() });
    showSuccess('Profile updated successfully');
    setIsEditing(false);
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Account Info</h2>

      <AvatarPicker avatar={user?.avatar} name={user?.name} onChange={handleAvatarChange} />

      {!isEditing ? (
        <div className={styles.readView}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Name</span>
            <span className={styles.infoValue}>{user?.name || '-'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user?.email || '-'}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Phone</span>
            <span className={styles.infoValue}>{user?.phone || 'Not set'}</span>
          </div>

          <button
            type="button"
            className={styles.editButton}
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSave}>
          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-name">
              Name
            </label>
            <input
              id="profile-name"
              type="text"
              className={styles.input}
              value={name}
              onChange={(event) => setName(event.target.value)}
              disabled={isSaving}
            />
            {fieldErrors.name && <span className={styles.fieldError}>{fieldErrors.name}</span>}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="profile-phone">
              Phone
            </label>
            <input
              id="profile-phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="01xxxxxxxxx"
              disabled={isSaving}
            />
            {fieldErrors.phone && <span className={styles.fieldError}>{fieldErrors.phone}</span>}
          </div>

          <p className={styles.emailNote}>
            To change your email, go to the Security tab.
          </p>

          <div className={styles.formActions}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button type="submit" className={styles.saveButton} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default AccountInfoSection;