import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import type { ToastItem, ToastVariant } from '../hooks/useToast';

const DURATION_MS = 4500;

const CONFIG: Record<
  ToastVariant,
  {
    icon: React.ReactNode;
    bg: string;
    border: string;
    text: string;
    bar: string;
  }
> = {
  error: {
    icon: <Icon iconSlug="alertCircle" size="medium" />,
    bg: 'bg-red-950/90',
    border: 'border-red-500/40',
    text: 'text-red-100',
    bar: 'bg-red-500',
  },
  success: {
    icon: <Icon iconSlug="checkCircle" size="medium" />,
    bg: 'bg-emerald-950/90',
    border: 'border-emerald-500/40',
    text: 'text-emerald-100',
    bar: 'bg-emerald-500',
  },
  warning: {
    icon: <Icon iconSlug="triangleAlert" size="medium" />,
    bg: 'bg-amber-950/90',
    border: 'border-amber-500/40',
    text: 'text-amber-100',
    bar: 'bg-amber-400',
  },
  info: {
    icon: <Icon iconSlug="info" size="medium" />,
    bg: 'bg-blue-950/90',
    border: 'border-blue-500/40',
    text: 'text-blue-100',
    bar: 'bg-blue-400',
  },
};

interface ToastCardProps extends ToastItem {
  onDismiss: (id: string) => void;
}

const ToastCard: React.FC<ToastCardProps> = ({
  id,
  message,
  variant,
  onDismiss,
}) => {
  const cfg = CONFIG[variant];
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = () => {
    setLeaving(true);

    if (timerRef.current) clearTimeout(timerRef.current);

    setTimeout(() => onDismiss(id), 300);
  };

  useEffect(() => {
    // mount animation
    const raf = requestAnimationFrame(() => setVisible(true));

    timerRef.current = setTimeout(dismiss, DURATION_MS);
    return () => {
      cancelAnimationFrame(raf);

      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <div
      role="alert"
      aria-live="assertive"
      style={{
        transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
        transform:
          visible && !leaving
            ? 'translateX(0) scale(1)'
            : 'translateX(120%) scale(0.9)',
        opacity: visible && !leaving ? 1 : 0,
      }}
      className={[
        'relative flex items-start gap-3 w-80 rounded-2xl border px-4 pt-3.5 pb-4 shadow-2xl backdrop-blur-md',
        cfg.bg,
        cfg.border,
        cfg.text,
      ].join(' ')}
    >
      {/* icon */}
      <span className="mt-0.5 shrink-0">{cfg.icon}</span>

      {/* message */}
      <p className="flex-1 text-sm leading-snug font-medium">{message}</p>

      {/* dismiss */}
      <button
        aria-label="Dismiss notification"
        onClick={dismiss}
        className="shrink-0 mt-0.5 opacity-60 hover:opacity-100 transition-opacity"
      >
        <Icon iconSlug="x" size="small" />
      </button>

      {/* progress bar */}
      <span
        className={[
          'absolute bottom-0 left-0 h-[3px] rounded-b-2xl',
          cfg.bar,
        ].join(' ')}
        style={{
          width: '100%',
          animation: `toast-progress ${DURATION_MS}ms linear forwards`,
        }}
      />
    </div>
  );
};

interface ToastStackProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export const ToastStack: React.FC<ToastStackProps> = ({
  toasts,
  onDismiss,
}) => {
  return (
    <>
      <style>{`
        @keyframes toast-progress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div
        aria-label="Notifications"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none"
      >
        {toasts.map((t) => (
          <div key={t.id} className="pointer-events-auto">
            <ToastCard {...t} onDismiss={onDismiss} />
          </div>
        ))}
      </div>
    </>
  );
};

export default ToastStack;
