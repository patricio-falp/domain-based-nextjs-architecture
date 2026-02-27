import { describe, it, expect } from 'vitest';
import { cn } from '@/shared/lib/utils/cn';

describe('cn', () => {
  it('merges multiple class strings', () => {
    expect(cn('foo', 'bar')).toBe('foo bar');
  });

  it('resolves Tailwind conflicts (last wins)', () => {
    expect(cn('px-4 py-2', 'px-6')).toBe('py-2 px-6');
  });

  it('handles falsy values', () => {
    expect(cn('foo', undefined, null, false, 'bar')).toBe('foo bar');
  });

  it('handles object syntax', () => {
    expect(cn({ 'font-bold': true, 'text-lg': false })).toBe('font-bold');
  });

  it('handles array syntax', () => {
    expect(cn(['foo', 'bar'], 'baz')).toBe('foo bar baz');
  });

  it('returns empty string for no arguments', () => {
    expect(cn()).toBe('');
  });

  it('deduplicates Tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500');
  });
});
