import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { type Toast, type ToastVariant, listeners } from '../lib/toast';

const variantStyles: Record<ToastVariant, string> = {
  success: 'bg-secondary text-text',
  error: 'bg-primary text-white',
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: number) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 3500);
    return () => {
      clearTimeout(timer);
    };
  }, [toast.id, onRemove]);

  return (
    <div
      className={`
        border-3 border-text shadow-neo
        px-5 py-3 font-heading text-sm font-bold uppercase tracking-wide
        animate-slide-in
        ${variantStyles[toast.variant]}
      `}
      role="alert"
    >
      {toast.message}
    </div>
  );
}

export function ToastContainer(): ReactNode {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const handleRemove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
    };
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return createPortal(
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={handleRemove} />
      ))}
    </div>,
    document.body,
  );
}
