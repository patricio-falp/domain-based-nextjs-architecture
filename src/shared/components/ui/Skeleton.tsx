import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Width of the skeleton (CSS value) */
  width?: string | number;
  /** Height of the skeleton (CSS value) */
  height?: string | number;
  /** Whether to use a circular shape */
  circle?: boolean;
  /** Whether to animate the skeleton */
  animate?: boolean;
}

/**
 * A loading placeholder component that mimics content while loading.
 *
 * @example
 * ```tsx
 * // Text placeholder
 * <Skeleton width="200px" height="1rem" />
 *
 * // Avatar placeholder
 * <Skeleton width={48} height={48} circle />
 *
 * // Card placeholder
 * <div className="flex flex-col gap-2">
 *   <Skeleton height="200px" />
 *   <Skeleton width="80%" height="1.5rem" />
 *   <Skeleton width="60%" height="1rem" />
 * </div>
 * ```
 */
export const Skeleton = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, width, height, circle = false, animate = true, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="status"
        aria-busy="true"
        aria-label="Loading..."
        className={cn(
          'bg-(--color-bg-muted)',
          circle ? 'rounded-full' : 'rounded-(--radius-md)',
          animate && 'animate-pulse',
          className
        )}
        style={{
          width: typeof width === 'number' ? `${width}px` : width,
          height: typeof height === 'number' ? `${height}px` : height,
          ...style,
        }}
        {...props}
      />
    );
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Pre-built skeleton variants for common use cases.
 */
export const SkeletonText = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'height'> & { lines?: number; lastLineWidth?: string }
>(({ className, lines = 3, lastLineWidth = '60%', ...props }, ref) => {
  return (
    <div ref={ref} className={cn('flex flex-col gap-2', className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          height="1rem"
          width={index === lines - 1 ? lastLineWidth : '100%'}
          {...props}
        />
      ))}
    </div>
  );
});

SkeletonText.displayName = 'SkeletonText';

export const SkeletonAvatar = forwardRef<
  HTMLDivElement,
  Omit<SkeletonProps, 'circle' | 'width' | 'height'> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 32,
    md: 40,
    lg: 56,
  };

  return (
    <Skeleton
      ref={ref}
      width={sizes[size]}
      height={sizes[size]}
      circle
      className={className}
      {...props}
    />
  );
});

SkeletonAvatar.displayName = 'SkeletonAvatar';

export const SkeletonCard = forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'rounded-(--radius-lg)',
          'border border-(--color-border)',
          'p-(--spacing-lg)',
          'flex flex-col gap-4',
          className
        )}
        {...props}
      >
        <Skeleton height="150px" />
        <div className="flex flex-col gap-2">
          <Skeleton height="1.5rem" width="70%" />
          <Skeleton height="1rem" width="90%" />
          <Skeleton height="1rem" width="60%" />
        </div>
      </div>
    );
  }
);

SkeletonCard.displayName = 'SkeletonCard';

export default Skeleton;
