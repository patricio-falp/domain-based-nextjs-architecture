'use client';

import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme, type Theme } from '@/shared/hooks/useTheme';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@components/ui/Button';

export interface ThemeToggleProps {
  /** Additional CSS classes */
  className?: string;
  /** Whether to show labels next to icons */
  showLabels?: boolean;
  /** Variant: 'button' for a single toggle, 'switch' for three-way toggle */
  variant?: 'button' | 'switch';
}

const themeOptions: { value: Theme; label: string; icon: typeof Sun }[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

/**
 * A theme toggle component that allows switching between light, dark, and system themes.
 *
 * @example
 * ```tsx
 * // Simple toggle button (cycles through themes)
 * <ThemeToggle />
 *
 * // Three-way switch
 * <ThemeToggle variant="switch" />
 *
 * // With labels
 * <ThemeToggle variant="switch" showLabels />
 * ```
 */
export function ThemeToggle({
  className,
  showLabels = false,
  variant = 'button',
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme, mounted } = useTheme();

  // Avoid hydration mismatch by rendering a placeholder until mounted
  if (!mounted) {
    return (
      <div
        className={cn(
          'h-10 w-10 rounded-(--radius-md) bg-(--color-bg-muted)',
          variant === 'switch' && 'w-auto px-1',
          className
        )}
        aria-hidden="true"
      />
    );
  }

  if (variant === 'button') {
    // Cycle through themes: light -> dark -> system -> light
    const cycleTheme = () => {
      const currentIndex = themeOptions.findIndex((opt) => opt.value === theme);
      const nextIndex = (currentIndex + 1) % themeOptions.length;
      const nextOption = themeOptions[nextIndex];
      if (nextOption) {
        setTheme(nextOption.value);
      }
    };

    const CurrentIcon = theme === 'system' ? Monitor : resolvedTheme === 'light' ? Sun : Moon;

    return (
      <Button
        variant="ghost"
        size="md"
        onClick={cycleTheme}
        className={cn('w-10 p-0', className)}
        aria-label={`Current theme: ${theme}. Click to change.`}
        title={`Theme: ${theme}`}
      >
        <CurrentIcon className="h-5 w-5" aria-hidden="true" />
      </Button>
    );
  }

  // Switch variant: three buttons in a row
  return (
    <div
      role="radiogroup"
      aria-label="Theme selection"
      className={cn(
        'inline-flex items-center gap-1',
        'p-1',
        'bg-(--color-bg-subtle)',
        'border border-(--color-border)',
        'rounded-(--radius-lg)',
        className
      )}
    >
      {themeOptions.map((option) => {
        const Icon = option.icon;
        const isActive = theme === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setTheme(option.value)}
            className={cn(
              // Base styles
              'flex items-center justify-center gap-2',
              'px-3 py-1.5',
              'text-sm font-medium',
              'rounded-(--radius-md)',
              'transition-all duration-(--transition-fast)',
              'select-none',
              // Default state
              'text-(--color-fg-muted)',
              'hover:text-(--color-fg)',
              'hover:bg-(--color-bg-muted)',
              // Active state
              isActive && ['bg-(--color-bg)', 'text-(--color-fg)', 'shadow-(--shadow-sm)'],
              // Focus state
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-1'
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {showLabels && <span>{option.label}</span>}
            {!showLabels && <span className="sr-only">{option.label} theme</span>}
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
