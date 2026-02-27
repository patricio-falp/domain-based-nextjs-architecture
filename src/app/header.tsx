'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@components/theme/ThemeToggle';
import { UserMenu } from '@components/auth/UserMenu';

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-(--color-border) bg-(--color-bg)/95 backdrop-blur supports-[backdrop-filter]:bg-(--color-bg)/80">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between">
          {/* Logo / Title */}
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold text-(--color-fg) hover:text-(--color-primary) transition-colors"
          >
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            <span>My App</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className={`text-sm font-medium transition-colors ${
                pathname.includes('/dashboard')
                  ? 'text-(--color-fg)'
                  : 'text-(--color-fg-muted) hover:text-(--color-fg)'
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/components"
              className={`text-sm font-medium transition-colors ${
                pathname.includes('/components')
                  ? 'text-(--color-fg)'
                  : 'text-(--color-fg-muted) hover:text-(--color-fg)'
              }`}
            >
              Components
            </Link>
            <Link
              href="/charts"
              className={`text-sm font-medium transition-colors ${
                pathname.includes('/charts')
                  ? 'text-(--color-fg)'
                  : 'text-(--color-fg-muted) hover:text-(--color-fg)'
              }`}
            >
              Charts
            </Link>
            <Link
              href="/patients"
              className={`text-sm font-medium transition-colors ${
                pathname.includes('/patients')
                  ? 'text-(--color-fg)'
                  : 'text-(--color-fg-muted) hover:text-(--color-fg)'
              }`}
            >
              Patients
            </Link>
          </nav>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <div className="w-px h-5 bg-(--color-border) mx-1" />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
