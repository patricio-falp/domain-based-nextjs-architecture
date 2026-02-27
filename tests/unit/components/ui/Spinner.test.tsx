import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Spinner, SpinnerOverlay, SpinnerCentered } from '@components/ui/Spinner';

describe('Spinner', () => {
  it('renders with role=status', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has default aria-label "Loading..."', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading...');
  });

  it('uses custom label', () => {
    render(<Spinner label="Fetching data..." />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Fetching data...');
    expect(screen.getByText('Fetching data...')).toBeInTheDocument();
  });

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Spinner size={size} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      unmount();
    }
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('SpinnerOverlay', () => {
  it('renders when visible=true', () => {
    render(<SpinnerOverlay visible />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('does not render when visible=false', () => {
    render(<SpinnerOverlay visible={false} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });
});

describe('SpinnerCentered', () => {
  it('renders a centered spinner', () => {
    render(<SpinnerCentered />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
