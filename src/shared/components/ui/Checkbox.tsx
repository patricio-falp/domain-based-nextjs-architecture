'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check, Minus } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

/* ─── Types ──────────────────────────────────────────────────────── */

export interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
  'onChange'
> {
  /** Label text */
  label?: string;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Change handler (boolean convenience — mirrors old API) */
  onChange?: (checked: boolean) => void;
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

const iconSizeClasses = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

/* ─── Component ──────────────────────────────────────────────────── */

const Checkbox = forwardRef<ElementRef<typeof CheckboxPrimitive.Root>, CheckboxProps>(
  ({ className, label, size = 'md', disabled, onChange, onCheckedChange, ...props }, ref) => {
    const handleCheckedChange = (value: CheckboxPrimitive.CheckedState) => {
      onCheckedChange?.(value);
      // Call legacy onChange with boolean (indeterminate → false)
      onChange?.(value === true);
    };

    return (
      <label
        className={cn(
          'inline-flex items-center gap-2 cursor-pointer',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <CheckboxPrimitive.Root
          ref={ref}
          disabled={disabled}
          onCheckedChange={handleCheckedChange}
          className={cn(
            'flex items-center justify-center rounded-md border-2 transition-all',
            sizeClasses[size],
            // Default state
            'border-(--color-border-muted) bg-(--color-bg)',
            // Checked/Indeterminate state
            'data-[state=checked]:border-(--color-primary) data-[state=checked]:bg-(--color-primary)',
            'data-[state=indeterminate]:border-(--color-primary) data-[state=indeterminate]:bg-(--color-primary)',
            // Focus state
            'focus-visible:ring-2 focus-visible:ring-(--color-primary) focus-visible:ring-offset-1',
            'focus-visible:outline-none',
            // Hover state
            !disabled && 'hover:border-(--color-fg-muted)',
            className
          )}
          {...props}
        >
          <CheckboxPrimitive.Indicator className="flex items-center justify-center">
            {props.checked === 'indeterminate' ? (
              <Minus className={cn('text-(--color-primary-fg)', iconSizeClasses[size])} />
            ) : (
              <Check className={cn('text-(--color-primary-fg)', iconSizeClasses[size])} />
            )}
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        {label && <span className="text-(--color-fg) select-none">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
export default Checkbox;
