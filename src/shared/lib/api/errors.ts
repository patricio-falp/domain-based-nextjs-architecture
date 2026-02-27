/**
 * API Error Handling
 *
 * Standardized error types and utilities for consistent API responses.
 */

import { NextResponse } from 'next/server';

// ===========================================
// TYPES
// ===========================================

/**
 * Standard error code enum
 */
export enum ErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',

  // Resource errors
  NOT_FOUND = 'NOT_FOUND',
  ALREADY_EXISTS = 'ALREADY_EXISTS',

  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',

  // Business logic errors
  CONFLICT = 'CONFLICT',
  PRECONDITION_FAILED = 'PRECONDITION_FAILED',

  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',

  // Server errors
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DATABASE_ERROR = 'DATABASE_ERROR',

  // External service errors
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
}

/**
 * Validation error detail
 */
export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

/**
 * Standard API error response
 */
export interface ApiErrorResponse {
  /** Error code for programmatic handling */
  code: ErrorCode;
  /** Human-readable error message */
  message: string;
  /** Additional error details */
  details?: string;
  /** Validation errors (for VALIDATION_ERROR code) */
  validationErrors?: ValidationError[];
  /** Request ID for tracing */
  requestId?: string;
  /** Timestamp */
  timestamp: string;
  /** Path that caused the error */
  path?: string;
}

/**
 * Standard success response wrapper
 */
export interface ApiSuccessResponse<T = unknown> {
  /** Success flag */
  success: true;
  /** Response data */
  data: T;
  /** Optional metadata */
  meta?: Record<string, unknown>;
}

// ===========================================
// ERROR CLASSES
// ===========================================

/**
 * Base API Error class
 */
export class ApiError extends Error {
  constructor(
    public code: ErrorCode,
    public statusCode: number,
    message: string,
    public details?: string,
    public validationErrors?: ValidationError[]
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * 401 Unauthorized
 */
export class UnauthorizedError extends ApiError {
  constructor(message = 'Authentication required', details?: string) {
    super(ErrorCode.UNAUTHORIZED, 401, message, details);
    this.name = 'UnauthorizedError';
  }
}

/**
 * 403 Forbidden
 */
export class ForbiddenError extends ApiError {
  constructor(message = 'Access denied', details?: string) {
    super(ErrorCode.FORBIDDEN, 403, message, details);
    this.name = 'ForbiddenError';
  }
}

/**
 * 404 Not Found
 */
export class NotFoundError extends ApiError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with ID '${id}' not found` : `${resource} not found`;
    super(ErrorCode.NOT_FOUND, 404, message);
    this.name = 'NotFoundError';
  }
}

/**
 * 409 Conflict
 */
export class ConflictError extends ApiError {
  constructor(message: string, details?: string) {
    super(ErrorCode.CONFLICT, 409, message, details);
    this.name = 'ConflictError';
  }
}

/**
 * 422 Validation Error
 */
export class ValidationApiError extends ApiError {
  constructor(message: string, validationErrors: ValidationError[]) {
    super(ErrorCode.VALIDATION_ERROR, 422, message, undefined, validationErrors);
    this.name = 'ValidationApiError';
  }
}

/**
 * 500 Internal Server Error
 */
export class InternalServerError extends ApiError {
  constructor(message = 'Internal server error', details?: string) {
    super(ErrorCode.INTERNAL_ERROR, 500, message, details);
    this.name = 'InternalServerError';
  }
}

/**
 * 503 Service Unavailable
 */
export class ServiceUnavailableError extends ApiError {
  constructor(service: string) {
    super(ErrorCode.SERVICE_UNAVAILABLE, 503, `${service} is currently unavailable`);
    this.name = 'ServiceUnavailableError';
  }
}

// ===========================================
// UTILITIES
// ===========================================

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  error: ApiError | Error,
  requestId?: string,
  path?: string
): NextResponse<ApiErrorResponse> {
  // Handle ApiError instances
  if (error instanceof ApiError) {
    const response: ApiErrorResponse = {
      code: error.code,
      message: error.message,
      details: error.details,
      validationErrors: error.validationErrors,
      requestId,
      path,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(response, { status: error.statusCode });
  }

  // Handle unknown errors
  const response: ApiErrorResponse = {
    code: ErrorCode.INTERNAL_ERROR,
    message: 'An unexpected error occurred',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined,
    requestId,
    path,
    timestamp: new Date().toISOString(),
  };

  return NextResponse.json(response, { status: 500 });
}

/**
 * Create a standardized success response
 */
export function createSuccessResponse<T>(
  data: T,
  meta?: Record<string, unknown>
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json({
    success: true,
    data,
    meta,
  });
}

/**
 * Wrap an async API handler with error handling
 */
export function withErrorHandling<T extends unknown[], R>(
  handler: (...args: T) => Promise<NextResponse<R>>
) {
  return async (...args: T): Promise<NextResponse> => {
    try {
      return await handler(...args);
    } catch (error) {
      console.error('API Error:', error);

      // Extract request path if available
      const request = args.find((arg) => (arg as Request)?.url) as Request | undefined;
      const path = request ? new URL(request.url).pathname : undefined;

      return createErrorResponse(
        error instanceof Error ? error : new Error('Unknown error'),
        generateRequestId(),
        path
      );
    }
  };
}

/**
 * Generate a unique request ID
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate required fields and throw ValidationApiError if missing
 */
export function validateRequired<T extends Record<string, unknown>>(
  data: T,
  requiredFields: (keyof T)[]
): void {
  const errors: ValidationError[] = [];

  for (const field of requiredFields) {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push({
        field: String(field),
        message: `${String(field)} is required`,
        code: 'REQUIRED',
      });
    }
  }

  if (errors.length > 0) {
    throw new ValidationApiError('Validation failed', errors);
  }
}

/**
 * Assert a condition or throw an error
 */
export function assert(condition: boolean, error: ApiError): asserts condition {
  if (!condition) {
    throw error;
  }
}
