import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { Alert } from '@components/ui/Alert';

describe('Alert', () => {
  it('renders with children', () => {
    render(<Alert>Hello world</Alert>);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Hello world')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(<Alert title="Important">Content</Alert>);
    expect(screen.getByText('Important')).toBeInTheDocument();
  });

  it('renders all variants without crashing', () => {
    const variants = ['info', 'success', 'warning', 'error'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Alert variant={variant}>{variant}</Alert>);
      expect(screen.getByRole('alert')).toBeInTheDocument();
      unmount();
    }
  });

  it('shows dismiss button when dismissible', () => {
    render(<Alert dismissible>Content</Alert>);
    expect(screen.getByLabelText('Dismiss')).toBeInTheDocument();
  });

  it('does not show dismiss button by default', () => {
    render(<Alert>Content</Alert>);
    expect(screen.queryByLabelText('Dismiss')).not.toBeInTheDocument();
  });

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();
    render(
      <Alert dismissible onDismiss={onDismiss}>
        Content
      </Alert>
    );
    await user.click(screen.getByLabelText('Dismiss'));
    expect(onDismiss).toHaveBeenCalledOnce();
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Alert ref={ref}>Content</Alert>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('applies custom className', () => {
    render(<Alert className="custom-class">Content</Alert>);
    expect(screen.getByRole('alert')).toHaveClass('custom-class');
  });
});
