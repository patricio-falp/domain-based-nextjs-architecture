---
name: unit-test
description: Create or update unit tests using Vitest and React Testing Library. Use when the user asks to write tests, add test coverage, create unit tests, or test a component/hook/store/utility. Follows project testing patterns and conventions.
---

# Unit Testing

## When to Use

Use this skill when the user asks to create unit tests, add test coverage, or test a specific component, hook, store, or utility function.

## Project Testing Stack

- **Runner**: Vitest 4.x with globals enabled
- **DOM**: jsdom environment
- **React Testing**: @testing-library/react + @testing-library/user-event
- **Matchers**: @testing-library/jest-dom (toBeInTheDocument, toBeVisible, etc.)
- **Mocking**: Vitest built-in (vi.fn, vi.mock, vi.spyOn)

## File Location & Naming

```
tests/unit/
├── components/ui/{Component}.test.tsx    # UI component tests
├── hooks/{hookName}.test.ts              # Hook tests
├── lib/api/{utility}.test.ts             # API utility tests
└── stores/{storeName}.test.ts            # Zustand store tests
```

Test files must match pattern: `*.{test,spec}.{ts,tsx}`

## Running Tests

```bash
npm test              # Run all unit tests once
npm run test:watch    # Watch mode
npm run test:coverage # With coverage report
```

## Component Test Template

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { MyComponent } from '@/components/ui/MyComponent';

describe('MyComponent', () => {
  // Basic rendering
  it('renders with children', () => {
    render(<MyComponent>Hello</MyComponent>);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  // Variant testing (iterate all variants)
  it('renders all variants without crashing', () => {
    const variants = ['primary', 'secondary', 'ghost'] as const;
    for (const variant of variants) {
      const { unmount } = render(<MyComponent variant={variant}>{variant}</MyComponent>);
      expect(screen.getByText(variant)).toBeInTheDocument();
      unmount();
    }
  });

  // Size testing
  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<MyComponent size={size}>{size}</MyComponent>);
      expect(screen.getByText(size)).toBeInTheDocument();
      unmount();
    }
  });

  // Interaction testing
  it('handles click events', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<MyComponent onClick={onClick}>Click me</MyComponent>);
    await user.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledOnce();
  });

  // Disabled state
  it('does not fire events when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <MyComponent disabled onClick={onClick}>
        Click
      </MyComponent>
    );
    await user.click(screen.getByText('Click'));
    expect(onClick).not.toHaveBeenCalled();
  });

  // Ref forwarding
  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<MyComponent ref={ref}>Ref</MyComponent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  // Custom className
  it('applies custom className', () => {
    render(<MyComponent className="custom-class">Custom</MyComponent>);
    expect(screen.getByText('Custom').className).toContain('custom-class');
  });

  // Accessibility
  it('has correct ARIA attributes', () => {
    render(<MyComponent aria-label="test label">Content</MyComponent>);
    expect(screen.getByLabelText('test label')).toBeInTheDocument();
  });
});
```

## Hook Test Template

```tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyHook } from '@/hooks/useMyHook';

describe('useMyHook', () => {
  beforeEach(() => {
    // Reset any mocks or localStorage
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useMyHook());
    expect(result.current.value).toBe('initial');
  });

  it('updates state correctly', () => {
    const { result } = renderHook(() => useMyHook());
    act(() => {
      result.current.setValue('new value');
    });
    expect(result.current.value).toBe('new value');
  });
});
```

## Zustand Store Test Template

```tsx
import { describe, it, expect, beforeEach } from 'vitest';
import { useMyStore } from '@/stores/myStore';

describe('myStore', () => {
  beforeEach(() => {
    // Reset store to initial state
    useMyStore.setState(useMyStore.getInitialState());
  });

  it('has correct initial state', () => {
    const state = useMyStore.getState();
    expect(state.items).toEqual([]);
  });

  it('adds an item', () => {
    useMyStore.getState().addItem({ id: '1', name: 'Test' });
    expect(useMyStore.getState().items).toHaveLength(1);
  });

  it('removes an item', () => {
    useMyStore.getState().addItem({ id: '1', name: 'Test' });
    useMyStore.getState().removeItem('1');
    expect(useMyStore.getState().items).toHaveLength(0);
  });
});
```

## API Utility Test Template

```tsx
import { describe, it, expect } from 'vitest';
import { myUtilFunction } from '@/lib/api/myUtil';

describe('myUtilFunction', () => {
  it('handles valid input', () => {
    const result = myUtilFunction('valid');
    expect(result).toBe('expected output');
  });

  it('throws on invalid input', () => {
    expect(() => myUtilFunction('')).toThrow();
  });
});
```

## Testing Patterns

### Query Priority (from Testing Library best practices)

1. `getByRole` - preferred for interactive elements (button, checkbox, etc.)
2. `getByLabelText` - for form elements
3. `getByText` - for non-interactive text content
4. `getByTestId` - last resort only

### User Interactions

Always use `userEvent` over `fireEvent`:

```tsx
const user = userEvent.setup();
await user.click(element);
await user.type(input, 'text');
await user.keyboard('{Escape}');
```

### Assertions

Use jest-dom matchers:

- `toBeInTheDocument()` - element exists in DOM
- `toBeVisible()` - element is visible
- `toBeDisabled()` - element is disabled
- `toHaveAttribute('attr', 'value')` - attribute check
- `toHaveClass('class-name')` - class check
- `toHaveTextContent('text')` - text content

### What to Test

- All variants/sizes render without crashing
- User interactions (click, type, keyboard)
- Disabled/loading states
- Ref forwarding
- Custom className application
- ARIA attributes
- Conditional rendering
- Error states

### What NOT to Test

- Implementation details (internal state names, private functions)
- Styling classes (test behavior, not appearance)
- Third-party library internals
