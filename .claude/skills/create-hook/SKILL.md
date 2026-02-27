---
name: create-hook
description: Create a new custom React hook. Use when the user asks to create a hook, extract reusable logic, add a custom hook, or encapsulate stateful behavior like data fetching, localStorage, event listeners, or media queries.
---

# Create Custom Hook

## When to Use

Use this skill when the user asks to create a custom React hook, extract reusable logic from a component, or needs encapsulated stateful behavior.

## Project Conventions

### File Location

`src/hooks/use{HookName}.ts` (or `.tsx` if it returns JSX)

### Existing Hooks (for reference)

- `useAuth.ts` - Authentication state wrapper around NextAuth
- `useTheme.ts` - Theme management with localStorage + system preference
- `useDemoData.ts` - React Query hooks for JSONPlaceholder API

### Basic Hook Template

````ts
import { useState, useCallback } from 'react';

export interface UseMyHookOptions {
  /** Initial value */
  initialValue?: string;
}

export interface UseMyHookReturn {
  /** Current value */
  value: string;
  /** Update the value */
  setValue: (value: string) => void;
  /** Reset to initial value */
  reset: () => void;
}

/**
 * A hook for {description}.
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { value, setValue, reset } = useMyHook({ initialValue: 'hello' });
 *   return <input value={value} onChange={(e) => setValue(e.target.value)} />;
 * }
 * ```
 */
export function useMyHook(options: UseMyHookOptions = {}): UseMyHookReturn {
  const { initialValue = '' } = options;
  const [value, setValueState] = useState(initialValue);

  const setValue = useCallback((newValue: string) => {
    setValueState(newValue);
  }, []);

  const reset = useCallback(() => {
    setValueState(initialValue);
  }, [initialValue]);

  return { value, setValue, reset };
}

export default useMyHook;
````

### Hook with localStorage Persistence

```ts
import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'my-key';

export function usePersistedState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return defaultValue;
    const stored = localStorage.getItem(key);
    return stored ? (JSON.parse(stored) as T) : defaultValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### Hook with React Query (Data Fetching)

```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Item {
  id: string;
  name: string;
}

export function useItems() {
  return useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => {
      const res = await fetch('/api/items');
      if (!res.ok) throw new Error('Failed to fetch items');
      const data = await res.json();
      return data.data;
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newItem: Omit<Item, 'id'>) => {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });
      if (!res.ok) throw new Error('Failed to create item');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

### Hook with Event Listeners

```ts
import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}
```

### Hook with SSR Safety (useSyncExternalStore)

```ts
import { useSyncExternalStore } from 'react';

// For values that differ between server and client
const mounted = useSyncExternalStore(
  () => () => {}, // subscribe (no-op)
  () => true, // getSnapshot (client)
  () => false // getServerSnapshot
);
```

## Patterns

### Return Type Interface

Always define and export a return type interface:

```ts
export interface UseMyHookReturn {
  value: string;
  setValue: (v: string) => void;
}
```

### Options Object

Use an options object for hooks with multiple parameters:

```ts
export interface UseMyHookOptions {
  initialValue?: string;
  debounceMs?: number;
}
export function useMyHook(options: UseMyHookOptions = {}) { ... }
```

### SSR Safety

- Always check `typeof window !== "undefined"` before accessing browser APIs
- Use `useSyncExternalStore` for hydration-safe mounted state
- Provide fallback values for SSR

### JSDoc with @example

Include a usage example in the JSDoc comment for every hook.

### Default Export

Always include both named and default exports:

```ts
export function useMyHook() { ... }
export default useMyHook;
```

### Testing

Create a test at `tests/unit/hooks/use{HookName}.test.ts` using `renderHook` from Testing Library.
