---
name: create-api-route
description: Create a new Next.js API route with standardized error handling, validation, and response formats. Use when the user asks to add an API endpoint, backend route, server endpoint, or REST API handler.
---

# Create API Route

## When to Use

Use this skill when the user asks to create a new API endpoint, backend route, or server-side handler.

## Project Conventions

### File Location

`src/app/api/{resource}/route.ts`

For dynamic routes: `src/app/api/{resource}/[id]/route.ts`

### Basic Route Template

```ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    data: [],
    meta: { total: 0 },
  });
}
```

### Route with Error Handling (Recommended)

```ts
import { NextRequest } from 'next/server';
import {
  withErrorHandling,
  createSuccessResponse,
  NotFoundError,
  ValidationApiError,
  validateRequired,
} from '@/lib/api/errors';

// GET /api/resource
export const GET = withErrorHandling(async (request: NextRequest) => {
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');

  // Fetch data...
  const data = [];
  const total = 0;

  return createSuccessResponse(data, { page, limit, total });
});

// POST /api/resource
export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();

  // Validate required fields
  validateRequired(body, ['name', 'email']);

  // Create resource...
  const created = { id: '1', ...body };

  return createSuccessResponse(created);
});

// PUT /api/resource/[id]
export const PUT = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const body = await request.json();

    // Find resource or throw
    const resource = null; // fetch from DB
    if (!resource) {
      throw new NotFoundError('Resource', id);
    }

    // Update...
    return createSuccessResponse({ id, ...body });
  }
);

// DELETE /api/resource/[id]
export const DELETE = withErrorHandling(
  async (request: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;

    // Find and delete...
    return createSuccessResponse({ deleted: true });
  }
);
```

### Route with Zod Validation

```ts
import { NextRequest } from 'next/server';
import { z } from 'zod';
import { withErrorHandling, createSuccessResponse, ValidationApiError } from '@/lib/api/errors';

const CreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Invalid email'),
  role: z.enum(['admin', 'user', 'viewer']).optional(),
});

export const POST = withErrorHandling(async (request: NextRequest) => {
  const body = await request.json();
  const result = CreateSchema.safeParse(body);

  if (!result.success) {
    const errors = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));
    throw new ValidationApiError('Validation failed', errors);
  }

  const validated = result.data;
  // Create resource with validated data...

  return createSuccessResponse(validated);
});
```

### Dynamic Route (force-dynamic)

For routes that should never be cached:

```ts
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
}
```

## Error Response Format

The project uses standardized error responses via `@/lib/api/errors`:

```json
{
  "code": "VALIDATION_ERROR",
  "message": "Validation failed",
  "details": "Optional details",
  "validationErrors": [{ "field": "email", "message": "Invalid email", "code": "INVALID" }],
  "requestId": "req_1234567890_abc",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/resource"
}
```

## Available Error Classes

- `UnauthorizedError(message?)` - 401
- `ForbiddenError(message?)` - 403
- `NotFoundError(resource, id?)` - 404
- `ConflictError(message)` - 409
- `ValidationApiError(message, errors[])` - 422
- `InternalServerError(message?)` - 500
- `ServiceUnavailableError(service)` - 503

## Authentication in Routes

```ts
import { auth } from '@/lib/auth';

export const GET = withErrorHandling(async () => {
  const session = await auth();
  if (!session) {
    throw new UnauthorizedError();
  }

  // Authenticated logic...
  return createSuccessResponse({ user: session.user });
});
```
