import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../../Context/AuthContext';
import { useToast } from '../../Context/ToastContext';
import useLoginAttempts from '../../hook/useLoginAttempts';
import { isValidEmail } from '../../utils/Validators';
import styles from './Login.module.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { showSuccess, showError } = useToast();
  const navigate = useNavigate();

  // Tracks failed attempts for whatever email is currently typed in,
  // and enforces the 5-attempts / 5-minute lockout.
  const { isLocked, remainingSeconds, attemptsLeft, recordFailedAttempt, resetAttempts } =
    useLoginAttempts(email.trim().toLowerCase());

  const validate = () => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    }
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // TODO: replace this whole block with a real API call once the backend
  // exists, e.g.:
  //   const response = await axios.post('/api/auth/login', { email, password });
  //   return { success: true, user: response.data.user, token: response.data.token };
  // For now this simulates a network call so the UI (loading, success,
  // failure, lockout) can be built and tested end to end.
 const fakeLoginRequest = (submittedEmail, submittedPassword) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const DEMO_EMAIL = 'demo@lamma.com';
      const DEMO_PASSWORD = 'password123';
      const ADMIN_EMAIL = 'admin@lamma.com';
      const ADMIN_PASSWORD = 'admin123';

      if (submittedEmail === ADMIN_EMAIL && submittedPassword === ADMIN_PASSWORD) {
        resolve({ success: true, user: { name: 'Admin', email: submittedEmail, isAdmin: true } });
      } else if (submittedEmail === DEMO_EMAIL && submittedPassword === DEMO_PASSWORD) {
        resolve({ success: true, user: { name: 'Demo User', email: submittedEmail, isAdmin: false } });
      } else {
        resolve({ success: false });
      }
    }, 900);
  });
};

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLocked) {
      showError(`Too many attempts. Try again in ${remainingSeconds}s.`);
      return;
    }

    if (!validate()) return;

    setIsSubmitting(true);
    const result = await fakeLoginRequest(email.trim(), password);
    setIsSubmitting(false);

    if (result.success) {
      resetAttempts();
      login(result.user, 'fake-demo-token');
      showSuccess('Logged in successfully!');
      navigate('/');
    } else {
      recordFailedAttempt();
      const attemptsAfterThis = attemptsLeft - 1;
      if (attemptsAfterThis <= 0) {
        showError('Too many failed attempts. Account locked for 5 minutes.');
      } else {
        showError(`Incorrect email or password. ${attemptsAfterThis} attempt(s) left.`);
      }
    }
  };

  return (
    <div className={styles.page}>
     <div className={styles.sidePanel}>
  <div className={styles.sidePanelContent}>
    <span className={styles.sidePanelLogo}>Lamma</span>
    <p className={styles.sidePanelTagline}>Your fastest way to everything.</p>
  </div>
</div>

      <div className={styles.formPanel}>
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Log in to continue to Lamma</p>

          {isLocked && (
            <div className={styles.lockoutNotice}>
              Too many attempts. Try again in {remainingSeconds}s.
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.label} htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            <label className={styles.label} htmlFor="login-password">
              Password
            </label>
            <div className={styles.passwordWrapper}>
              <input
                id="login-password"
                type={showPassword ? 'text' : 'password'}
                className={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="current-password"
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
            {fieldErrors.password && (
              <span className={styles.fieldError}>{fieldErrors.password}</span>
            )}
          </div>

          <div className={styles.optionsRow}>
            <label className={styles.rememberMe}>
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) => setRememberMe(event.target.checked)}
              />
              <span>Remember Me</span>
            </label>

            <Link to="/forgot-password" className={styles.forgotLink}>
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={isSubmitting || isLocked}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          <button
            type="button"
            className={styles.googleButton}
            onClick={() => showError('Google Login is coming soon.')}
          >
            Continue with Google
          </button>

          <p className={styles.switchText}>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;