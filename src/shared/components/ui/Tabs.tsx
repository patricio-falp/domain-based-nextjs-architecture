'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from '@/shared/lib/utils/cn';

/* ─── Root ───────────────────────────────────────────────────────── */

export type TabsProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Root>;

const TabsRoot = forwardRef<ElementRef<typeof TabsPrimitive.Root>, TabsProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Root ref={ref} className={cn('w-full', className)} {...props} />
  )
);
TabsRoot.displayName = 'Tabs';

/* ─── List ───────────────────────────────────────────────────────── */

export type TabsListProps = ComponentPropsWithoutRef<typeof TabsPrimitive.List>;

const TabsList = forwardRef<ElementRef<typeof TabsPrimitive.List>, TabsListProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.List
      ref={ref}
      className={cn(
        'flex items-center gap-1',
        'p-1',
        'bg-(--color-bg-subtle)',
        'border border-(--color-border)',
        'rounded-(--radius-lg)',
        className
      )}
      {...props}
    />
  )
);
TabsList.displayName = 'Tabs.List';

/* ─── Trigger ────────────────────────────────────────────────────── */

export interface TabsTriggerProps extends ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> {
  icon?: ReactNode;
}

const TabsTrigger = forwardRef<ElementRef<typeof TabsPrimitive.Trigger>, TabsTriggerProps>(
  ({ className, icon, children, ...props }, ref) => (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
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
        'data-[state=active]:bg-(--color-bg)',
        'data-[state=active]:text-(--color-fg)',
        'data-[state=active]:shadow-(--shadow-sm)',
        // Focus state
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-1',
        // Disabled state
        'disabled:opacity-50',
        'disabled:cursor-not-allowed',
        'disabled:hover:bg-transparent',
        'disabled:hover:text-(--color-fg-muted)',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </TabsPrimitive.Trigger>
  )
);
TabsTrigger.displayName = 'Tabs.Trigger';

/* ─── Content ────────────────────────────────────────────────────── */

export type TabsContentProps = ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const TabsContent = forwardRef<ElementRef<typeof TabsPrimitive.Content>, TabsContentProps>(
  ({ className, ...props }, ref) => (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'mt-(--spacing-md)',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--color-focus-ring) focus-visible:ring-offset-2',
        'rounded-(--radius-md)',
        className
      )}
      {...props}
    />
  )
);
TabsContent.displayName = 'Tabs.Content';

/* ─── Compound Component ─────────────────────────────────────────── */

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});

export default Tabs;
