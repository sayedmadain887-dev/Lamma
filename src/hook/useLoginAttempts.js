import { useState, useEffect, useCallback } from 'react';

const MAX_ATTEMPTS = 9;
const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutes
const STORAGE_PREFIX = 'lamma_login_attempts_';

// Why localStorage instead of component state: if this lived only in
// React state, refreshing the page would silently reset the lockout,
// letting someone bypass it. localStorage persists it per browser.
function readAttempts(email) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + email);
    if (!raw) return { count: 0, lockedUntil: null };
    return JSON.parse(raw);
  } catch (error) {
    // Corrupted or inaccessible storage shouldn't crash the login page -
    // fail open to "no attempts recorded" rather than blocking the user forever.
    return { count: 0, lockedUntil: null };
  }
}

function writeAttempts(email, data) {
  try {
    localStorage.setItem(STORAGE_PREFIX + email, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to persist login attempt data:', error);
  }
}

/**
 * useLoginAttempts
 * Call recordFailedAttempt(email) after every failed login.
 * Call resetAttempts(email) after a successful login.
 * Read `isLocked` / `remainingSeconds` / `attemptsLeft` to drive the UI.
 */
function useLoginAttempts(email) {
  const [status, setStatus] = useState({
    isLocked: false,
    remainingSeconds: 0,
    attemptsLeft: MAX_ATTEMPTS,
  });

  const recalculate = useCallback(() => {
    if (!email) {
      setStatus({ isLocked: false, remainingSeconds: 0, attemptsLeft: MAX_ATTEMPTS });
      return;
    }

    const { count, lockedUntil } = readAttempts(email);
    const now = Date.now();

    if (lockedUntil && lockedUntil > now) {
      setStatus({
        isLocked: true,
        remainingSeconds: Math.ceil((lockedUntil - now) / 1000),
        attemptsLeft: 0,
      });
    } else {
      // Lock has expired (or never existed) - clear it so old data doesn't linger
      if (lockedUntil) {
        writeAttempts(email, { count: 0, lockedUntil: null });
      }
      setStatus({
        isLocked: false,
        remainingSeconds: 0,
        attemptsLeft: Math.max(MAX_ATTEMPTS - count, 0),
      });
    }
  }, [email]);

  useEffect(() => {
    recalculate();
    // Tick every second while a lockout is active, so the countdown updates live
    const timer = setInterval(recalculate, 1000);
    return () => clearInterval(timer);
  }, [recalculate]);

  const recordFailedAttempt = useCallback(() => {
    if (!email) return;
    const { count } = readAttempts(email);
    const newCount = count + 1;

    if (newCount >= MAX_ATTEMPTS) {
      writeAttempts(email, {
        count: newCount,
        lockedUntil: Date.now() + LOCKOUT_DURATION_MS,
      });
    } else {
      writeAttempts(email, { count: newCount, lockedUntil: null });
    }

    recalculate();
  }, [email, recalculate]);

  const resetAttempts = useCallback(() => {
    if (!email) return;
    writeAttempts(email, { count: 0, lockedUntil: null });
    recalculate();
  }, [email, recalculate]);

  return { ...status, recordFailedAttempt, resetAttempts };
}

export default useLoginAttempts;