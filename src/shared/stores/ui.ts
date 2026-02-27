/**
 * UI State Store
 *
 * Consolidated Zustand store for UI-only state.
 * For toasts, use the dedicated `stores/toast.ts` store.
 * Server state should be managed by React Query.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// ===========================================
// STATE
// ===========================================

interface UIState {
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Expandable UI elements
  expandedItems: Set<string>;
  toggleItemExpanded: (id: string) => void;
  collapseAll: () => void;

  // Layout preferences (persisted)
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  compactMode: boolean;
  setCompactMode: (compact: boolean) => void;
}

// ===========================================
// STORE
// ===========================================

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Search
      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      // Expandable elements
      expandedItems: new Set(),

      toggleItemExpanded: (id) =>
        set((state) => {
          const expanded = new Set(state.expandedItems);
          if (expanded.has(id)) {
            expanded.delete(id);
          } else {
            expanded.add(id);
          }
          return { expandedItems: expanded };
        }),

      collapseAll: () => set({ expandedItems: new Set() }),

      // Layout preferences
      sidebarCollapsed: false,
      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
      compactMode: false,
      setCompactMode: (compact) => set({ compactMode: compact }),
    }),
    {
      name: 'app-ui-store',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        compactMode: state.compactMode,
      }),
    }
  )
);

// ===========================================
// SELECTORS
// ===========================================

export const selectSearchQuery = (state: UIState) => state.searchQuery;
export const selectSidebarCollapsed = (state: UIState) => state.sidebarCollapsed;
