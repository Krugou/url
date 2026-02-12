type ToastVariant = 'success' | 'error';

interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
}

let toastId = 0;
const listeners = new Set<(toast: Toast) => void>();

export type { ToastVariant, Toast };
export { listeners };

export function showToast(message: string, variant: ToastVariant = 'success') {
  const toast: Toast = { id: ++toastId, message, variant };
  listeners.forEach((fn) => {
    fn(toast);
  });
}
