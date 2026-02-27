import { forwardRef, type HTMLAttributes } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export interface BreadcrumbItem {
  /** Display label */
  label: string;
  /** Link URL (omit for current page) */
  href?: string;
}

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  /** Breadcrumb items */
  items: BreadcrumbItem[];
}

/**
 * Breadcrumbs navigation component.
 *
 * @example
 * ```tsx
 * <Breadcrumbs items={[
 *   { label: 'Home', href: '/' },
 *   { label: 'Settings', href: '/settings' },
 *   { label: 'Profile' },
 * ]} />
 * ```
 */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(
  ({ className, items, ...props }, ref) => {
    return (
      <nav ref={ref} aria-label="Breadcrumb" className={className} {...props}>
        <ol className="flex items-center gap-1.5 text-sm">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center gap-1.5">
                {index > 0 && (
                  <ChevronRight
                    className="w-3.5 h-3.5 text-(--color-fg-subtle) shrink-0"
                    aria-hidden="true"
                  />
                )}
                {isLast || !item.href ? (
                  <span
                    className={cn(
                      'font-medium',
                      isLast ? 'text-(--color-fg)' : 'text-(--color-fg-muted)'
                    )}
                    aria-current={isLast ? 'page' : undefined}
                  >
                    {item.label}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="text-(--color-fg-muted) hover:text-(--color-fg) transition-colors"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumbs.displayName = 'Breadcrumbs';

export default Breadcrumbs;
