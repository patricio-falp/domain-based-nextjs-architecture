import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore, selectSearchQuery, selectSidebarCollapsed } from '@/shared/stores/ui';

describe('useUIStore', () => {
  beforeEach(() => {
    useUIStore.setState({
      searchQuery: '',
      expandedItems: new Set(),
      sidebarCollapsed: false,
      compactMode: false,
    });
  });

  describe('search', () => {
    it('setSearchQuery updates the query', () => {
      useUIStore.getState().setSearchQuery('hello');
      expect(useUIStore.getState().searchQuery).toBe('hello');
    });

    it('selectSearchQuery returns the current query', () => {
      useUIStore.getState().setSearchQuery('test');
      expect(selectSearchQuery(useUIStore.getState())).toBe('test');
    });
  });

  describe('expandedItems', () => {
    it('toggleItemExpanded adds an item', () => {
      useUIStore.getState().toggleItemExpanded('item-1');
      expect(useUIStore.getState().expandedItems.has('item-1')).toBe(true);
    });

    it('toggleItemExpanded removes an already-expanded item', () => {
      useUIStore.getState().toggleItemExpanded('item-1');
      useUIStore.getState().toggleItemExpanded('item-1');
      expect(useUIStore.getState().expandedItems.has('item-1')).toBe(false);
    });

    it('collapseAll empties the set', () => {
      useUIStore.getState().toggleItemExpanded('a');
      useUIStore.getState().toggleItemExpanded('b');
      useUIStore.getState().collapseAll();
      expect(useUIStore.getState().expandedItems.size).toBe(0);
    });
  });

  describe('layout preferences', () => {
    it('setSidebarCollapsed updates the value', () => {
      useUIStore.getState().setSidebarCollapsed(true);
      expect(useUIStore.getState().sidebarCollapsed).toBe(true);
    });

    it('selectSidebarCollapsed returns the current value', () => {
      useUIStore.getState().setSidebarCollapsed(true);
      expect(selectSidebarCollapsed(useUIStore.getState())).toBe(true);
    });

    it('setCompactMode updates the value', () => {
      useUIStore.getState().setCompactMode(true);
      expect(useUIStore.getState().compactMode).toBe(true);
    });
  });
});
