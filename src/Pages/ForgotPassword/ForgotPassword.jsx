import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useToast } from '../../Context/ToastContext';
import {
  isValidEmail,
  isValidEgyptianPhone,
  isPasswordLongEnough,
  getPasswordStrength,
  maskContact,
} from '../../utils/Validators';
import styles from './ForgotPassword.module.css';

const OTP_LENGTH = 6;
const OTP_VALID_SECONDS = 5 * 60; // 5 minutes
const RESEND_COOLDOWN_SECONDS = 60;
const MAX_OTP_ATTEMPTS = 5;
const STRENGTH_COLORS = ['#A13D2E', '#A13D2E', '#C9924A', '#2E7D4F', '#2E7D4F', '#2E7D4F'];

// STEP 1: request -> STEP 2: verify -> STEP 3: reset -> STEP 4: done
function ForgotPassword() {
  const [step, setStep] = useState('request');
  const [contact, setContact] = useState('');
  const [contactError, setContactError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // TODO: in the real system, the OTP is generated and checked entirely on
  // the backend and NEVER sent to the client. This local state only exists
  // to simulate the flow until that API is ready - it must be removed once
  // real OTP verification (e.g. POST /api/auth/verify-otp) is wired up.
  const [demoOtp, setDemoOtp] = useState(null);
  const [otpDigits, setOtpDigits] = useState(Array(OTP_LENGTH).fill(''));
  const [otpError, setOtpError] = useState('');
  const [otpAttemptsLeft, setOtpAttemptsLeft] = useState(MAX_OTP_ATTEMPTS);
  const [secondsRemaining, setSecondsRemaining] = useState(OTP_VALID_SECONDS);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef([]);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetErrors, setResetErrors] = useState({});

  const { showSuccess } = useToast();
  const navigate = useNavigate();

  // Countdown for OTP expiry, only while on the verify step
  useEffect(() => {
    if (step !== 'verify') return undefined;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  // Countdown for the resend cooldown button
  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const generateAndSendOtp = useCallback(
    (targetContact) => {
      // TODO: replace with a real API call, e.g.:
      //   await axios.post('/api/auth/send-otp', { contact: targetContact });
      const code = String(Math.floor(100000 + Math.random() * 900000));
      setDemoOtp(code);
      setSecondsRemaining(OTP_VALID_SECONDS);
      setResendCooldown(RESEND_COOLDOWN_SECONDS);
      setOtpAttemptsLeft(MAX_OTP_ATTEMPTS);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      setOtpError('');

      // Demo-only: since there's no backend to actually deliver the SMS/email,
      // we surface the code via toast so the flow can be tested end to end.
      // Remove this once real delivery exists - a real OTP must never be
      // visible to the client that requested it.
      showSuccess(`Demo code sent: ${code} (this is shown only because there's no backend yet)`, 8000);
    },
    [showSuccess]
  );

  const handleRequestSubmit = async (event) => {
    event.preventDefault();
    const trimmed = contact.trim();

    if (!trimmed) {
      setContactError('Enter your email or phone number');
      return;
    }
    if (!isValidEmail(trimmed) && !isValidEgyptianPhone(trimmed)) {
      setContactError('Enter a valid email or Egyptian phone number');
      return;
    }
    setContactError('');

    setIsSubmitting(true);
    // TODO: replace with a real "does this account exist" check, e.g.:
    //   const response = await axios.post('/api/auth/check-account', { contact: trimmed });
    //   if (!response.data.exists) { show "no account found" error; return; }
    await new Promise((resolve) => setTimeout(resolve, 700));
    setIsSubmitting(false);

    generateAndSendOtp(trimmed);
    setStep('verify');
  };

  const handleOtpChange = (index, digit) => {
    if (!/^[0-9]?$/.test(digit)) return; // only allow a single numeric character

    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = digit;
      return next;
    });

    // Auto-advance to the next box once a digit is entered
    if (digit && index < OTP_LENGTH - 1) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index, event) => {
    // Backspace on an empty box moves focus back to the previous one
    if (event.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifySubmit = (event) => {
    event.preventDefault();
    const enteredCode = otpDigits.join('');

    if (enteredCode.length < OTP_LENGTH) {
      setOtpError('Enter all 6 digits');
      return;
    }

    if (secondsRemaining <= 0) {
      setOtpError('This code has expired. Request a new one.');
      return;
    }

    // TODO: replace with a real API call, e.g.:
    //   const response = await axios.post('/api/auth/verify-otp', { contact, code: enteredCode });
    //   if (!response.data.valid) { ... }
    if (enteredCode === demoOtp) {
      setOtpError('');
      setStep('reset');
    } else {
      const attemptsLeft = otpAttemptsLeft - 1;
      setOtpAttemptsLeft(attemptsLeft);
      setOtpDigits(Array(OTP_LENGTH).fill(''));
      otpInputRefs.current[0]?.focus();

      if (attemptsLeft <= 0) {
        setOtpError('Too many incorrect attempts. Request a new code.');
      } else {
        setOtpError(`Incorrect code. ${attemptsLeft} attempt(s) left.`);
      }
    }
  };

  const handleResend = () => {
    if (resendCooldown > 0) return;
    generateAndSendOtp(contact.trim());
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleResetSubmit = async (event) => {
    event.preventDefault();
    const errors = {};

    if (!newPassword) {
      errors.newPassword = 'Password is required';
    } else if (!isPasswordLongEnough(newPassword)) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (confirmPassword !== newPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setResetErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    // TODO: replace with a real API call, e.g.:
    //   await axios.post('/api/auth/reset-password', { contact, code: otpDigits.join(''), newPassword });
    // The backend is responsible for hashing the password before storing it -
    // the frontend should never attempt its own "encryption".
    await new Promise((resolve) => setTimeout(resolve, 900));
    setIsSubmitting(false);

    showSuccess('Password changed successfully. Please log in.');
    navigate('/login');
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* Step indicator */}
        <div className={styles.steps}>
          <span className={`${styles.stepDot} ${step !== 'request' ? styles.stepDotDone : styles.stepDotActive}`} />
          <span className={styles.stepLine} />
          <span
            className={`${styles.stepDot} ${
              step === 'reset' ? styles.stepDotDone : step === 'verify' ? styles.stepDotActive : ''
            }`}
          />
          <span className={styles.stepLine} />
          <span className={`${styles.stepDot} ${step === 'reset' ? styles.stepDotActive : ''}`} />
        </div>

        {step === 'request' && (
          <form onSubmit={handleRequestSubmit} noValidate>
            <h1 className={styles.title}>Forgot Password?</h1>
            <p className={styles.subtitle}>
              Enter your email or phone number and we'll send you a reset code.
            </p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="contact">
                Email or Phone Number
              </label>
              <input
                id="contact"
                type="text"
                className={styles.input}
                value={contact}
                onChange={(event) => setContact(event.target.value)}
                disabled={isSubmitting}
              />
              {contactError && <span className={styles.fieldError}>{contactError}</span>}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Checking...' : 'Send Code'}
            </button>

            <p className={styles.switchText}>
              Remembered your password? <Link to="/login">Login</Link>
            </p>
          </form>
        )}

        {step === 'verify' && (
          <form onSubmit={handleVerifySubmit} noValidate>
            <h1 className={styles.title}>Enter the Code</h1>
            <p className={styles.subtitle}>
              We sent a 6-digit code to <strong>{maskContact(contact)}</strong>
            </p>

            <div className={styles.otpRow}>
              {otpDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (otpInputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className={styles.otpBox}
                  value={digit}
                  onChange={(event) => handleOtpChange(index, event.target.value)}
                  onKeyDown={(event) => handleOtpKeyDown(index, event)}
                  disabled={otpAttemptsLeft <= 0}
                />
              ))}
            </div>

            {otpError && <span className={styles.fieldError}>{otpError}</span>}

            <div className={styles.otpMeta}>
              <span>
                {secondsRemaining > 0
                  ? `Code expires in ${Math.floor(secondsRemaining / 60)}:${String(
                      secondsRemaining % 60
                    ).padStart(2, '0')}`
                  : 'Code expired'}
              </span>
              <button
                type="button"
                className={styles.resendButton}
                onClick={handleResend}
                disabled={resendCooldown > 0}
              >
                {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
              </button>
            </div>

            <button
              type="submit"
              className={styles.submitButton}
              disabled={otpAttemptsLeft <= 0 || secondsRemaining <= 0}
            >
              Verify Code
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleResetSubmit} noValidate>
            <h1 className={styles.title}>Set New Password</h1>
            <p className={styles.subtitle}>Choose a new password for your account.</p>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="new-password">
                New Password
              </label>
              <input
                id="new-password"
                type="password"
                className={styles.input}
                value={newPassword}
                onChange={(event) => setNewPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {newPassword.length > 0 && (
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
              {resetErrors.newPassword && (
                <span className={styles.fieldError}>{resetErrors.newPassword}</span>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="confirm-new-password">
                Confirm Password
              </label>
              <input
                id="confirm-new-password"
                type="password"
                className={styles.input}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {resetErrors.confirmPassword && (
                <span className={styles.fieldError}>{resetErrors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save New Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;