---
name: auth
description: Work with authentication using NextAuth v5 and Keycloak OIDC. Use when the user asks about authentication, login, logout, session management, protecting routes, adding auth to pages, or configuring Keycloak.
---

# Authentication (NextAuth v5 + Keycloak)

## When to Use

Use this skill when the user asks about authentication, login/logout, session management, protecting routes, or Keycloak configuration.

## Architecture

### Key Files

| File                                      | Purpose                                           |
| ----------------------------------------- | ------------------------------------------------- |
| `src/lib/auth/config.ts`                  | NextAuth configuration (provider, callbacks, JWT) |
| `src/lib/auth/index.ts`                   | Exports `handlers`, `auth`, `signIn`, `signOut`   |
| `src/app/api/auth/[...nextauth]/route.ts` | NextAuth API route handler                        |
| `src/hooks/useAuth.ts`                    | Client-side auth hook                             |
| `src/components/auth/SignInForm.tsx`      | Sign-in page component                            |
| `src/components/auth/UserMenu.tsx`        | User dropdown menu                                |
| `src/app/auth/signin/page.tsx`            | Sign-in page                                      |

### Auth Flow

1. User clicks "Sign in" -> `signIn('keycloak')` redirects to Keycloak
2. Keycloak authenticates -> redirects back with authorization code
3. NextAuth exchanges code for tokens (access, refresh, id)
4. Tokens stored in JWT cookie (no database needed)
5. `jwt` callback manages token lifecycle (initial + refresh)
6. `session` callback exposes user data + access token to client

### Token Refresh

The `jwt` callback in `config.ts` handles automatic token refresh:

- On initial sign-in: stores access/refresh tokens and expiry
- On subsequent requests: checks if token is expired
- If expired: calls Keycloak's token endpoint with refresh_token grant
- If refresh fails: sets `error: 'RefreshTokenError'`, triggers re-login via `useAuth`

## Common Tasks

### Protect a Route

Add the route prefix to `protectedRoutes` in `src/lib/auth/config.ts`:

```ts
const protectedRoutes = ['/dashboard', '/settings', '/profile', '/new-route'];
```

The `authorized` callback checks if the current path starts with any protected route prefix.

### Access Session (Server Component)

```tsx
import { auth } from '@/lib/auth';

export default async function ProtectedPage() {
  const session = await auth();

  if (!session?.user) {
    return <p>Not authenticated</p>;
  }

  return <p>Welcome, {session.user.name}</p>;
}
```

### Access Session (Client Component)

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';

export function MyComponent() {
  const { user, isAuthenticated, isLoading, login, logout } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Button onClick={login}>Sign In</Button>;

  return (
    <div>
      <p>Hello, {user?.name}</p>
      <Button onClick={logout}>Sign Out</Button>
    </div>
  );
}
```

### useAuth Hook API

```ts
interface UseAuthReturn {
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null;
  login: () => Promise<void>; // Redirects to Keycloak
  logout: () => Promise<void>; // Signs out + ends Keycloak session
}
```

### Protect an API Route

```ts
import { auth } from '@/lib/auth';
import { UnauthorizedError } from '@/lib/api/errors';

export const GET = withErrorHandling(async () => {
  const session = await auth();
  if (!session) {
    throw new UnauthorizedError();
  }

  // Use session.accessToken to call external APIs
  const response = await fetch('https://api.example.com/data', {
    headers: { Authorization: `Bearer ${session.accessToken}` },
  });

  return createSuccessResponse(await response.json());
});
```

### Access the Access Token

The access token is available in the session for calling external APIs:

```ts
// Server-side
const session = await auth();
session.accessToken; // Keycloak access token

// Client-side (via useSession)
const { data: session } = useSession();
session?.accessToken;
```

## Environment Variables

### Required

```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-with: openssl rand -base64 32"

# Keycloak (server-side only)
AUTH_KEYCLOAK_ID="your-client-id"
AUTH_KEYCLOAK_SECRET="your-client-secret"
AUTH_KEYCLOAK_ISSUER="https://keycloak.example.com/realms/your-realm"

# Keycloak (client-side, for logout redirect)
NEXT_PUBLIC_AUTH_KEYCLOAK_ID="your-client-id"
NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER="https://keycloak.example.com/realms/your-realm"
```

### Keycloak Client Configuration

- **Client type**: OpenID Connect
- **Client authentication**: ON (confidential)
- **Authentication flow**: Standard flow (Authorization Code)
- **Valid redirect URIs**: `http://localhost:3000/*`
- **Valid post logout redirect URIs**: `http://localhost:3000/*`
- **Web origins**: `http://localhost:3000`

## Logout Flow

The `logout()` function in `useAuth`:

1. Calls `signOut({ redirect: false })` to clear NextAuth session
2. Sets `signedOut` flag in sessionStorage
3. Redirects to Keycloak's logout endpoint with `post_logout_redirect_uri`
4. Keycloak ends session and redirects back to `/auth/signin`
5. `SignInForm` detects `signedOut` flag and shows "Session ended" message

## Session Strategy

- **Strategy**: JWT (no database)
- **Storage**: HTTP-only cookie
- **Provider**: Keycloak OIDC
- **Trust host**: enabled (`trustHost: true`)
- **Custom sign-in page**: `/auth/signin`

## Type Extensions

NextAuth types are extended for the access token and error fields. If you need to add more fields to the session, extend the types in the NextAuth module augmentation.

## Docker Development

```bash
docker compose up -d keycloak   # Start Keycloak (port 8080)
# Admin console: http://localhost:8080 (admin/admin)
```
