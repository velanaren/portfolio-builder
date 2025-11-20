/**
 * Toast Component
 * Notification toasts with animations
 */

import React from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({
  type = 'info',
  title,
  message,
  onClose,
}) => {
  // Icon mapping
  const icons = {
    success: <CheckCircle2 className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  // Color mapping
  const colors = {
    success: {
      border: 'border-l-[var(--success)]',
      icon: 'text-[var(--success)]',
      bg: 'bg-[rgba(16,185,129,0.05)]',
    },
    error: {
      border: 'border-l-[var(--error)]',
      icon: 'text-[var(--error)]',
      bg: 'bg-[rgba(239,68,68,0.05)]',
    },
    warning: {
      border: 'border-l-[var(--warning)]',
      icon: 'text-[var(--warning)]',
      bg: 'bg-[rgba(245,158,11,0.05)]',
    },
    info: {
      border: 'border-l-[var(--brand)]',
      icon: 'text-[var(--brand)]',
      bg: 'bg-[rgba(0,217,255,0.05)]',
    },
  };

  const colorScheme = colors[type];

  return (
    <div
      className={`
        fixed bottom-6 right-6 z-50
        max-w-md
        ${colorScheme.bg}
        bg-[var(--bg-tertiary)]
        border border-[var(--border)]
        ${colorScheme.border}
        border-l-4
        rounded-lg
        shadow-[var(--shadow-lg)]
        p-4
        animate-slide-up
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`flex-shrink-0 ${colorScheme.icon}`}>
          {icons[type]}
        </div>

        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-0.5">
              {title}
            </h4>
          )}
          <p className="text-sm text-[var(--text-secondary)]">
            {message}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="
              flex-shrink-0
              text-[var(--text-tertiary)]
              hover:text-[var(--text-primary)]
              transition-colors
              p-1
              rounded
              hover:bg-[var(--bg-elevated)]
            "
            aria-label="Close notification"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer: React.FC<{ toasts: ToastProps[] }> = ({ toasts }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 pointer-events-none">
      {toasts.map((toast, index) => (
        <div key={toast.id || index} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

export default Toast;
