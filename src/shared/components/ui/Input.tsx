import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Icon or element to display on the left side */
  leftAddon?: ReactNode;
  /** Icon or element to display on the right side */
  rightAddon?: ReactNode;
  /** Size of the input */
  size?: 'sm' | 'md' | 'lg';
  /** Whether the input takes full width */
  fullWidth?: boolean;
}

const sizeStyles = {
  sm: 'h-8 text-sm px-2.5',
  md: 'h-10 text-base px-3',
  lg: 'h-12 text-lg px-4',
};

const addonSizeStyles = {
  sm: 'px-2',
  md: 'px-3',
  lg: 'px-4',
};

/**
 * A form input component with label, error, and helper text support.
 *
 * @example
 * ```tsx
 * <Input
 *   label="Email"
 *   placeholder="Enter your email"
 *   helperText="We'll never share your email"
 * />
 *
 * <Input
 *   label="Password"
 *   type="password"
 *   error="Password must be at least 8 characters"
 * />
 *
 * <Input
 *   label="Search"
 *   leftAddon={<SearchIcon />}
 *   placeholder="Search..."
 * />
 * ```
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftAddon,
      rightAddon,
      size = 'md',
      fullWidth = false,
      disabled,
      id: providedId,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    const hasError = Boolean(error);
    const describedBy = [hasError ? errorId : null, helperText ? helperId : null]
      .filter(Boolean)
      .join(' ');

    return (
      <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
        {label && (
          <label
            htmlFor={id}
            className={cn('text-sm font-medium text-(--color-fg)', disabled && 'opacity-50')}
          >
            {label}
          </label>
        )}

        <div className={cn('relative flex', fullWidth && 'w-full')}>
          {leftAddon && (
            <div
              className={cn(
                'flex items-center justify-center',
                'bg-(--color-bg-muted)',
                'rounded-l-full',
                'text-(--color-fg-muted)',
                addonSizeStyles[size],
                disabled && 'opacity-50'
              )}
              aria-hidden="true"
            >
              {leftAddon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={describedBy || undefined}
            className={cn(
              // Base styles
              'flex-1',
              'bg-(--color-bg-muted)',
              'border-0',
              'text-(--color-fg)',
              'placeholder:text-(--color-fg-muted)',
              'transition-all duration-200',
              // Size
              sizeStyles[size],
              // Border radius based on addons
              !leftAddon && !rightAddon && 'rounded-full',
              leftAddon && !rightAddon && 'rounded-r-full',
              !leftAddon && rightAddon && 'rounded-l-full',
              leftAddon && rightAddon && 'rounded-none',
              // Focus styles
              'focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:ring-offset-0',
              'focus:bg-(--color-bg)',
              // Error state
              hasError && ['ring-2 ring-(--color-error)', 'focus:ring-(--color-error)'],
              // Disabled state
              disabled && 'opacity-50 cursor-not-allowed',
              // Full width
              fullWidth && 'w-full',
              className
            )}
            {...props}
          />

          {rightAddon && (
            <div
              className={cn(
                'flex items-center justify-center',
                'bg-(--color-bg-muted)',
                'rounded-r-full',
                'text-(--color-fg-muted)',
                addonSizeStyles[size],
                disabled && 'opacity-50'
              )}
              aria-hidden="true"
            >
              {rightAddon}
            </div>
          )}
        </div>

        {(error || helperText) && (
          <div className="flex flex-col gap-0.5">
            {error && (
              <p id={errorId} className="text-sm text-(--color-error)" role="alert">
                {error}
              </p>
            )}
            {helperText && !error && (
              <p id={helperId} className="text-sm text-(--color-fg-muted)">
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
