import { describe, it, expect } from 'vitest';
import {
  normalizePaginationParams,
  extractPaginationParams,
  buildPaginationMeta,
  createPaginatedResponse,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
} from '@/shared/lib/api/pagination';

describe('normalizePaginationParams', () => {
  it('uses defaults when no params provided', () => {
    const result = normalizePaginationParams({});
    expect(result).toEqual({
      limit: DEFAULT_PAGE_SIZE,
      cursor: undefined,
      order: 'desc',
    });
  });

  it('caps limit at MAX_PAGE_SIZE', () => {
    const result = normalizePaginationParams({ limit: 500 });
    expect(result.limit).toBe(MAX_PAGE_SIZE);
  });

  it('preserves valid params', () => {
    const result = normalizePaginationParams({
      limit: 50,
      cursor: 'abc123',
      order: 'asc',
    });
    expect(result).toEqual({
      limit: 50,
      cursor: 'abc123',
      order: 'asc',
    });
  });
});

describe('extractPaginationParams', () => {
  it('parses limit, cursor, and order from search params', () => {
    const params = new URLSearchParams('limit=50&cursor=abc&order=asc');
    const result = extractPaginationParams(params);
    expect(result).toEqual({
      limit: 50,
      cursor: 'abc',
      order: 'asc',
    });
  });

  it('returns undefined for missing params', () => {
    const params = new URLSearchParams('');
    const result = extractPaginationParams(params);
    expect(result).toEqual({
      limit: undefined,
      cursor: undefined,
      order: undefined,
    });
  });

  it('ignores invalid order values', () => {
    const params = new URLSearchParams('order=invalid');
    const result = extractPaginationParams(params);
    expect(result.order).toBeUndefined();
  });
});

describe('buildPaginationMeta', () => {
  it('returns hasMore=true when items fill the limit', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const meta = buildPaginationMeta(items, 3);
    expect(meta.hasMore).toBe(true);
    expect(meta.nextCursor).toBe('3');
    expect(meta.prevCursor).toBe('1');
    expect(meta.count).toBe(3);
  });

  it('returns hasMore=false when items are fewer than limit', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const meta = buildPaginationMeta(items, 5);
    expect(meta.hasMore).toBe(false);
    expect(meta.nextCursor).toBeNull();
  });

  it('handles empty items array', () => {
    const meta = buildPaginationMeta([], 20);
    expect(meta.count).toBe(0);
    expect(meta.hasMore).toBe(false);
    expect(meta.nextCursor).toBeNull();
    expect(meta.prevCursor).toBeNull();
  });

  it('includes total when provided', () => {
    const meta = buildPaginationMeta([{ id: '1' }], 20, 100);
    expect(meta.total).toBe(100);
  });
});

describe('createPaginatedResponse', () => {
  it('combines data and pagination meta', () => {
    const items = [{ id: '1', name: 'Item 1' }];
    const response = createPaginatedResponse(items, 20, 1);
    expect(response.data).toEqual(items);
    expect(response.pagination.count).toBe(1);
    expect(response.pagination.total).toBe(1);
  });
});
