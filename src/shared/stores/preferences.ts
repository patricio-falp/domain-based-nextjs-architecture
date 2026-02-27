import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Theme = 'light' | 'dark' | 'system';

export interface PreferencesState {
  /** Current theme setting */
  theme: Theme;
  /** Whether the sidebar is collapsed */
  sidebarCollapsed: boolean;
  /** Editor font size */
  editorFontSize: number;
  /** Whether to show line numbers in editor */
  editorLineNumbers: boolean;
  /** Whether to enable word wrap in editor */
  editorWordWrap: boolean;
}

export interface PreferencesActions {
  /** Set the theme */
  setTheme: (theme: Theme) => void;
  /** Toggle sidebar collapsed state */
  toggleSidebar: () => void;
  /** Set sidebar collapsed state */
  setSidebarCollapsed: (collapsed: boolean) => void;
  /** Set editor font size */
  setEditorFontSize: (size: number) => void;
  /** Toggle editor line numbers */
  toggleEditorLineNumbers: () => void;
  /** Toggle editor word wrap */
  toggleEditorWordWrap: () => void;
  /** Reset all preferences to defaults */
  resetPreferences: () => void;
}

export type PreferencesStore = PreferencesState & PreferencesActions;

const defaultPreferences: PreferencesState = {
  theme: 'system',
  sidebarCollapsed: false,
  editorFontSize: 14,
  editorLineNumbers: true,
  editorWordWrap: true,
};

/**
 * Zustand store for user preferences with localStorage persistence.
 *
 * @example
 * ```tsx
 * import { usePreferencesStore } from '@stores/preferences';
 *
 * function Settings() {
 *   const { theme, setTheme } = usePreferencesStore();
 *
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
 *       <option value="light">Light</option>
 *       <option value="dark">Dark</option>
 *       <option value="system">System</option>
 *     </select>
 *   );
 * }
 * ```
 */
export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      // State
      ...defaultPreferences,

      // Actions
      setTheme: (theme) => {
        set({ theme });
        // Also update the DOM attribute for CSS theme switching
        if (typeof document !== 'undefined') {
          if (theme === 'system') {
            document.documentElement.removeAttribute('data-theme');
          } else {
            document.documentElement.setAttribute('data-theme', theme);
          }
        }
      },

      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

      setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),

      setEditorFontSize: (size) => set({ editorFontSize: Math.max(10, Math.min(24, size)) }),

      toggleEditorLineNumbers: () =>
        set((state) => ({ editorLineNumbers: !state.editorLineNumbers })),

      toggleEditorWordWrap: () => set((state) => ({ editorWordWrap: !state.editorWordWrap })),

      resetPreferences: () => set(defaultPreferences),
    }),
    {
      name: 'app-preferences',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
        editorFontSize: state.editorFontSize,
        editorLineNumbers: state.editorLineNumbers,
        editorWordWrap: state.editorWordWrap,
      }),
    }
  )
);

/**
 * Gets the effective theme based on system preference.
 * Used to resolve "system" theme to actual light/dark value.
 */
export function getEffectiveTheme(theme: Theme): 'light' | 'dark' {
  if (theme === 'system') {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }
  return theme;
}

/**
 * Selector hooks for specific preference values.
 */
export const useThemePreference = () => usePreferencesStore((state) => state.theme);
export const useSidebarCollapsed = () => usePreferencesStore((state) => state.sidebarCollapsed);
export const useEditorPreferences = () =>
  usePreferencesStore((state) => ({
    fontSize: state.editorFontSize,
    lineNumbers: state.editorLineNumbers,
    wordWrap: state.editorWordWrap,
  }));

export default usePreferencesStore;
