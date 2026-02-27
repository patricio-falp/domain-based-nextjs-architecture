# Next.js Starter Template

A production-ready Next.js starter with authentication, theming, a full UI component library, and comprehensive testing infrastructure.

## Tech Stack

| Category         | Technology                                 | Version  |
| ---------------- | ------------------------------------------ | -------- |
| Framework        | Next.js (App Router + Turbopack)           | 16       |
| UI               | React                                      | 19       |
| Language         | TypeScript                                 | 5        |
| Styling          | Tailwind CSS (CSS-first config)            | 4        |
| Auth             | NextAuth.js + Keycloak OIDC                | 5 (beta) |
| Client State     | Zustand                                    | 5        |
| Server State     | TanStack React Query                       | 5        |
| Forms            | React Hook Form + Zod v4                   | 7 / 4    |
| UI Primitives    | Radix UI (Dialog, Select, Tabs, Checkbox)  | latest   |
| Icons            | lucide-react                               | latest   |
| Unit Testing     | Vitest + Testing Library                   | 4        |
| E2E Testing      | Playwright                                 | latest   |
| Code Quality     | ESLint v9 + Prettier + Husky + lint-staged | latest   |
| Containerization | Docker (multi-stage, Node 22-Alpine)       | latest   |

## Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable               | Description                           | Example                                 |
| ---------------------- | ------------------------------------- | --------------------------------------- |
| `NEXTAUTH_URL`         | App URL                               | `http://localhost:3000`                 |
| `NEXTAUTH_SECRET`      | JWT signing secret                    | `openssl rand -base64 32`               |
| `AUTH_KEYCLOAK_ID`     | Keycloak client ID                    | `my-app`                                |
| `AUTH_KEYCLOAK_SECRET` | Keycloak client secret (confidential) | `xxxxxxxx`                              |
| `AUTH_KEYCLOAK_ISSUER` | Keycloak realm URL                    | `http://localhost:8080/realms/my-realm` |

## Scripts

| Command                 | Description                         |
| ----------------------- | ----------------------------------- |
| `npm run dev`           | Start dev server (Turbopack)        |
| `npm run build`         | Production build                    |
| `npm start`             | Start production server             |
| `npm run lint`          | Run ESLint                          |
| `npm run lint:fix`      | Fix linting issues                  |
| `npm run typecheck`     | TypeScript type check               |
| `npm test`              | Run unit tests (180 tests)          |
| `npm run test:watch`    | Unit tests in watch mode            |
| `npm run test:coverage` | Tests with coverage report          |
| `npm run test:e2e`      | Run Playwright E2E tests (18 tests) |
| `npm run test:e2e:ui`   | E2E tests with Playwright UI        |
| `npm run format`        | Format with Prettier                |
| `npm run format:check`  | Check formatting                    |

## Project Structure

```
src/
├── app/                       # Next.js App Router
│   ├── api/
│   │   ├── auth/[...nextauth]/ # NextAuth route handler
│   │   └── health/             # Health check endpoint
│   ├── auth/signin/            # Sign-in page
│   ├── components/             # Component showcase + demos
│   ├── dashboard/              # Protected dashboard
│   ├── error.tsx               # Error boundary page
│   ├── loading.tsx             # Loading skeleton
│   ├── not-found.tsx           # 404 page
│   ├── header.tsx              # Navigation header
│   ├── layout.tsx              # Root layout
│   ├── providers.tsx           # Client providers
│   └── sitemap.ts              # SEO sitemap
├── components/
│   ├── ui/                     # 13 reusable UI components
│   ├── auth/                   # SignInForm, UserMenu
│   ├── theme/                  # ThemeToggle
│   └── toast/                  # ToastContainer
├── hooks/                      # useAuth, useTheme, useDemoData
├── stores/                     # Zustand: toast, ui, preferences
├── lib/
│   ├── auth/                   # NextAuth config + initialization
│   ├── api/                    # Error handling, pagination, validation
│   └── utils/                  # cn() class merger
├── config/                     # App constants
├── styles/                     # Global CSS (design system)
└── types/                      # TypeScript declarations
```

## Documentation

| Document                                       | Description                                     |
| ---------------------------------------------- | ----------------------------------------------- |
| [Architecture](docs/ARCHITECTURE.md)           | Project structure, patterns, and infrastructure |
| [Components](docs/COMPONENTS.md)               | UI component library reference (13 components)  |
| [Adding Components](docs/ADDING-COMPONENTS.md) | Step-by-step guide to create new UI components  |
| [Authentication](docs/AUTHENTICATION.md)       | NextAuth + Keycloak setup and configuration     |
| [Design System](docs/DESIGN-SYSTEM.md)         | CSS variables, theming, color palette           |
| [Testing](docs/TESTING.md)                     | Unit tests, E2E tests, and testing patterns     |

## UI Components

13 production-ready components with consistent API:

| Component           | Type   | Key Features                                     |
| ------------------- | ------ | ------------------------------------------------ |
| **Button**          | Custom | 5 variants, 3 sizes, loading, icons              |
| **Badge**           | Custom | 5 variants, dot indicator                        |
| **Card**            | Custom | Compound pattern (Header/Content/Footer)         |
| **Input**           | Custom | Label, error, addons, 3 sizes                    |
| **Dialog**          | Radix  | Primitives + backward-compatible `Modal` wrapper |
| **Select**          | Radix  | Primitives + `SimpleSelect` wrapper              |
| **Tabs**            | Radix  | Compound pattern, icon triggers                  |
| **Checkbox**        | Radix  | Indeterminate state, label                       |
| **Spinner**         | Custom | 4 sizes, overlay + centered variants             |
| **Skeleton**        | Custom | Text, Avatar, Card presets                       |
| **DataTable**       | Custom | Generic `<T>`, sorting, selection, pagination    |
| **ResizablePanels** | Custom | Horizontal + vertical splits                     |
| **ErrorBoundary**   | Custom | Page, Component, Silent variants + HOC           |

All components support light/dark theming, ref forwarding, TypeScript types, and ARIA accessibility.

## Authentication

- **Provider**: Keycloak (OpenID Connect)
- **Flow**: Authorization Code with `client_secret` (confidential client)
- **Session**: JWT-based (no database required)
- **Protected routes**: `/dashboard`, `/settings`, `/profile`

See [Authentication docs](docs/AUTHENTICATION.md) for Keycloak setup instructions.

## Docker

```bash
# Development with Keycloak
docker compose up

# Production build
docker build -t my-app .
docker run -p 3000:3000 --env-file .env my-app
```

The `docker-compose.yml` includes:

- **app**: Next.js application (port 3000)
- **keycloak**: Keycloak 26.0 identity server (port 8080)

## Testing

```bash
# Unit tests (180 tests across 19 suites)
npm test

# Unit tests with coverage
npm run test:coverage

# E2E tests (18 tests — smoke, navigation, components)
npm run test:e2e
```

See [Testing docs](docs/TESTING.md) for detailed test coverage.

## License

MIT
