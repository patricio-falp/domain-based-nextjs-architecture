import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface SpinnerProps extends HTMLAttributes<HTMLDivElement> {
  /** Size of the spinner */
  size?: SpinnerSize;
  /** Color of the spinner (CSS color value) */
  color?: string;
  /** Accessible label for screen readers */
  label?: string;
}

const sizeStyles: Record<SpinnerSize, string> = {
  sm: 'h-4 w-4 border-2',
  md: 'h-6 w-6 border-2',
  lg: 'h-8 w-8 border-3',
  xl: 'h-12 w-12 border-4',
};

/**
 * A loading spinner component.
 *
 * @example
 * ```tsx
 * // Basic spinner
 * <Spinner />
 *
 * // Large spinner with custom color
 * <Spinner size="lg" color="var(--color-primary)" />
 *
 * // Spinner with accessible label
 * <Spinner label="Loading user data..." />
 * ```
 */
export const Spinner = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size = 'md', color, label = 'Loading...', style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-label={label}
        className={cn('inline-flex items-center justify-center', className)}
        {...props}
      >
        <div
          className={cn(
            'rounded-full',
            'border-(--color-border)',
            'border-t-(--color-primary)',
            'animate-spin',
            sizeStyles[size]
          )}
          style={{
            borderTopColor: color,
            ...style,
          }}
          aria-hidden="true"
        />
        <span className="sr-only">{label}</span>
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

/**
 * A full-screen loading overlay with spinner.
 */
export const SpinnerOverlay = forwardRef<HTMLDivElement, SpinnerProps & { visible?: boolean }>(
  ({ visible = true, className, ...props }, ref) => {
    if (!visible) return null;

    return (
      <div
        ref={ref}
        className={cn(
          'fixed inset-0',
          'flex items-center justify-center',
          'bg-(--color-overlay)',
          'z-(--z-modal)',
          'animate-in fade-in duration-200',
          className
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <Spinner size="xl" {...props} />
          {props.label && <p className="text-(--color-fg) font-medium">{props.label}</p>}
        </div>
      </div>
    );
  }
);

SpinnerOverlay.displayName = 'SpinnerOverlay';

/**
 * A centered loading spinner for containers.
 */
export const SpinnerCentered = forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-center', 'w-full h-full min-h-[200px]', className)}
      >
        <Spinner {...props} />
      </div>
    );
  }
);

SpinnerCentered.displayName = 'SpinnerCentered';

export default Spinner;
