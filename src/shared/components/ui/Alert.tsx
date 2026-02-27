import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export type AlertVariant = 'info' | 'success' | 'warning' | 'error';

export interface AlertProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: AlertVariant;
  /** Alert title */
  title?: string;
  /** Custom icon (overrides default) */
  icon?: ReactNode;
  /** Whether the alert can be dismissed */
  dismissible?: boolean;
  /** Called when dismiss button is clicked */
  onDismiss?: () => void;
}

const variantStyles: Record<AlertVariant, string> = {
  info: cn('bg-(--color-info-muted) text-(--color-info-fg)', 'border border-(--color-info)/20'),
  success: cn(
    'bg-(--color-success-muted) text-(--color-success-fg)',
    'border border-(--color-success)/20'
  ),
  warning: cn(
    'bg-(--color-warning-muted) text-(--color-warning-fg)',
    'border border-(--color-warning)/20'
  ),
  error: cn('bg-(--color-error-muted) text-(--color-error-fg)', 'border border-(--color-error)/20'),
};

const iconStyles: Record<AlertVariant, string> = {
  info: 'text-(--color-info)',
  success: 'text-(--color-success)',
  warning: 'text-(--color-warning)',
  error: 'text-(--color-error)',
};

const defaultIcons: Record<AlertVariant, ReactNode> = {
  info: <Info className="w-5 h-5" />,
  success: <CheckCircle className="w-5 h-5" />,
  warning: <AlertTriangle className="w-5 h-5" />,
  error: <XCircle className="w-5 h-5" />,
};

/**
 * Alert component for displaying contextual messages.
 *
 * @example
 * ```tsx
 * <Alert variant="success" title="Saved!">Your changes have been saved.</Alert>
 * <Alert variant="error" dismissible onDismiss={() => {}}>Something went wrong.</Alert>
 * ```
 */
export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      icon,
      dismissible = false,
      onDismiss,
      children,
      ...props
    },
    ref
  ) => {
    const displayIcon = icon ?? defaultIcons[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn('flex gap-3 rounded-xl p-4', variantStyles[variant], className)}
        {...props}
      >
        <span className={cn('shrink-0 mt-0.5', iconStyles[variant])} aria-hidden="true">
          {displayIcon}
        </span>
        <div className="flex-1 min-w-0">
          {title && <p className="font-semibold text-sm mb-1">{title}</p>}
          {children && <div className="text-sm opacity-90">{children}</div>}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={onDismiss}
            className={cn(
              'shrink-0 p-1 rounded-lg',
              'opacity-60 hover:opacity-100',
              'transition-opacity duration-150',
              'cursor-pointer'
            )}
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
