import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error"
import { useToast } from '../../Context/ToastContext';
import styles from './ToastContainer.module.css';

// Mounted once near the root of the app (see App.js). Reads the current
// toast list from context and renders each one - no page needs to render
// anything itself, just call showSuccess()/showError() from useToast().
function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.success : styles.error
          }`}
          onClick={() => removeToast(toast.id)}
        >
          {toast.type === 'success' ? (
            <CheckCircleIcon fontSize="small" />
          ) : (
            <ErrorIcon fontSize="small" />
          )}
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;