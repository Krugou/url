import { useState, useEffect, useCallback, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { type Toast, type ToastVariant, listeners } from '../lib/toast';

const variantStyles: Record<ToastVariant, string> = {
  success:
    'bg-white border border-emerald-100 text-emerald-800 shadow-xl shadow-emerald-500/5',
  error:
    'bg-white border border-rose-100 text-rose-800 shadow-xl shadow-rose-500/5',
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
        rounded-xl
        px-5 py-3.5 font-body text-sm font-medium
        animate-slide-in
        flex items-center gap-3
        ${variantStyles[toast.variant]}
      `}
      role="alert"
    >
      {toast.variant === 'success' ? (
        <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-500 animate-pulse" />
      ) : (
        <span className="flex h-2.5 w-2.5 shrink-0 rounded-full bg-rose-500 animate-pulse" />
      )}
      <span>{toast.message}</span>
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
