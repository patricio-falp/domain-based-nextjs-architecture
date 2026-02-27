---
name: create-store
description: Create a new Zustand store for client-side state management. Use when the user asks to add state management, create a store, manage global state, or needs shared client state across components.
---

# Create Zustand Store

## When to Use

Use this skill when the user asks to create a new store, add state management, or needs shared state across components.

## Project Conventions

### File Location

`src/stores/{storeName}.ts`

### Existing Stores (for reference)

- `toast.ts` - Toast notifications (non-persisted)
- `preferences.ts` - User preferences (localStorage-persisted)
- `ui.ts` - UI state (partially persisted)

### Store Template (Non-Persisted)

```ts
/**
 * Zustand store for {description}
 */

import { create } from 'zustand';

// ===========================================
// TYPES
// ===========================================

export interface StoreItem {
  id: string;
  name: string;
}

export interface StoreState {
  /** Description of state */
  items: StoreItem[];
  /** Description */
  selectedId: string | null;
}

export interface StoreActions {
  /** Add a new item */
  addItem: (item: StoreItem) => void;
  /** Remove an item by id */
  removeItem: (id: string) => void;
  /** Set selected item */
  setSelected: (id: string | null) => void;
  /** Clear all items */
  clear: () => void;
}

export type MyStore = StoreState & StoreActions;

// ===========================================
// STORE
// ===========================================

export const useMyStore = create<MyStore>((set) => ({
  // State
  items: [],
  selectedId: null,

  // Actions
  addItem: (item) =>
    set((state) => ({
      items: [...state.items, item],
    })),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setSelected: (id) => set({ selectedId: id }),

  clear: () => set({ items: [], selectedId: null }),
}));
```

### Store Template (With localStorage Persistence)

```ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PreferencesState {
  theme: 'light' | 'dark' | 'system';
  sidebarCollapsed: boolean;
}

export interface PreferencesActions {
  setTheme: (theme: PreferencesState['theme']) => void;
  toggleSidebar: () => void;
}

export type PreferencesStore = PreferencesState & PreferencesActions;

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      // State
      theme: 'system',
      sidebarCollapsed: false,

      // Actions
      setTheme: (theme) => set({ theme }),
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
    }),
    {
      name: 'app-preferences', // localStorage key
      partialize: (state) => ({
        // Only persist these fields
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);
```

### Selector Hooks Pattern

Create selector hooks for performance (prevents unnecessary re-renders):

```ts
// Selector hooks - use these in components
export const useThemePreference = () => usePreferencesStore((state) => state.theme);

export const useSidebarCollapsed = () => usePreferencesStore((state) => state.sidebarCollapsed);
```

### Helper Functions Pattern (like toast store)

For stores used imperatively outside React:

```ts
export const myStore = {
  addItem: (item: StoreItem) => useMyStore.getState().addItem(item),

  removeItem: (id: string) => useMyStore.getState().removeItem(id),

  clear: () => useMyStore.getState().clear(),
};
```

## Patterns

### State vs Actions

- Separate `State` and `Actions` interfaces, combine with `type Store = State & Actions`
- State is data, Actions are functions that modify data

### When to Persist

- User preferences (theme, layout) -> persist
- UI state (sidebar, modals) -> partially persist (layout only)
- Transient state (toasts, loading) -> do not persist

### When NOT to Use Zustand

- Server data (API responses) -> use React Query instead
- Form state -> use React Hook Form instead
- URL state (filters, pagination) -> use URL search params

### Testing

Create a test file at `tests/unit/stores/{storeName}.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { useMyStore } from '@/stores/myStore';

describe('myStore', () => {
  beforeEach(() => {
    useMyStore.setState(useMyStore.getInitialState());
  });

  it('has correct initial state', () => {
    const state = useMyStore.getState();
    expect(state.items).toEqual([]);
    expect(state.selectedId).toBeNull();
  });

  // Test each action...
});
```
