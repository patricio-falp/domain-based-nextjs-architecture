'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { useAuth } from '@/shared/hooks/useAuth';
import { Spinner } from '@components/ui/Spinner';
import { Avatar } from '@components/ui/Avatar';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

function LogoutOverlay() {
  return createPortal(
    <div className="fixed inset-0 z-9999 flex items-center justify-center bg-(--color-overlay)">
      <div className="flex flex-col items-center gap-4 rounded-xl border border-(--color-border) bg-(--color-bg) p-8 shadow-lg">
        <Spinner size="lg" />
        <p className="text-sm font-medium text-(--color-fg)">Signing out...</p>
      </div>
    </div>,
    document.body
  );
}

export function UserMenu() {
  const { user, isLoading, isAuthenticated, logout, login } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  if (isLoading) {
    return <div className="w-8 h-8 rounded-full bg-(--color-bg-muted) animate-pulse" />;
  }

  if (!isAuthenticated) {
    return (
      <button
        onClick={() => login()}
        className="px-3 py-1.5 text-sm font-medium rounded-lg bg-(--color-primary) text-(--color-primary-fg) hover:bg-(--color-primary)/90 transition-colors"
      >
        Sign In
      </button>
    );
  }

  const handleLogout = async () => {
    setIsOpen(false);
    setIsLoggingOut(true);
    // Give the portal time to render before starting the async logout
    await new Promise((r) => setTimeout(r, 50));
    await logout();
  };

  return (
    <>
      {isLoggingOut && <LogoutOverlay />}
      <div className="relative" ref={menuRef}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 p-1 rounded-lg hover:bg-(--color-bg-muted) transition-colors"
        >
          <Avatar src={user?.image} name={user?.name || user?.email} size="sm" />
          <ChevronDown
            className={`w-4 h-4 text-(--color-fg-muted) transition-transform ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-56 rounded-lg border border-(--color-border) bg-(--color-bg) shadow-lg py-1 z-50">
            <div className="px-4 py-3 border-b border-(--color-border)">
              <p className="text-sm font-medium text-(--color-fg)">{user?.name || 'User'}</p>
              <p className="text-xs text-(--color-fg-muted) truncate">{user?.email}</p>
            </div>

            <div className="py-1">
              <Link
                href="/settings"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-fg) hover:bg-(--color-bg-muted) transition-colors"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              <Link
                href="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2 text-sm text-(--color-fg) hover:bg-(--color-bg-muted) transition-colors"
              >
                <User className="w-4 h-4" />
                Profile
              </Link>
            </div>

            <div className="border-t border-(--color-border) pt-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-(--color-error) hover:bg-(--color-bg-muted) transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
