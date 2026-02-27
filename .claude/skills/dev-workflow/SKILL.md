---
name: dev-workflow
description: Development workflow including running the dev server, linting, formatting, type checking, testing, and git hooks. Use when the user asks how to run the project, fix lint errors, format code, check types, or wants to understand the development process.
---

# Development Workflow

## When to Use

Use this skill when the user asks about running the project, fixing lint/format issues, the development process, or project commands.

## Quick Reference Commands

| Command                 | Description                                 |
| ----------------------- | ------------------------------------------- |
| `npm run dev`           | Start dev server with Turbopack (port 3000) |
| `npm run build`         | Production build                            |
| `npm run start`         | Start production server                     |
| `npm run lint`          | Run ESLint                                  |
| `npm run lint:fix`      | Run ESLint with auto-fix                    |
| `npm run typecheck`     | TypeScript type checking                    |
| `npm test`              | Run unit tests (Vitest)                     |
| `npm run test:watch`    | Unit tests in watch mode                    |
| `npm run test:coverage` | Unit tests with coverage report             |
| `npm run test:e2e`      | Run E2E tests (Playwright)                  |
| `npm run format`        | Format code with Prettier                   |
| `npm run format:check`  | Check formatting without changes            |

## Development Flow

### 1. Start Development

```bash
# Start the dev server
npm run dev

# Start supporting services (Keycloak)
docker compose up -d keycloak
```

The dev server runs at http://localhost:3000 with Turbopack for fast refreshes.

### 2. Write Code

Follow project conventions:

- Components in `src/components/`
- Pages in `src/app/`
- Hooks in `src/hooks/`
- Stores in `src/stores/`
- API routes in `src/app/api/`
- Utilities in `src/lib/`

### 3. Verify Code Quality

```bash
# Type check
npm run typecheck

# Lint
npm run lint:fix

# Format
npm run format
```

### 4. Write & Run Tests

```bash
# Unit tests
npm test

# Watch mode during development
npm run test:watch

# E2E tests (requires dev server running)
npm run test:e2e
```

### 5. Pre-Commit Checks

Husky runs automatically on `git commit`:

- **lint-staged** checks staged files:
  - `.ts/.tsx` files: ESLint + Prettier
  - `.json/.css/.md` files: Prettier only

If pre-commit fails, fix the issues and stage again.

## Project Structure

```
src/
├── app/               # Next.js App Router (pages + API)
│   ├── api/           # API routes
│   ├── auth/          # Auth pages
│   ├── dashboard/     # Dashboard page
│   ├── components/    # Component showcase page
│   ├── charts/        # Charts demo page
│   ├── profile/       # User profile page
│   ├── layout.tsx     # Root layout
│   ├── providers.tsx  # Client providers
│   └── header.tsx     # Navigation header
├── components/
│   ├── ui/            # Reusable UI components (13)
│   ├── auth/          # Auth components
│   ├── charts/        # Chart components
│   ├── theme/         # Theme toggle
│   └── toast/         # Toast notifications
├── hooks/             # Custom React hooks
├── stores/            # Zustand state stores
├── lib/
│   ├── auth/          # NextAuth configuration
│   ├── api/           # Error handling, pagination, validation
│   └── utils/         # Utility functions (cn)
├── config/            # App constants
├── styles/            # Global CSS + design system
└── types/             # TypeScript type definitions

tests/
├── unit/              # Vitest unit tests
│   ├── components/    # Component tests
│   ├── hooks/         # Hook tests
│   ├── lib/           # Utility tests
│   └── stores/        # Store tests
├── e2e/               # Playwright E2E tests
└── setup.ts           # Test setup
```

## Import Aliases

```ts
import { Button } from '@/components/ui/Button'; // @/ → src/
import { Button } from '@components/ui/Button'; // @components/ → src/components/
import { cn } from '@lib/utils/cn'; // @lib/ → src/lib/
import { useToastStore } from '@stores/toast'; // @stores/ → src/stores/
import { STORAGE_KEYS } from '@config/constants'; // @config/ → src/config/
import { useTheme } from '@hooks/useTheme'; // @hooks/ → src/hooks/
```

## Code Quality Tools

### ESLint (v9, Flat Config)

Config: `eslint.config.mjs`

- Next.js recommended rules
- TypeScript strict rules

### Prettier

Config: `.prettierrc`

- Runs on all supported file types
- Integrated with lint-staged

### TypeScript

Config: `tsconfig.json`

- Strict mode enabled
- Target: ES2017
- 6 path aliases configured

## Troubleshooting

### Dev server won't start

```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Type errors

```bash
npm run typecheck
```

### Lint errors won't auto-fix

Some rules require manual fixes. Check the ESLint output for specific rule IDs.

### E2E tests fail

```bash
# Install Playwright browsers
npx playwright install

# Run in debug mode
npx playwright test --debug
```

### Dependency issues

```bash
rm -rf node_modules package-lock.json
npm install
```
