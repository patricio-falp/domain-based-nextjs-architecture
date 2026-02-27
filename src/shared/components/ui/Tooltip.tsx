'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/shared/lib/utils/cn';

/* ─── Primitives ─────────────────────────────────────────────────── */

const TooltipProvider = TooltipPrimitive.Provider;
const TooltipRoot = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipPortal = TooltipPrimitive.Portal;

/* ─── Content ────────────────────────────────────────────────────── */

const TooltipContent = forwardRef<
  ElementRef<typeof TooltipPrimitive.Content>,
  ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'z-(--z-tooltip)',
      'px-3 py-1.5 text-sm',
      'bg-(--color-fg) text-(--color-bg)',
      'rounded-lg shadow-md',
      'animate-in fade-in-0 zoom-in-95',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=top]:slide-in-from-bottom-2',
      'data-[side=bottom]:slide-in-from-top-2',
      'data-[side=left]:slide-in-from-right-2',
      'data-[side=right]:slide-in-from-left-2',
      className
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

/* ─── Simple Tooltip Wrapper ─────────────────────────────────────── */

export interface SimpleTooltipProps {
  /** Tooltip text content */
  content: ReactNode;
  /** Trigger element */
  children: ReactNode;
  /** Side to display the tooltip */
  side?: 'top' | 'right' | 'bottom' | 'left';
  /** Delay before showing in ms */
  delayDuration?: number;
}

/**
 * Simple tooltip wrapper for quick usage.
 *
 * @example
 * ```tsx
 * <Tooltip content="Edit this item">
 *   <Button variant="ghost"><Pencil /></Button>
 * </Tooltip>
 * ```
 */
function Tooltip({ content, children, side = 'top', delayDuration = 300 }: SimpleTooltipProps) {
  return (
    <TooltipRoot delayDuration={delayDuration}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side={side}>{content}</TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  );
}

/* ─── Exports ────────────────────────────────────────────────────── */

export { TooltipProvider, TooltipRoot, TooltipTrigger, TooltipPortal, TooltipContent, Tooltip };
