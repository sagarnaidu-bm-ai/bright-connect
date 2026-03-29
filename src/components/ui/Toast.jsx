import React from 'react';
import styles from './Toast.module.css';

const ICONS = {
  success: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#2DC76D" />
      <path d="M5 8l2 2 4-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#E24B4A" />
      <path d="M10 6L6 10M6 6l4 4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" fill="#378ADD" />
      <path d="M8 7v4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="8" cy="5.5" r="0.75" fill="#fff" />
    </svg>
  ),
};

const Toast = ({ toasts = [], removeToast }) => {
  if (!toasts.length) return null;

  return (
    <div className={styles.container}>
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type] || styles.info}`}
          role="alert"
          aria-live="polite"
        >
          <span className={styles.iconWrap}>{ICONS[toast.type] || ICONS.info}</span>
          <span className={styles.message}>{toast.message}</span>
          <button
            className={styles.closeBtn}
            onClick={() => removeToast(toast.id)}
            aria-label="Dismiss notification"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
