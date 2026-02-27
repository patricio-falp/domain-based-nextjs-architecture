import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Visual style variant */
  variant?: BadgeVariant;
  /** Size of the badge */
  size?: BadgeSize;
  /** Whether to show a dot indicator */
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: cn('bg-(--color-bg-muted)', 'text-(--color-fg-muted)'),
  success: cn('bg-(--color-success-muted)', 'text-(--color-success)'),
  warning: cn('bg-(--color-warning-muted)', 'text-(--color-warning)'),
  error: cn('bg-(--color-error-muted)', 'text-(--color-error)'),
  info: cn('bg-(--color-info-muted)', 'text-(--color-info)'),
};

const dotVariantStyles: Record<BadgeVariant, string> = {
  default: 'bg-(--color-fg-muted)',
  success: 'bg-(--color-success)',
  warning: 'bg-(--color-warning)',
  error: 'bg-(--color-error)',
  info: 'bg-(--color-info)',
};

const sizeStyles: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-sm',
};

const dotSizeStyles: Record<BadgeSize, string> = {
  sm: 'h-1.5 w-1.5',
  md: 'h-2 w-2',
};

/**
 * A badge component for displaying status, labels, or counts.
 *
 * @example
 * ```tsx
 * <Badge variant="success">Active</Badge>
 * <Badge variant="error" dot>Critical</Badge>
 * <Badge variant="info" size="sm">New</Badge>
 * ```
 */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot = false, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center gap-1.5',
          'font-medium',
          'rounded-full',
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {dot && (
          <span
            className={cn('rounded-full shrink-0', dotVariantStyles[variant], dotSizeStyles[size])}
            aria-hidden="true"
          />
        )}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;
