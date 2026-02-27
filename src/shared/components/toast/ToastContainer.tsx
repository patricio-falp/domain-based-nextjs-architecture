'use client';

/**
 * Toast Container Component
 *
 * Displays toast notifications in a fixed position on the screen.
 */

import { useEffect, useRef } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useToastStore, type Toast, type ToastType } from '@/shared/stores/toast';
import { cn } from '@/shared/lib/utils/cn';

/**
 * Icon configuration for each toast type
 */
const toastIcons: Record<ToastType, typeof CheckCircle> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

/**
 * Style configuration for each toast type
 */
const toastStyles: Record<ToastType, string> = {
  success: cn('bg-(--color-success-muted)', 'border-(--color-success)', 'text-(--color-success)'),
  error: cn('bg-(--color-error-muted)', 'border-(--color-error)', 'text-(--color-error)'),
  warning: cn('bg-(--color-warning-muted)', 'border-(--color-warning)', 'text-(--color-warning)'),
  info: cn('bg-(--color-info-muted)', 'border-(--color-info)', 'text-(--color-info)'),
};

/**
 * Accessible label for each toast type
 */
const toastAriaLabels: Record<ToastType, string> = {
  success: 'Success notification',
  error: 'Error notification',
  warning: 'Warning notification',
  info: 'Information notification',
};

/**
 * Individual toast item component
 */
interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const Icon = toastIcons[toast.type];
  const toastRef = useRef<HTMLDivElement>(null);

  // Focus management for accessibility
  useEffect(() => {
    if (toast.type === 'error') {
      toastRef.current?.focus();
    }
  }, [toast.type]);

  const handleDismiss = () => {
    if (toast.dismissible !== false) {
      onDismiss(toast.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && toast.dismissible !== false) {
      onDismiss(toast.id);
    }
  };

  return (
    <div
      ref={toastRef}
      role={toast.type === 'error' ? 'alert' : 'status'}
      aria-live={toast.type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
      aria-label={toastAriaLabels[toast.type]}
      tabIndex={-1}
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex items-start gap-3',
        'w-full max-w-sm p-4',
        'border-l-4 rounded-(--radius-md)',
        'shadow-(--shadow-lg)',
        'animate-in slide-in-from-right-full fade-in',
        'duration-300',
        toastStyles[toast.type]
      )}
    >
      {/* Icon */}
      <Icon className="h-5 w-5 shrink-0 mt-0.5" aria-hidden="true" />

      {/* Content */}
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm mb-0.5">{toast.title}</p>}
        <p className={cn('text-sm', toast.title ? 'text-(--color-fg)' : '')}>{toast.message}</p>

        {/* Action button */}
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className={cn(
              'mt-2 text-sm font-medium underline',
              'hover:no-underline',
              'focus:outline-none focus:ring-2 focus:ring-(--color-focus-ring) focus:rounded'
            )}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {/* Dismiss button */}
      {toast.dismissible !== false && (
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className={cn(
            'shrink-0 p-1 rounded-(--radius-sm)',
            'text-(--color-fg-muted)',
            'hover:bg-(--color-bg-subtle) hover:text-(--color-fg)',
            'focus:outline-none focus:ring-2 focus:ring-(--color-focus-ring)',
            'transition-colors duration-(--transition-fast)'
          )}
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/**
 * Toast container positions
 */
export type ToastPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';

const positionStyles: Record<ToastPosition, string> = {
  'top-right': 'top-4 right-4 items-end',
  'top-left': 'top-4 left-4 items-start',
  'bottom-right': 'bottom-4 right-4 items-end',
  'bottom-left': 'bottom-4 left-4 items-start',
  'top-center': 'top-4 left-1/2 -translate-x-1/2 items-center',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2 items-center',
};

/**
 * Toast container props
 */
export interface ToastContainerProps {
  /** Position of the toast container */
  position?: ToastPosition;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
}

/**
 * Container component that renders all active toasts
 */
export function ToastContainer({ position = 'top-right', maxToasts = 5 }: ToastContainerProps) {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  // Limit displayed toasts
  const visibleToasts = toasts.slice(-maxToasts);

  if (visibleToasts.length === 0) {
    return null;
  }

  return (
    <div
      aria-label="Notifications"
      className={cn('fixed z-50 flex flex-col gap-2 pointer-events-none', positionStyles[position])}
    >
      {visibleToasts.map((toastItem) => (
        <div key={toastItem.id} className="pointer-events-auto">
          <ToastItem toast={toastItem} onDismiss={removeToast} />
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
