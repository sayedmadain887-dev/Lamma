import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import {
  isValidEmail,
  isValidEgyptianPhone,
  isPasswordLongEnough,
  getPasswordStrength,
} from '../../utils/Validators';
import styles from './Register.module.css';

const STRENGTH_COLORS = ['#A13D2E', '#A13D2E', '#C9924A', '#2E7D4F', '#2E7D4F', '#2E7D4F'];

function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  const passwordStrength = getPasswordStrength(password);

  const validate = () => {
    const errors = {};

    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!isValidEgyptianPhone(phone)) {
      errors.phone = 'Enter a valid Egyptian phone number (e.g. 010xxxxxxxx)';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (!isPasswordLongEnough(password)) {
      errors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (!agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the Terms and Conditions';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // TODO: replace with a real API call once the backend exists, e.g.:
  //   const response = await axios.post('/api/auth/register', { fullName, email, phone, password });
  //   return { success: true, user: response.data.user };
  // The demo email below simulates an "already registered" conflict so the
  // error path can be tested without a real backend.
  const fakeRegisterRequest = (submittedEmail) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (submittedEmail === 'demo@lamma.com') {
          resolve({ success: false, reason: 'Email is already registered' });
        } else {
          resolve({ success: true, user: { name: fullName.trim(), email: submittedEmail } });
        }
      }, 900);
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await fakeRegisterRequest(email.trim());
    setIsSubmitting(false);

    if (result.success) {
      login(result.user, 'fake-demo-token');
      showSuccess('Account created successfully!');
      navigate('/');
    } else {
      showError(result.reason || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.sidePanel}>
        <div className={styles.sidePanelContent}>
          <span className={styles.sidePanelLogo}>Lamma</span>
          <p className={styles.sidePanelTagline}>
            Create an account and start shopping smarter today.
          </p>
        </div>
      </div>

      <div className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Join Lamma in a few seconds</p>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-name">
              Full Name
            </label>
            <input
              id="register-name"
              type="text"
              className={styles.input}
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              disabled={isSubmitting}
              autoComplete="name"
            />
            {fieldErrors.fullName && (
              <span className={styles.fieldError}>{fieldErrors.fullName}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-email">
              Email
            </label>
            <input
              id="register-email"
              type="email"
              className={styles.input}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
            />
            {fieldErrors.email && (
              <span className={styles.fieldError}>{fieldErrors.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-phone">
              Phone Number
            </label>
            <input
              id="register-phone"
              type="tel"
              className={styles.input}
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isSubmitting}
              placeholder="01xxxxxxxxx"
              autoComplete="tel"
            />
            {fieldErrors.phone && (
              <span className={styles.fieldError}>{fieldErrors.phone}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="register-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>

            {password.length > 0 && (
              <div className={styles.strengthMeter}>
                <div className={styles.strengthBarTrack}>
                  <div
                    className={styles.strengthBarFill}
                    style={{
                      width: `${(passwordStrength.score / 5) * 100}%`,
                      backgroundColor: STRENGTH_COLORS[passwordStrength.score],
                    }}
                  />
                </div>
                <span
                  className={styles.strengthLabel}
                  style={{ color: STRENGTH_COLORS[passwordStrength.score] }}
                >
                  {passwordStrength.label}
                </span>
              </div>
            )}

            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="register-confirm-password">
              Confirm Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="register-confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                className={styles.input}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.togglePassword}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? (
                  <VisibilityOffIcon fontSize="small" />
                ) : (
                  <VisibilityIcon fontSize="small" />
                )}
              </button>
            </div>
            {fieldErrors.confirmPassword && (
              <span className={styles.fieldError}>{fieldErrors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.field}>
            <label className={styles.termsRow}>
              <input
                type="checkbox"
                checked={agreeToTerms}
                onChange={(event) => setAgreeToTerms(event.target.checked)}
              />
              <span>I agree to the Terms and Conditions</span>
            </label>
            {fieldErrors.agreeToTerms && (
              <span className={styles.fieldError}>{fieldErrors.agreeToTerms}</span>
            )}
          </div>

          <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <button
            type="button"
            className={styles.googleButton}
            onClick={() => showError('Google Login is coming soon.')}
          >
            Continue with Google
          </button>

          <p className={styles.switchText}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;