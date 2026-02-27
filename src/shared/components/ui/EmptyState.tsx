import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  /** Icon to display (defaults to Inbox) */
  icon?: ReactNode;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action element (e.g. a Button) */
  action?: ReactNode;
}

/**
 * Empty state placeholder for when there is no data to display.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   title="No items found"
 *   description="Try adjusting your search or filters."
 *   action={<Button>Create item</Button>}
 * />
 * ```
 */
export const EmptyState = forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-col items-center justify-center',
          'py-12 px-6 text-center',
          className
        )}
        {...props}
      >
        <span className="text-(--color-fg-subtle) mb-4" aria-hidden="true">
          {icon ?? <Inbox className="w-12 h-12" />}
        </span>
        <h3 className="text-lg font-semibold text-(--color-fg) mb-1">{title}</h3>
        {description && (
          <p className="text-sm text-(--color-fg-muted) max-w-sm mb-4">{description}</p>
        )}
        {action && <div>{action}</div>}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';

export default EmptyState;
