import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Visual variant */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Whether to add padding to the card */
  padding?: boolean;
  /** Whether to add hover effect */
  hoverable?: boolean;
}

/**
 * A modern card component with soft shadows and rounded corners.
 *
 * @example
 * ```tsx
 * <Card variant="elevated">
 *   <Card.Header title="Card Title" description="Description" />
 *   <Card.Content>Content here</Card.Content>
 * </Card>
 * ```
 */
const CardRoot = forwardRef<HTMLDivElement, CardProps>(
  (
    { className, variant = 'elevated', padding = false, hoverable = false, children, ...props },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles - clean rounded corners
          'rounded-2xl overflow-hidden',
          'transition-shadow duration-200',
          // Variants
          variant === 'elevated' && ['bg-(--color-bg)', 'shadow-sm'],
          variant === 'outlined' && ['bg-(--color-bg)', 'border border-(--color-border-muted)'],
          variant === 'filled' && ['bg-(--color-bg-muted)'],
          // Padding
          padding && 'p-5',
          // Hover effect
          hoverable && ['cursor-pointer', 'hover:shadow-md'],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardRoot.displayName = 'Card';

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  /** Title to display in the header */
  title?: ReactNode;
  /** Description to display below the title */
  description?: ReactNode;
  /** Actions to display on the right side */
  actions?: ReactNode;
}

/**
 * Header section of a card with optional title, description, and actions.
 */
const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, description, actions, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between gap-4', 'px-5 py-4', className)}
        {...props}
      >
        {(title || description || children) && (
          <div className="flex flex-col gap-1 min-w-0">
            {title && (
              <h3 className="text-base font-semibold text-(--color-fg) truncate">{title}</h3>
            )}
            {description && (
              <p className="text-sm text-(--color-fg-muted) line-clamp-2">{description}</p>
            )}
            {children}
          </div>
        )}
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>
    );
  }
);

CardHeader.displayName = 'Card.Header';

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

/**
 * Main content section of a card.
 */
const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('px-5 pb-5', className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'Card.Content';

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

/**
 * Footer section of a card, typically used for actions.
 */
const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-3', 'px-5 py-4', 'bg-(--color-bg-subtle)', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'Card.Footer';

// Compound component pattern
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Content: CardContent,
  Footer: CardFooter,
});

export default Card;
