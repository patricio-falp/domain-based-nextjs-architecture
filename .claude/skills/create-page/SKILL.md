---
name: create-page
description: Create a new Next.js App Router page or route. Use when the user asks to add a new page, screen, view, or route to the application. Handles layout, loading, error states, metadata, and route protection.
---

# Create Page

## When to Use

Use this skill when the user asks to create a new page, screen, view, or route in the Next.js application.

## Project Conventions

### File Location

Pages follow Next.js App Router conventions:

- `src/app/{route}/page.tsx` - Page component
- `src/app/{route}/layout.tsx` - Optional layout wrapper
- `src/app/{route}/loading.tsx` - Loading skeleton
- `src/app/{route}/error.tsx` - Error boundary
- `src/app/{route}/_components/` - Page-specific components (underscore prefix = not a route)

### Page Template

```tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title | App Name',
  description: 'Page description for SEO',
};

export default function PageName() {
  return (
    <main className="min-h-screen bg-(--color-bg-subtle) p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-2xl font-bold text-(--color-fg) mb-6">Page Title</h1>
        {/* Page content */}
      </div>
    </main>
  );
}
```

### Client-Side Page (with interactivity)

```tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function InteractivePage() {
  const [state, setState] = useState(false);

  return (
    <main className="min-h-screen bg-(--color-bg-subtle) p-6">
      <div className="mx-auto max-w-7xl">
        <Card variant="elevated">
          <Card.Header title="Section Title" />
          <Card.Content>{/* Interactive content */}</Card.Content>
        </Card>
      </div>
    </main>
  );
}
```

### Loading State Template

```tsx
import { Skeleton } from '@/components/ui/Skeleton';

export default function Loading() {
  return (
    <main className="min-h-screen bg-(--color-bg-subtle) p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <Skeleton variant="text" className="h-8 w-48" />
        <Skeleton variant="card" />
        <Skeleton variant="card" />
      </div>
    </main>
  );
}
```

### Error Boundary Template

```tsx
'use client';

import { Button } from '@/components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-(--color-bg-subtle) flex items-center justify-center p-6">
      <div className="text-center space-y-4">
        <h2 className="text-xl font-semibold text-(--color-fg)">Something went wrong</h2>
        <p className="text-(--color-fg-muted)">{error.message}</p>
        <Button onClick={reset}>Try again</Button>
      </div>
    </main>
  );
}
```

### Route Protection

Protected routes are configured in `src/lib/auth/auth.config.ts` via the `authorized` callback. To protect a new route, add it to the check:

```ts
authorized({ auth, request: { nextUrl } }) {
  const isProtected = nextUrl.pathname.startsWith("/dashboard")
    || nextUrl.pathname.startsWith("/profile")
    || nextUrl.pathname.startsWith("/your-new-route"); // Add here
  // ...
}
```

### Navigation

Add new routes to the header navigation in `src/app/header.tsx`:

```tsx
const navLinks = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/components', label: 'Components' },
  { href: '/your-new-route', label: 'New Page' }, // Add here
];
```

### Path Aliases

Use these import aliases:

- `@/` → `src/`
- `@components/` → `src/components/`
- `@lib/` → `src/lib/`
- `@stores/` → `src/stores/`
- `@config/` → `src/config/`
- `@hooks/` → `src/hooks/`

### Styling Conventions

- Background: `bg-(--color-bg-subtle)` for page backgrounds
- Container: `mx-auto max-w-7xl` for content width
- Padding: `p-6` for page-level padding
- Spacing: `space-y-6` for vertical section gaps
- Cards for content grouping with `Card` component
