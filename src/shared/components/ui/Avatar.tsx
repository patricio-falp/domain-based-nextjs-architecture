import { forwardRef, useState } from 'react';
import { User } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Name used to generate initials fallback */
  name?: string | null;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Additional CSS class */
  className?: string;
}

const sizeStyles: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

const iconSizes: Record<AvatarSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
  xl: 'w-8 h-8',
};

/**
 * Extracts up to 2 initials from a name.
 */
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Avatar component with image, initials fallback, or icon fallback.
 *
 * @example
 * ```tsx
 * <Avatar src="/photo.jpg" name="John Doe" size="md" />
 * <Avatar name="Jane Smith" />
 * <Avatar />
 * ```
 */
export const Avatar = forwardRef<HTMLSpanElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md' }, ref) => {
    const [imgError, setImgError] = useState(false);
    const showImage = src && !imgError;
    const initials = name ? getInitials(name) : null;

    return (
      <span
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'rounded-full overflow-hidden',
          'bg-(--color-primary-muted) text-(--color-primary)',
          'font-semibold select-none shrink-0',
          sizeStyles[size],
          className
        )}
      >
        {showImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : initials ? (
          initials
        ) : (
          <User className={iconSizes[size]} aria-hidden="true" />
        )}
      </span>
    );
  }
);

Avatar.displayName = 'Avatar';

export default Avatar;
