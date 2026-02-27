import { describe, it, expect } from 'vitest';
import {
  ApiError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
  ValidationApiError,
  InternalServerError,
  ServiceUnavailableError,
  ErrorCode,
  validateRequired,
  assert,
} from '@/shared/lib/api/errors';

describe('ApiError', () => {
  it('sets all properties correctly', () => {
    const error = new ApiError(ErrorCode.INTERNAL_ERROR, 500, 'Something broke', 'Details here');
    expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
    expect(error.statusCode).toBe(500);
    expect(error.message).toBe('Something broke');
    expect(error.details).toBe('Details here');
    expect(error.name).toBe('ApiError');
    expect(error).toBeInstanceOf(Error);
  });
});

describe('Error subclasses', () => {
  it('UnauthorizedError defaults to 401', () => {
    const error = new UnauthorizedError();
    expect(error.statusCode).toBe(401);
    expect(error.code).toBe(ErrorCode.UNAUTHORIZED);
    expect(error.message).toBe('Authentication required');
    expect(error.name).toBe('UnauthorizedError');
  });

  it('ForbiddenError defaults to 403', () => {
    const error = new ForbiddenError();
    expect(error.statusCode).toBe(403);
    expect(error.code).toBe(ErrorCode.FORBIDDEN);
    expect(error.name).toBe('ForbiddenError');
  });

  it('NotFoundError formats message without ID', () => {
    const error = new NotFoundError('User');
    expect(error.statusCode).toBe(404);
    expect(error.message).toBe('User not found');
  });

  it('NotFoundError formats message with ID', () => {
    const error = new NotFoundError('User', '123');
    expect(error.message).toBe("User with ID '123' not found");
  });

  it('ConflictError defaults to 409', () => {
    const error = new ConflictError('Duplicate entry');
    expect(error.statusCode).toBe(409);
    expect(error.code).toBe(ErrorCode.CONFLICT);
  });

  it('ValidationApiError defaults to 422 with validation errors', () => {
    const validationErrors = [{ field: 'email', message: 'Invalid email' }];
    const error = new ValidationApiError('Validation failed', validationErrors);
    expect(error.statusCode).toBe(422);
    expect(error.code).toBe(ErrorCode.VALIDATION_ERROR);
    expect(error.validationErrors).toEqual(validationErrors);
  });

  it('InternalServerError defaults to 500', () => {
    const error = new InternalServerError();
    expect(error.statusCode).toBe(500);
    expect(error.code).toBe(ErrorCode.INTERNAL_ERROR);
  });

  it('ServiceUnavailableError defaults to 503', () => {
    const error = new ServiceUnavailableError('Database');
    expect(error.statusCode).toBe(503);
    expect(error.message).toBe('Database is currently unavailable');
  });
});

describe('validateRequired', () => {
  it('does not throw when all required fields are present', () => {
    expect(() =>
      validateRequired({ name: 'Alice', email: 'a@b.com' }, ['name', 'email'])
    ).not.toThrow();
  });

  it('throws ValidationApiError for missing fields', () => {
    expect(() => validateRequired({ name: '', email: null }, ['name', 'email'])).toThrow(
      ValidationApiError
    );
  });

  it('includes field names in validation errors', () => {
    try {
      validateRequired({ name: undefined, email: 'ok' }, ['name', 'email']);
    } catch (error) {
      expect(error).toBeInstanceOf(ValidationApiError);
      const apiError = error as ValidationApiError;
      expect(apiError.validationErrors).toEqual(
        expect.arrayContaining([expect.objectContaining({ field: 'name', code: 'REQUIRED' })])
      );
    }
  });
});

describe('assert', () => {
  it('does not throw when condition is true', () => {
    expect(() => assert(true, new ApiError(ErrorCode.INTERNAL_ERROR, 500, 'fail'))).not.toThrow();
  });

  it('throws the provided error when condition is false', () => {
    const error = new NotFoundError('Item');
    expect(() => assert(false, error)).toThrow(error);
  });
});
