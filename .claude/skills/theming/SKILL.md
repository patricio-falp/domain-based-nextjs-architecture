---
name: theming
description: Work with the design system, theming, and CSS variables. Use when the user asks to add colors, modify the theme, update styling tokens, create a new color variant, adjust the design system, or customize the look and feel.
---

# Design System & Theming

## When to Use

Use this skill when the user asks to modify the design system, add new colors, adjust theme tokens, or work with the CSS variable system.

## Architecture Overview

### Theme System

- **CSS-first**: Themes defined entirely in CSS custom properties
- **Auto-switching**: Uses `light-dark()` CSS function for automatic light/dark mode
- **Three modes**: Light, Dark, System (follows OS preference)
- **No JS theme provider needed**: CSS handles everything

### Key Files

- `src/styles/global.css` - All CSS variables and design tokens
- `src/hooks/useTheme.ts` - Theme toggle hook
- `src/components/theme/ThemeToggle.tsx` - Theme toggle component
- `src/stores/preferences.ts` - Theme preference persistence
- `src/app/layout.tsx` - Inline script to prevent FOUC

### How Theme Switching Works

1. Inline script in layout.tsx reads `localStorage('app-theme')` before React hydrates
2. Sets `data-theme="light|dark"` on `<html>` element (or removes for system)
3. CSS uses `color-scheme: light dark` + `light-dark()` function
4. `[data-theme="light"]` forces `color-scheme: light`
5. `[data-theme="dark"]` forces `color-scheme: dark`

## CSS Variable System

### Adding a New Color

In `src/styles/global.css`, add to the `:root` block:

```css
:root {
  /* New semantic color */
  --color-accent: light-dark(#7c3aed, #a78bfa);
  --color-accent-hover: light-dark(#6d28d9, #c4b5fd);
  --color-accent-muted: light-dark(#ede9fe, #2e1065);
  --color-accent-fg: light-dark(#ffffff, #ffffff);
}
```

Then register it in the `@theme` block for Tailwind:

```css
@theme {
  --color-accent-default: var(--color-accent);
  --color-accent-hover: var(--color-accent-hover);
  --color-accent-muted: var(--color-accent-muted);
  --color-accent-foreground: var(--color-accent-fg);
}
```

### Available Token Categories

#### Backgrounds

| Variable              | Usage                     |
| --------------------- | ------------------------- |
| `--color-bg`          | Main content background   |
| `--color-bg-subtle`   | Page-level background     |
| `--color-bg-muted`    | Subdued backgrounds       |
| `--color-bg-elevated` | Elevated surfaces (cards) |
| `--color-bg-hover`    | Hover state backgrounds   |
| `--color-bg-active`   | Active/pressed state      |

#### Text

| Variable            | Usage                  |
| ------------------- | ---------------------- |
| `--color-fg`        | Primary text           |
| `--color-fg-muted`  | Secondary text         |
| `--color-fg-subtle` | Tertiary/disabled text |

#### Borders

| Variable               | Usage           |
| ---------------------- | --------------- |
| `--color-border`       | Default borders |
| `--color-border-muted` | Subtle borders  |

#### Semantic Colors

Each semantic color has 4 variants: base, hover, muted, fg

- `--color-primary-*` (FALP Blue #003876)
- `--color-secondary-*` (FALP Gold #FDB913)
- `--color-success-*` (Green)
- `--color-warning-*` (Amber)
- `--color-error-*` (Red)
- `--color-info-*` (Blue)

#### Shadows

| Variable      | Usage          |
| ------------- | -------------- |
| `--shadow-xs` | Subtle depth   |
| `--shadow-sm` | Cards, buttons |
| `--shadow-md` | Dropdowns      |
| `--shadow-lg` | Modals         |
| `--shadow-xl` | Popovers       |

Dark mode overrides shadow opacity automatically in `[data-theme="dark"]`.

#### Spacing

`--spacing-xs` (0.25rem) through `--spacing-2xl` (3rem)

#### Border Radius

`--radius-sm` (0.5rem) through `--radius-full` (9999px)

#### Typography

- `--font-sans` - System sans-serif stack
- `--font-mono` - Monospace stack

#### Transitions

- `--transition-fast` (150ms)
- `--transition-normal` (200ms)
- `--transition-slow` (300ms)

#### Z-Index

`--z-dropdown` (1000) through `--z-tooltip` (1070)

## Using Variables in Components

### Tailwind v4 Syntax

```tsx
// Correct - Tailwind v4 CSS variable syntax
className = 'bg-(--color-bg) text-(--color-fg)';
className = 'hover:bg-(--color-bg-hover)';
className = 'border border-(--color-border)';

// Wrong - old bracket syntax
className = 'bg-[var(--color-bg)]'; // Don't use this
```

### Direct CSS (rare)

```css
.my-class {
  background-color: var(--color-bg);
  color: var(--color-fg);
  border: 1px solid var(--color-border);
}
```

## Dark Mode Considerations

- All colors use `light-dark()` so they auto-switch
- Shadows are overridden in `[data-theme="dark"]` for more contrast
- Never hardcode hex colors in components — always use CSS variables
- Test both themes when adding new colors

## FALP Brand Colors (Reference)

- **Azul FALP**: #003876 (light primary), #4a90d9 (dark primary)
- **Dorado FALP**: #FDB913 (accent/secondary)
