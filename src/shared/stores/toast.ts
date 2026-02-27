/**
 * Zustand store for toast notifications
 */

import { create } from 'zustand';

/**
 * Toast notification type
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Toast notification interface
 */
export interface Toast {
  /** Unique identifier */
  id: string;
  /** Toast type/severity */
  type: ToastType;
  /** Toast title (optional) */
  title?: string;
  /** Toast message */
  message: string;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Whether the toast can be dismissed */
  dismissible?: boolean;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Input for creating a new toast (without id)
 */
export type ToastInput = Omit<Toast, 'id'>;

/**
 * Toast store state
 */
export interface ToastState {
  /** List of active toasts */
  toasts: Toast[];
}

/**
 * Toast store actions
 */
export interface ToastActions {
  /** Add a new toast notification */
  addToast: (toast: ToastInput) => string;
  /** Remove a toast by id */
  removeToast: (id: string) => void;
  /** Remove all toasts */
  clearToasts: () => void;
  /** Update an existing toast */
  updateToast: (id: string, updates: Partial<Omit<Toast, 'id'>>) => void;
}

export type ToastStore = ToastState & ToastActions;

/**
 * Default toast duration by type (in milliseconds)
 */
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

/**
 * Generate a unique ID for toasts
 */
function generateToastId(): string {
  return `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Zustand store for toast notifications
 */
export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = generateToastId();
    const duration = toast.duration ?? DEFAULT_DURATIONS[toast.type];
    const dismissible = toast.dismissible ?? true;

    const newToast: Toast = {
      ...toast,
      id,
      duration,
      dismissible,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss if duration is set
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  clearToasts: () => set({ toasts: [] }),

  updateToast: (id, updates) =>
    set((state) => ({
      toasts: state.toasts.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    })),
}));

/**
 * Helper functions for common toast types
 */
export const toast = {
  success: (message: string, options?: Partial<ToastInput>) =>
    useToastStore.getState().addToast({ type: 'success', message, ...options }),

  error: (message: string, options?: Partial<ToastInput>) =>
    useToastStore.getState().addToast({ type: 'error', message, ...options }),

  warning: (message: string, options?: Partial<ToastInput>) =>
    useToastStore.getState().addToast({ type: 'warning', message, ...options }),

  info: (message: string, options?: Partial<ToastInput>) =>
    useToastStore.getState().addToast({ type: 'info', message, ...options }),

  dismiss: (id: string) => useToastStore.getState().removeToast(id),

  dismissAll: () => useToastStore.getState().clearToasts(),
};
