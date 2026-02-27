/**
 * Pagination Types and Utilities
 *
 * Cursor-based pagination for efficient large dataset traversal.
 */

// ===========================================
// TYPES
// ===========================================

/**
 * Pagination parameters for API requests
 */
export interface PaginationParams {
  /** Number of items to return (default: 20) */
  limit?: number;
  /** Cursor for next page (ID of last item from previous page) */
  cursor?: string;
  /** Sort direction (default: desc) */
  order?: 'asc' | 'desc';
}

/**
 * Paginated response wrapper
 */
export interface PaginatedResponse<T> {
  /** Data items for current page */
  data: T[];
  /** Pagination metadata */
  pagination: PaginationMeta;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  /** Total count of items (if available) */
  total?: number;
  /** Number of items in current page */
  count: number;
  /** Cursor for next page (ID of last item) */
  nextCursor: string | null;
  /** Cursor for previous page (ID of first item) */
  prevCursor: string | null;
  /** Whether there are more items */
  hasMore: boolean;
  /** Current page size limit */
  limit: number;
}

// ===========================================
// CONSTANTS
// ===========================================

/** Default page size */
export const DEFAULT_PAGE_SIZE = 20;

/** Maximum page size */
export const MAX_PAGE_SIZE = 100;

/** Available page size options */
export const PAGE_SIZE_OPTIONS = [20, 50, 100] as const;

// ===========================================
// UTILITIES
// ===========================================

/**
 * Validate and normalize pagination parameters
 */
export function normalizePaginationParams(params: PaginationParams): {
  limit: number;
  cursor?: string;
  order: 'asc' | 'desc';
} {
  return {
    limit: Math.min(params.limit || DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE),
    cursor: params.cursor,
    order: params.order || 'desc',
  };
}

/**
 * Extract pagination params from URLSearchParams
 */
export function extractPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const limit = searchParams.get('limit');
  const cursor = searchParams.get('cursor');
  const order = searchParams.get('order');

  return {
    limit: limit ? parseInt(limit, 10) : undefined,
    cursor: cursor || undefined,
    order: order === 'asc' || order === 'desc' ? order : undefined,
  };
}

/**
 * Build pagination metadata from query results
 */
export function buildPaginationMeta<T extends { id: string }>(
  items: T[],
  requestedLimit: number,
  total?: number
): PaginationMeta {
  const count = items.length;
  const hasMore = count === requestedLimit;

  return {
    total,
    count,
    nextCursor: hasMore && count > 0 ? items[count - 1].id : null,
    prevCursor: count > 0 ? items[0].id : null,
    hasMore,
    limit: requestedLimit,
  };
}

/**
 * Create paginated response
 */
export function createPaginatedResponse<T extends { id: string }>(
  items: T[],
  requestedLimit: number,
  total?: number
): PaginatedResponse<T> {
  return {
    data: items,
    pagination: buildPaginationMeta(items, requestedLimit, total),
  };
}
