import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import {
  isValidEmail,
  isPasswordLongEnough,
  getPasswordStrength,
} from '../../utils/Validators';
import styles from './SecuritySection.module.css';

const STRENGTH_COLORS = ['#A13D2E', '#A13D2E', '#C9924A', '#2E7D4F', '#2E7D4F', '#2E7D4F'];

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const { showSuccess, showError } = useToast();

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!currentPassword) nextErrors.currentPassword = 'Enter your current password';
    if (!isPasswordLongEnough(newPassword)) {
      nextErrors.newPassword = 'Password must be at least 8 characters';
    }
    if (confirmPassword !== newPassword) {
      nextErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setIsSaving(true);
    // TODO: replace with a real API call, e.g.:
    //   await axios.post('/api/users/me/change-password', { currentPassword, newPassword });
    // The backend must verify currentPassword and hash newPassword before storing it.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);

    showSuccess('Password changed successfully');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3 className={styles.subTitle}>Change Password</h3>

      <div className={styles.field}>
        <label className={styles.label}>Current Password</label>
        <input
          type="password"
          className={styles.input}
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          disabled={isSaving}
        />
        {errors.currentPassword && (
          <span className={styles.fieldError}>{errors.currentPassword}</span>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>New Password</label>
        <input
          type="password"
          className={styles.input}
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          disabled={isSaving}
        />
        {newPassword.length > 0 && (
          <div className={styles.strengthMeter}>
            <div className={styles.strengthTrack}>
              <div
                className={styles.strengthFill}
                style={{
                  width: `${(strength.score / 5) * 100}%`,
                  backgroundColor: STRENGTH_COLORS[strength.score],
                }}
              />
            </div>
            <span style={{ color: STRENGTH_COLORS[strength.score] }}>{strength.label}</span>
          </div>
        )}
        {errors.newPassword && <span className={styles.fieldError}>{errors.newPassword}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Confirm New Password</label>
        <input
          type="password"
          className={styles.input}
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          disabled={isSaving}
        />
        {errors.confirmPassword && (
          <span className={styles.fieldError}>{errors.confirmPassword}</span>
        )}
      </div>

      <button type="submit" className={styles.actionButton} disabled={isSaving}>
        {isSaving ? 'Saving...' : 'Update Password'}
      </button>
    </form>
  );
}

function ChangeEmailForm() {
  const [step, setStep] = useState('request'); // 'request' | 'confirm'
  const [newEmail, setNewEmail] = useState('');
  const [code, setCode] = useState('');
  const [demoCode, setDemoCode] = useState(null);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { updateUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    if (!isValidEmail(newEmail)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setIsSaving(true);

    // TODO: replace with a real API call, e.g.:
    //   await axios.post('/api/users/me/change-email/request', { newEmail });
    // The real code must be generated and verified server-side only - it
    // is shown here via toast purely because there's no backend yet.
    await new Promise((resolve) => setTimeout(resolve, 700));
    const generatedCode = String(Math.floor(100000 + Math.random() * 900000));
    setDemoCode(generatedCode);
    setIsSaving(false);
    showSuccess(`Demo confirmation code: ${generatedCode} (shown only - no backend yet)`, 8000);
    setStep('confirm');
  };

  const handleConfirmSubmit = async (event) => {
    event.preventDefault();
    if (code !== demoCode) {
      setError('Incorrect confirmation code');
      return;
    }
    setError('');
    setIsSaving(true);
    // TODO: replace with a real API call, e.g.:
    //   await axios.post('/api/users/me/change-email/confirm', { newEmail, code });
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSaving(false);

    updateUser({ email: newEmail });
    showSuccess('Email address updated successfully');
    setStep('request');
    setNewEmail('');
    setCode('');
  };

  return (
    <div className={styles.form}>
      <h3 className={styles.subTitle}>Change Email</h3>

      {step === 'request' ? (
        <form onSubmit={handleRequestSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>New Email Address</label>
            <input
              type="email"
              className={styles.input}
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              disabled={isSaving}
            />
            {error && <span className={styles.fieldError}>{error}</span>}
          </div>
          <button type="submit" className={styles.actionButton} disabled={isSaving}>
            {isSaving ? 'Sending...' : 'Send Confirmation Code'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleConfirmSubmit}>
          <p className={styles.helperText}>
            Enter the code sent to confirm changing your email to <strong>{newEmail}</strong>.
          </p>
          <div className={styles.field}>
            <label className={styles.label}>Confirmation Code</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              className={styles.input}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              disabled={isSaving}
            />
            {error && <span className={styles.fieldError}>{error}</span>}
          </div>
          <button type="submit" className={styles.actionButton} disabled={isSaving}>
            {isSaving ? 'Confirming...' : 'Confirm Email Change'}
          </button>
        </form>
      )}
    </div>
  );
}

function LogoutAllDevices() {
  const { logout } = useAuth();
  const { showSuccess } = useToast();
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = () => {
    // TODO: once a real backend exists, this should call something like
    //   POST /api/auth/logout-all  (invalidates every session/token, not just this one)
    logout();
    showSuccess('Logged out from all devices');
    navigate('/');
  };

  return (
    <div className={styles.dangerZone}>
      <h3 className={styles.subTitle}>Logout From All Devices</h3>
      <p className={styles.helperText}>
        This will sign you out everywhere, including this device.
      </p>
      {!isConfirming ? (
        <button
          type="button"
          className={styles.dangerButton}
          onClick={() => setIsConfirming(true)}
        >
          Logout Everywhere
        </button>
      ) : (
        <div className={styles.confirmRow}>
          <span>Are you sure?</span>
          <button type="button" className={styles.dangerButton} onClick={handleConfirm}>
            Yes, Logout Everywhere
          </button>
          <button
            type="button"
            className={styles.cancelLink}
            onClick={() => setIsConfirming(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

function SecuritySection() {
  return (
    <div className={styles.section}>
      <h2 className={styles.title}>Security</h2>
      <ChangePasswordForm />
      <ChangeEmailForm />
      <LogoutAllDevices />
    </div>
  );
}

export default SecuritySection;