import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useToastStore, toast } from '@/shared/stores/toast';

describe('useToastStore', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with empty toasts', () => {
    expect(useToastStore.getState().toasts).toEqual([]);
  });

  it('addToast adds a toast and returns an id', () => {
    const id = useToastStore.getState().addToast({
      type: 'success',
      message: 'Done!',
    });
    expect(typeof id).toBe('string');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    expect(useToastStore.getState().toasts[0].message).toBe('Done!');
  });

  it('addToast sets default duration based on type', () => {
    useToastStore.getState().addToast({ type: 'success', message: 'ok' });
    expect(useToastStore.getState().toasts[0].duration).toBe(3000);

    useToastStore.setState({ toasts: [] });
    useToastStore.getState().addToast({ type: 'error', message: 'fail' });
    expect(useToastStore.getState().toasts[0].duration).toBe(5000);
  });

  it('addToast respects custom duration', () => {
    useToastStore.getState().addToast({
      type: 'info',
      message: 'custom',
      duration: 10000,
    });
    expect(useToastStore.getState().toasts[0].duration).toBe(10000);
  });

  it('addToast defaults dismissible to true', () => {
    useToastStore.getState().addToast({ type: 'info', message: 'test' });
    expect(useToastStore.getState().toasts[0].dismissible).toBe(true);
  });

  it('removeToast removes by id', () => {
    const id = useToastStore.getState().addToast({
      type: 'info',
      message: 'test',
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    useToastStore.getState().removeToast(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('clearToasts removes all toasts', () => {
    useToastStore.getState().addToast({ type: 'info', message: '1' });
    useToastStore.getState().addToast({ type: 'info', message: '2' });
    expect(useToastStore.getState().toasts).toHaveLength(2);
    useToastStore.getState().clearToasts();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('updateToast partially updates a toast', () => {
    const id = useToastStore.getState().addToast({
      type: 'info',
      message: 'original',
    });
    useToastStore.getState().updateToast(id, { message: 'updated' });
    expect(useToastStore.getState().toasts[0].message).toBe('updated');
    expect(useToastStore.getState().toasts[0].type).toBe('info');
  });

  it('auto-dismisses after duration', () => {
    useToastStore.getState().addToast({
      type: 'success',
      message: 'bye',
    });
    expect(useToastStore.getState().toasts).toHaveLength(1);
    vi.advanceTimersByTime(3000);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('does not auto-dismiss when duration is 0', () => {
    useToastStore.getState().addToast({
      type: 'info',
      message: 'sticky',
      duration: 0,
    });
    vi.advanceTimersByTime(10000);
    expect(useToastStore.getState().toasts).toHaveLength(1);
  });
});

describe('toast helpers', () => {
  beforeEach(() => {
    useToastStore.setState({ toasts: [] });
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('toast.success creates a success toast', () => {
    toast.success('Saved');
    expect(useToastStore.getState().toasts[0].type).toBe('success');
    expect(useToastStore.getState().toasts[0].message).toBe('Saved');
  });

  it('toast.error creates an error toast', () => {
    toast.error('Failed');
    expect(useToastStore.getState().toasts[0].type).toBe('error');
  });

  it('toast.warning creates a warning toast', () => {
    toast.warning('Careful');
    expect(useToastStore.getState().toasts[0].type).toBe('warning');
  });

  it('toast.info creates an info toast', () => {
    toast.info('FYI');
    expect(useToastStore.getState().toasts[0].type).toBe('info');
  });

  it('toast.dismiss removes a toast by id', () => {
    const id = toast.success('test');
    expect(useToastStore.getState().toasts).toHaveLength(1);
    toast.dismiss(id);
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });

  it('toast.dismissAll removes all toasts', () => {
    toast.success('1');
    toast.error('2');
    expect(useToastStore.getState().toasts).toHaveLength(2);
    toast.dismissAll();
    expect(useToastStore.getState().toasts).toHaveLength(0);
  });
});
