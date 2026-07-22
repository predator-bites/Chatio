import React, { useCallback, useState } from 'react';
import { ToastContext, ToastItem, ToastVariant } from '../hooks/useToast';
import { ToastStack } from './Toast';

let counter = 0;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = `toast-${++counter}`;

      setToasts((prev) => [...prev, { id, message, variant }]);
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;
