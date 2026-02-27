import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Avatar } from '@components/ui/Avatar';

describe('Avatar', () => {
  it('renders initials from name', () => {
    render(<Avatar name="John Doe" />);
    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders single initial from one-word name', () => {
    render(<Avatar name="John" />);
    expect(screen.getByText('J')).toBeInTheDocument();
  });

  it('renders image when src is provided', () => {
    render(<Avatar src="/photo.jpg" name="John Doe" />);
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', '/photo.jpg');
    expect(img).toHaveAttribute('alt', 'John Doe');
  });

  it('renders fallback icon when no name or src', () => {
    const { container } = render(<Avatar />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders all sizes without crashing', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;
    for (const size of sizes) {
      const { unmount } = render(<Avatar name="Test" size={size} />);
      expect(screen.getByText('T')).toBeInTheDocument();
      unmount();
    }
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLSpanElement>();
    render(<Avatar ref={ref} name="Test" />);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it('applies custom className', () => {
    const { container } = render(<Avatar name="Test" className="custom-class" />);
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
