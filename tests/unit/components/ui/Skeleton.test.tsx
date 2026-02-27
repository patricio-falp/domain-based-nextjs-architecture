import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Skeleton, SkeletonText, SkeletonAvatar, SkeletonCard } from '@components/ui/Skeleton';

describe('Skeleton', () => {
  it('renders with role=status and aria-busy', () => {
    render(<Skeleton />);
    const el = screen.getByRole('status');
    expect(el).toBeInTheDocument();
    expect(el).toHaveAttribute('aria-busy', 'true');
    expect(el).toHaveAttribute('aria-label', 'Loading...');
  });

  it('applies width and height as numbers (px)', () => {
    render(<Skeleton width={100} height={50} />);
    const el = screen.getByRole('status');
    expect(el.style.width).toBe('100px');
    expect(el.style.height).toBe('50px');
  });

  it('applies width and height as strings', () => {
    render(<Skeleton width="80%" height="2rem" />);
    const el = screen.getByRole('status');
    expect(el.style.width).toBe('80%');
    expect(el.style.height).toBe('2rem');
  });

  it('applies rounded-full class when circle=true', () => {
    render(<Skeleton circle />);
    expect(screen.getByRole('status').className).toContain('rounded-full');
  });

  it('applies animate-pulse class by default', () => {
    render(<Skeleton />);
    expect(screen.getByRole('status').className).toContain('animate-pulse');
  });

  it('does not animate when animate=false', () => {
    render(<Skeleton animate={false} />);
    expect(screen.getByRole('status').className).not.toContain('animate-pulse');
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLDivElement>();
    render(<Skeleton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

describe('SkeletonText', () => {
  it('renders 3 lines by default', () => {
    render(<SkeletonText />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons).toHaveLength(3);
  });

  it('renders custom number of lines', () => {
    render(<SkeletonText lines={5} />);
    expect(screen.getAllByRole('status')).toHaveLength(5);
  });
});

describe('SkeletonAvatar', () => {
  it('renders a circular skeleton', () => {
    render(<SkeletonAvatar />);
    const el = screen.getByRole('status');
    expect(el.className).toContain('rounded-full');
  });

  it('renders all sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    for (const size of sizes) {
      const { unmount } = render(<SkeletonAvatar size={size} />);
      expect(screen.getByRole('status')).toBeInTheDocument();
      unmount();
    }
  });
});

describe('SkeletonCard', () => {
  it('renders multiple skeleton elements', () => {
    render(<SkeletonCard />);
    const skeletons = screen.getAllByRole('status');
    expect(skeletons.length).toBeGreaterThan(1);
  });
});
