import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '@/shared/hooks/useTheme';

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('returns system as default theme', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('system');
  });

  it('mounted is true on client', () => {
    const { result } = renderHook(() => useTheme());
    expect(result.current.mounted).toBe(true);
  });

  it('resolvedTheme returns light when system and matchMedia prefers light', () => {
    const { result } = renderHook(() => useTheme());
    // Default matchMedia mock returns matches: false → light
    expect(result.current.resolvedTheme).toBe('light');
  });

  it('setTheme updates theme and persists to localStorage', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(localStorage.getItem('app-theme')).toBe('dark');
  });

  it('setTheme sets data-theme attribute on document', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });

    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('setTheme to system removes data-theme attribute', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');

    act(() => {
      result.current.setTheme('system');
    });
    expect(document.documentElement.getAttribute('data-theme')).toBeNull();
  });

  it('toggleTheme switches between light and dark', () => {
    const { result } = renderHook(() => useTheme());

    // Start from system (resolved to light via mock)
    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });

  it('reads stored theme from localStorage on init', () => {
    localStorage.setItem('app-theme', 'dark');
    const { result } = renderHook(() => useTheme());
    expect(result.current.theme).toBe('dark');
  });

  it('resolvedTheme matches explicit theme', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('dark');
    });
    expect(result.current.resolvedTheme).toBe('dark');

    act(() => {
      result.current.setTheme('light');
    });
    expect(result.current.resolvedTheme).toBe('light');
  });
});
