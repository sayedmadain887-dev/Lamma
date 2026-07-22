// Shared validation helpers used across auth forms (Login, Register, Forgot Password).
// Kept framework-agnostic (plain functions) so they're easy to unit test later
// and easy to swap for real backend validation once the API exists.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Egyptian mobile numbers: 11 digits, starting with 010, 011, 012, or 015
const EGYPT_PHONE_REGEX = /^01[0125][0-9]{8}$/;

export function isValidEmail(email) {
  return EMAIL_REGEX.test(String(email).trim());
}

export function isValidEgyptianPhone(phone) {
  return EGYPT_PHONE_REGEX.test(String(phone).trim());
}

export function isPasswordLongEnough(password, minLength = 8) {
  return typeof password === 'string' && password.length >= minLength;
}

/**
 * getPasswordStrength
 * Returns a score from 0 (very weak) to 4 (very strong) plus a label,
 * based on length and character variety. This is a simple heuristic,
 * not a cryptographic measure - good enough to guide the user visually.
 */
export function getPasswordStrength(password) {
  if (!password) {
    return { score: 0, label: 'Too short' };
  }

  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const labels = ['Too short', 'Weak', 'Fair', 'Good', 'Strong', 'Very strong'];

  return { score, label: labels[score] };
}

/**
 * maskContact
 * Partially hides an email or phone number for display, e.g. when telling
 * the user "we sent a code to s***@gmail.com" without exposing it fully.
 */
export function maskContact(value) {
  const trimmed = String(value).trim();

  if (trimmed.includes('@')) {
    const [name, domain] = trimmed.split('@');
    const visible = name.slice(0, 2);
    return `${visible}${'*'.repeat(Math.max(name.length - 2, 1))}@${domain}`;
  }

  // Treat as a phone number: show first 3 and last 2 digits only
  if (trimmed.length <= 5) return trimmed;
  return `${trimmed.slice(0, 3)}${'*'.repeat(trimmed.length - 5)}${trimmed.slice(-2)}`;
}