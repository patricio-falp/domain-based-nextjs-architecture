import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Card } from '@components/ui/Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('renders all variants without crashing', () => {
    const variants = ['elevated', 'outlined', 'filled'] as const;
    for (const variant of variants) {
      const { unmount } = render(<Card variant={variant}>Content</Card>);
      expect(screen.getByText('Content')).toBeInTheDocument();
      unmount();
    }
  });

  it('applies cursor-pointer when hoverable', () => {
    const { container } = render(<Card hoverable>Hover</Card>);
    expect(container.firstElementChild!.className).toContain('cursor-pointer');
  });

  it('does not apply cursor-pointer by default', () => {
    const { container } = render(<Card>Default</Card>);
    expect(container.firstElementChild!.className).not.toContain('cursor-pointer');
  });
});

describe('Card.Header', () => {
  it('renders title', () => {
    render(
      <Card>
        <Card.Header title="My Title" />
      </Card>
    );
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(
      <Card>
        <Card.Header title="Title" description="Description text" />
      </Card>
    );
    expect(screen.getByText('Description text')).toBeInTheDocument();
  });

  it('renders actions', () => {
    render(
      <Card>
        <Card.Header title="Title" actions={<button>Action</button>} />
      </Card>
    );
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
  });
});

describe('Card.Content', () => {
  it('renders children', () => {
    render(
      <Card>
        <Card.Content>Content here</Card.Content>
      </Card>
    );
    expect(screen.getByText('Content here')).toBeInTheDocument();
  });
});

describe('Card.Footer', () => {
  it('renders children', () => {
    render(
      <Card>
        <Card.Footer>Footer content</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Footer content')).toBeInTheDocument();
  });
});

describe('Card compound pattern', () => {
  it('renders header, content, and footer together', () => {
    render(
      <Card>
        <Card.Header title="Header" />
        <Card.Content>Body</Card.Content>
        <Card.Footer>Actions</Card.Footer>
      </Card>
    );
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });
});
