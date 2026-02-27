import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { Breadcrumbs } from '@components/ui/Breadcrumbs';

describe('Breadcrumbs', () => {
  const items = [
    { label: 'Home', href: '/' },
    { label: 'Settings', href: '/settings' },
    { label: 'Profile' },
  ];

  it('renders all items', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('renders links for items with href', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/');
    expect(screen.getByText('Settings').closest('a')).toHaveAttribute('href', '/settings');
  });

  it('renders last item as text without link', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Profile').closest('a')).toBeNull();
  });

  it('sets aria-current on the last item', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByText('Profile')).toHaveAttribute('aria-current', 'page');
  });

  it('has proper nav landmark with aria-label', () => {
    render(<Breadcrumbs items={items} />);
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Breadcrumb');
  });

  it('renders separator icons between items', () => {
    const { container } = render(<Breadcrumbs items={items} />);
    const separators = container.querySelectorAll('svg');
    expect(separators).toHaveLength(2);
  });

  it('forwards ref', () => {
    const ref = createRef<HTMLElement>();
    render(<Breadcrumbs ref={ref} items={items} />);
    expect(ref.current).toBeInstanceOf(HTMLElement);
  });
});
