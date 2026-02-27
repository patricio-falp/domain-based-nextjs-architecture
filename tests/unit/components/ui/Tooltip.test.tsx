import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipProvider } from '@components/ui/Tooltip';

function renderWithProvider(ui: React.ReactElement) {
  return render(<TooltipProvider>{ui}</TooltipProvider>);
}

describe('Tooltip', () => {
  it('renders the trigger element', () => {
    renderWithProvider(
      <Tooltip content="Tooltip text">
        <button>Hover me</button>
      </Tooltip>
    );
    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('renders with different side props without crashing', () => {
    const sides = ['top', 'right', 'bottom', 'left'] as const;
    for (const side of sides) {
      const { unmount } = renderWithProvider(
        <Tooltip content={`${side} tooltip`} side={side}>
          <button>{side}</button>
        </Tooltip>
      );
      expect(screen.getByRole('button', { name: side })).toBeInTheDocument();
      unmount();
    }
  });
});
