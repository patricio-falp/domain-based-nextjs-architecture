---
name: create-component
description: Create a new React UI component following the project's established patterns. Use when the user asks to create, add, or build a new component, UI element, or widget. Covers component file, types, styling with Tailwind + CSS variables, and ref forwarding.
---

# Create Component

## When to Use

Use this skill when the user asks to create a new UI component for the project. This includes buttons, cards, modals, form elements, data displays, or any reusable React component.

## Project Conventions

### File Location

- UI primitives: `src/components/ui/{ComponentName}.tsx`
- Feature-specific components: `src/components/{feature}/{ComponentName}.tsx`
- Page-level components: `src/app/{route}/_components/{ComponentName}.tsx`

### Component Structure Pattern

Every component must follow this structure:

```tsx
import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

// 1. Export types first
export type ComponentVariant = 'primary' | 'secondary';
export type ComponentSize = 'sm' | 'md' | 'lg';

export interface ComponentProps extends HTMLAttributes<HTMLDivElement> {
  /** JSDoc for every prop */
  variant?: ComponentVariant;
  size?: ComponentSize;
}

// 2. Define style maps as Record<Variant, string>
const variantStyles: Record<ComponentVariant, string> = {
  primary: cn('bg-(--color-primary) text-(--color-primary-fg)', 'hover:bg-(--color-primary-hover)'),
  secondary: cn('bg-(--color-bg) text-(--color-fg)', 'border border-(--color-border)'),
};

const sizeStyles: Record<ComponentSize, string> = {
  sm: 'h-9 px-4 text-sm',
  md: 'h-11 px-5 text-base',
  lg: 'h-13 px-7 text-lg',
};

// 3. Component with forwardRef
export const Component = forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          'inline-flex items-center justify-center',
          'rounded-xl',
          'transition-all duration-200',
          // Variant and size
          variantStyles[variant],
          sizeStyles[size],
          // Custom classes (always last)
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Component.displayName = 'Component';

// 4. Default export
export default Component;
```

### Compound Component Pattern (for complex components)

Use when a component has sub-sections (like Card with Header/Content/Footer):

```tsx
const ComponentRoot = forwardRef<HTMLDivElement, RootProps>(
  ({ className, children, ...props }, ref) => (
    <div ref={ref} className={cn('base-styles', className)} {...props}>
      {children}
    </div>
  )
);
ComponentRoot.displayName = 'Component';

const ComponentHeader = forwardRef<HTMLDivElement, HeaderProps>(/* ... */);
ComponentHeader.displayName = 'Component.Header';

const ComponentContent = forwardRef<HTMLDivElement, ContentProps>(/* ... */);
ComponentContent.displayName = 'Component.Content';

// Compose with Object.assign
export const Component = Object.assign(ComponentRoot, {
  Header: ComponentHeader,
  Content: ComponentContent,
});
```

### Styling Rules

1. Always use CSS variables from the design system: `bg-(--color-bg)`, `text-(--color-fg)`, etc.
2. Never use hardcoded colors (no `bg-blue-500`, `text-gray-700`)
3. Use `cn()` from `@/lib/utils/cn` for class merging (combines clsx + tailwind-merge)
4. Use Tailwind v4 CSS variable syntax: `bg-(--color-primary)` not `bg-[var(--color-primary)]`
5. Always include hover states and focus-visible styles
6. Use `transition-all duration-200` for animations
7. Use `rounded-xl` or `rounded-2xl` for border radius (modern rounded look)

### Available CSS Variables

- Backgrounds: `--color-bg`, `--color-bg-subtle`, `--color-bg-muted`, `--color-bg-elevated`, `--color-bg-hover`, `--color-bg-active`
- Text: `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`
- Borders: `--color-border`, `--color-border-muted`
- Primary: `--color-primary`, `--color-primary-hover`, `--color-primary-muted`, `--color-primary-fg`
- Semantic: `--color-success`, `--color-warning`, `--color-error`, `--color-info` (each with `-hover`, `-muted`, `-fg`)
- Shadows: `--shadow-xs`, `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-xl`

### Accessibility Requirements

- Add `aria-*` attributes where relevant (aria-disabled, aria-busy, aria-label)
- Use semantic HTML elements (button, nav, section, article)
- Support keyboard navigation (focus-visible)
- Set `displayName` on every forwardRef component

### Icons

Use `lucide-react` for icons. Import individual icons:

```tsx
import { ChevronDown, X, Check } from 'lucide-react';
```

### After Creating the Component

1. Create a unit test file at `tests/unit/components/ui/{Component}.test.tsx`
2. Add a showcase section in `src/app/components/page.tsx` if it's a reusable UI component
