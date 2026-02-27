import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges class names using clsx and tailwind-merge.
 * This utility combines multiple class values and intelligently merges
 * Tailwind CSS classes, resolving conflicts in favor of the last class.
 *
 * @param inputs - Class values to merge (strings, objects, arrays, etc.)
 * @returns Merged class string with resolved Tailwind conflicts
 *
 * @example
 * ```tsx
 * cn("px-4 py-2", "px-6") // => "py-2 px-6"
 * cn("bg-red-500", isActive && "bg-blue-500") // => "bg-blue-500" (if isActive)
 * cn({ "font-bold": isBold, "text-lg": isLarge })
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
