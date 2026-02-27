import { describe, it, expect } from 'vitest';
import { exampleCreateSchema } from '@/shared/lib/api/validation';

describe('exampleCreateSchema', () => {
  it('accepts valid input', () => {
    const result = exampleCreateSchema.safeParse({
      name: 'Test item',
      description: 'A description',
    });
    expect(result.success).toBe(true);
  });

  it('accepts input without optional description', () => {
    const result = exampleCreateSchema.safeParse({ name: 'Test' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = exampleCreateSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
  });

  it('rejects missing name', () => {
    const result = exampleCreateSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it('rejects name exceeding max length', () => {
    const result = exampleCreateSchema.safeParse({ name: 'a'.repeat(101) });
    expect(result.success).toBe(false);
  });

  it('rejects description exceeding max length', () => {
    const result = exampleCreateSchema.safeParse({
      name: 'Test',
      description: 'a'.repeat(501),
    });
    expect(result.success).toBe(false);
  });
});
