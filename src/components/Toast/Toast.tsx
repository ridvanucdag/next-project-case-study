'use client';

import { useToast } from '@/contexts/ToastContext';
import styles from './toast.module.css';

export default function Toast() {
  const { toasts } = useToast();

  return (
    <div className={styles.toastContainer}>
      {toasts?.map((toast) => (
        <div key={toast?.id} className={`${styles.toast} ${styles[toast?.type]}`}>
          {toast?.message}
        </div>
      ))}
    </div>
  );
}
