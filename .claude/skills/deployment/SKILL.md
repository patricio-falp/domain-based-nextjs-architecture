---
name: deployment
description: Build, deploy, and configure the application for production. Use when the user asks about deployment, Docker, production builds, CI/CD, environment variables, or infrastructure setup.
---

# Deployment & Production

## When to Use

Use this skill when the user asks about deploying the application, Docker configuration, production builds, CI/CD setup, or environment configuration.

## Docker Deployment

### Architecture

Multi-stage Dockerfile with 3 stages:

1. **deps** - Production dependencies only (`npm ci --omit=dev`)
2. **builder** - Full install + Next.js build
3. **runner** - Minimal Alpine image with standalone output

### Building the Docker Image

```bash
docker build -t nextjs-app .
```

### Running the Container

```bash
docker run -p 3000:3000 \
  -e NEXTAUTH_URL=https://your-domain.com \
  -e NEXTAUTH_SECRET=your-secret \
  -e AUTH_KEYCLOAK_ID=your-client-id \
  -e AUTH_KEYCLOAK_SECRET=your-client-secret \
  -e AUTH_KEYCLOAK_ISSUER=https://keycloak.your-domain.com/realms/your-realm \
  nextjs-app
```

### Docker Compose (Development)

```bash
docker compose up -d          # Start all services
docker compose down           # Stop all services
docker compose logs -f app    # View app logs
```

Services defined in `docker-compose.yml`:

- `app` - Next.js application (port 3000)
- `keycloak` - Keycloak identity server (port 8080, admin/admin)

### Key Docker Configuration

- **Base image**: `node:22-alpine`
- **Output mode**: `standalone` (configured in `next.config.ts`)
- **User**: `nextjs` (unprivileged, UID 1001)
- **Port**: 3000
- **Hostname**: `0.0.0.0` (bind to all interfaces)
- **Health check**: Available via `/api/health`

## Next.js Production Build

### Building Locally

```bash
npm run build     # Production build
npm run start     # Start production server
```

### Output Configuration (`next.config.ts`)

- `output: 'standalone'` - Self-contained builds for Docker
- Turbopack enabled for development
- Security headers added automatically

### Security Headers (Applied Automatically)

| Header                 | Value                                    |
| ---------------------- | ---------------------------------------- |
| X-DNS-Prefetch-Control | on                                       |
| X-Frame-Options        | SAMEORIGIN                               |
| X-Content-Type-Options | nosniff                                  |
| Referrer-Policy        | strict-origin-when-cross-origin          |
| Permissions-Policy     | camera=(), microphone=(), geolocation=() |

## Environment Variables

### Required (.env)

```bash
# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Keycloak OIDC
AUTH_KEYCLOAK_ID=your-client-id
AUTH_KEYCLOAK_SECRET=your-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm

# Public (exposed to client)
NEXT_PUBLIC_AUTH_KEYCLOAK_ID=your-client-id
NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/your-realm
```

### Environment Variable Types

- `NEXT_PUBLIC_*` - Exposed to client-side code (inlined at build time)
- Without prefix - Server-side only (available in API routes, server components)

### Generating NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/`)

The project includes CI configuration. Key steps:

1. Install dependencies (`npm ci`)
2. Type check (`npm run typecheck`)
3. Lint (`npm run lint`)
4. Unit tests (`npm test`)
5. Build (`npm run build`)
6. E2E tests (`npm run test:e2e`)

### Pre-Commit Hooks (Husky)

Configured in `.husky/`:

- **pre-commit**: Runs lint-staged
  - TypeScript files: ESLint + Prettier
  - JSON/CSS/Markdown: Prettier only

## Health Check

Available at `GET /api/health`:

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.678
}
```

Use for Docker health checks and load balancer health probes.

## Production Checklist

1. Set all required environment variables
2. Generate a strong `NEXTAUTH_SECRET`
3. Configure Keycloak with correct redirect URIs
4. Build and test the Docker image locally
5. Verify `/api/health` returns 200
6. Test authentication flow end-to-end
7. Review security headers in browser DevTools
8. Ensure `NODE_ENV=production` is set
