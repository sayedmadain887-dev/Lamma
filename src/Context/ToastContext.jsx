import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const ToastContext = createContext(null);

const DEFAULT_DURATION_MS = 4000;
let nextId = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    (type, message, duration = DEFAULT_DURATION_MS) => {
      const id = nextId++;
      setToasts((prev) => [...prev, { id, type, message }]);

      // Auto-dismiss after `duration` ms
      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const showSuccess = useCallback(
    (message, duration) => showToast('success', message, duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => showToast('error', message, duration),
    [showToast]
  );

  const value = useMemo(
    () => ({ toasts, showSuccess, showError, removeToast }),
    [toasts, showSuccess, showError, removeToast]
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used inside a <ToastProvider>');
  }
  return context;
}