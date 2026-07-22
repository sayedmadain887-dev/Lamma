import { useState, useEffect } from 'react';

/**
 * useDebounce
 * Returns a debounced version of `value` that only updates after `delay` ms
 * have passed without `value` changing.
 *
 * Why: without this, every keystroke in the search bar would trigger an
 * API call. With many users typing at once, that creates unnecessary load
 * on the backend. Debouncing waits until the user pauses typing.
 *
 * @param {*} value - the fast-changing value (e.g. search input text)
 * @param {number} delay - wait time in ms before updating (default 400ms)
 */
function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup: if value changes again before delay finishes,
    // cancel the previous timer so we don't set stale state.
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default useDebounce;