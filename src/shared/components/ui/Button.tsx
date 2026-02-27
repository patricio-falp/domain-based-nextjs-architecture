import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size of the button */
  size?: ButtonSize;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Icon to display before the button text */
  leftIcon?: ReactNode;
  /** Icon to display after the button text */
  rightIcon?: ReactNode;
  /** Makes the button take full width of its container */
  fullWidth?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: cn(
    'bg-(--color-primary) text-(--color-primary-fg)',
    'hover:bg-(--color-primary-hover) hover:shadow-md',
    'active:bg-(--color-primary-hover)',
    'focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none'
  ),
  secondary: cn(
    'bg-(--color-bg) text-(--color-primary)',
    'border border-(--color-border)',
    'hover:bg-(--color-bg-hover) hover:border-(--color-border)',
    'active:bg-(--color-bg-active)',
    'focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  ),
  ghost: cn(
    'bg-transparent text-(--color-fg)',
    'hover:bg-(--color-bg-hover)',
    'active:bg-(--color-bg-active)',
    'focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  ),
  danger: cn(
    'bg-(--color-error) text-(--color-primary-fg)',
    'hover:bg-(--color-error-hover) hover:shadow-md',
    'active:bg-(--color-error-hover)',
    'focus-visible:ring-2 focus-visible:ring-(--color-error) focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none'
  ),
  outline: cn(
    'bg-transparent text-(--color-fg)',
    'border-2 border-(--color-border)',
    'hover:bg-(--color-bg-hover) hover:border-(--color-fg-muted)',
    'active:bg-(--color-bg-active)',
    'focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-2',
    'disabled:opacity-40 disabled:cursor-not-allowed'
  ),
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-5 text-base gap-2',
  lg: 'h-13 px-7 text-lg gap-2.5',
};

/**
 * A versatile button component with multiple variants and sizes.
 *
 * @example
 * ```tsx
 * <Button variant="primary" size="md">Click me</Button>
 * <Button variant="danger" loading>Deleting...</Button>
 * <Button variant="ghost" leftIcon={<Icon />}>With Icon</Button>
 * ```
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'font-medium',
          'rounded-xl',
          'transition-all duration-200',
          'select-none',
          'cursor-pointer',
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          // Full width
          fullWidth && 'w-full',
          // Custom classes
          className
        )}
        disabled={isDisabled}
        aria-disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading ? (
          <>
            <LoadingSpinner className="animate-spin" />
            {children}
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

/** Internal loading spinner for the button */
function LoadingSpinner({ className }: { className?: string }) {
  return (
    <svg
      className={cn('h-4 w-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default Button;
