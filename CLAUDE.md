# Next.js Starter Template

## Project Overview

Production-ready Next.js 16 starter template with React 19, TypeScript, Tailwind CSS v4, Keycloak authentication, Zustand state management, React Query, Apache ECharts, and a comprehensive 13-component UI library.

## Tech Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 + CSS custom properties (design system)
- **Auth**: NextAuth v5 + Keycloak OIDC
- **State**: Zustand (client) + React Query (server)
- **Forms**: React Hook Form + Zod v4
- **Charts**: Apache ECharts
- **Testing**: Vitest + Testing Library (unit), Playwright (E2E)

## Commands

```bash
npm run dev           # Dev server (Turbopack, port 3000)
npm run build         # Production build
npm run lint:fix      # ESLint with auto-fix
npm run typecheck     # TypeScript type check
npm test              # Unit tests
npm run test:watch    # Unit tests (watch mode)
npm run test:coverage # Unit tests + coverage
npm run test:e2e      # E2E tests (Playwright)
npm run format        # Prettier format
```

## Project Structure

```
src/
├── app/               # Pages + API routes (App Router)
├── components/ui/     # 13 reusable UI components
├── hooks/             # Custom React hooks
├── stores/            # Zustand stores
├── lib/               # Auth, API utilities, helpers
├── styles/            # Global CSS + design system
└── types/             # TypeScript definitions

tests/
├── unit/              # Vitest unit tests
└── e2e/               # Playwright E2E tests
```

## Key Conventions

- Use CSS variables for all colors: `bg-(--color-primary)`, never hardcoded hex
- Use `cn()` from `@/lib/utils/cn` for className merging
- Components use `forwardRef` with `displayName`
- Path aliases: `@/`, `@components/`, `@lib/`, `@stores/`, `@config/`, `@hooks/`
- Compound component pattern for complex components (Card, Dialog, Tabs)
