import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePreferencesStore, getEffectiveTheme } from '@/shared/stores/preferences';

describe('usePreferencesStore', () => {
  beforeEach(() => {
    usePreferencesStore.setState({
      theme: 'system',
      sidebarCollapsed: false,
      editorFontSize: 14,
      editorLineNumbers: true,
      editorWordWrap: true,
    });
    document.documentElement.removeAttribute('data-theme');
  });

  describe('theme', () => {
    it('setTheme updates theme state', () => {
      usePreferencesStore.getState().setTheme('dark');
      expect(usePreferencesStore.getState().theme).toBe('dark');
    });

    it('setTheme sets data-theme attribute on document', () => {
      usePreferencesStore.getState().setTheme('dark');
      expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    });

    it('setTheme removes data-theme for system', () => {
      usePreferencesStore.getState().setTheme('dark');
      usePreferencesStore.getState().setTheme('system');
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('sidebar', () => {
    it('toggleSidebar inverts the value', () => {
      expect(usePreferencesStore.getState().sidebarCollapsed).toBe(false);
      usePreferencesStore.getState().toggleSidebar();
      expect(usePreferencesStore.getState().sidebarCollapsed).toBe(true);
      usePreferencesStore.getState().toggleSidebar();
      expect(usePreferencesStore.getState().sidebarCollapsed).toBe(false);
    });

    it('setSidebarCollapsed sets the value directly', () => {
      usePreferencesStore.getState().setSidebarCollapsed(true);
      expect(usePreferencesStore.getState().sidebarCollapsed).toBe(true);
    });
  });

  describe('editor preferences', () => {
    it('setEditorFontSize clamps between 10 and 24', () => {
      usePreferencesStore.getState().setEditorFontSize(5);
      expect(usePreferencesStore.getState().editorFontSize).toBe(10);

      usePreferencesStore.getState().setEditorFontSize(30);
      expect(usePreferencesStore.getState().editorFontSize).toBe(24);

      usePreferencesStore.getState().setEditorFontSize(16);
      expect(usePreferencesStore.getState().editorFontSize).toBe(16);
    });

    it('toggleEditorLineNumbers inverts the value', () => {
      expect(usePreferencesStore.getState().editorLineNumbers).toBe(true);
      usePreferencesStore.getState().toggleEditorLineNumbers();
      expect(usePreferencesStore.getState().editorLineNumbers).toBe(false);
    });

    it('toggleEditorWordWrap inverts the value', () => {
      expect(usePreferencesStore.getState().editorWordWrap).toBe(true);
      usePreferencesStore.getState().toggleEditorWordWrap();
      expect(usePreferencesStore.getState().editorWordWrap).toBe(false);
    });
  });

  describe('resetPreferences', () => {
    it('restores all defaults', () => {
      usePreferencesStore.getState().setTheme('dark');
      usePreferencesStore.getState().setSidebarCollapsed(true);
      usePreferencesStore.getState().setEditorFontSize(20);
      usePreferencesStore.getState().toggleEditorLineNumbers();

      usePreferencesStore.getState().resetPreferences();

      const state = usePreferencesStore.getState();
      expect(state.theme).toBe('system');
      expect(state.sidebarCollapsed).toBe(false);
      expect(state.editorFontSize).toBe(14);
      expect(state.editorLineNumbers).toBe(true);
      expect(state.editorWordWrap).toBe(true);
    });
  });
});

describe('getEffectiveTheme', () => {
  it('returns light for light theme', () => {
    expect(getEffectiveTheme('light')).toBe('light');
  });

  it('returns dark for dark theme', () => {
    expect(getEffectiveTheme('dark')).toBe('dark');
  });

  it('returns based on matchMedia for system theme', () => {
    // Default matchMedia mock returns matches: false (light)
    expect(getEffectiveTheme('system')).toBe('light');
  });

  it('returns dark for system when prefers-color-scheme is dark', () => {
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: query === '(prefers-color-scheme: dark)',
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }));

    expect(getEffectiveTheme('system')).toBe('dark');

    vi.unstubAllGlobals();
  });
});
