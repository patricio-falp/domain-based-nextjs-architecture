'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/shared/hooks/useAuth';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { LogIn, LogOut } from 'lucide-react';

interface SignInFormProps {
  callbackUrl?: string;
}

export function SignInForm({ callbackUrl }: SignInFormProps) {
  const { login, isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const [signedOut] = useState(() => {
    if (typeof window === 'undefined') return false;
    const wasSignedOut = sessionStorage.getItem('signedOut') === 'true';
    if (wasSignedOut) sessionStorage.removeItem('signedOut');
    return wasSignedOut;
  });

  useEffect(() => {
    if (isAuthenticated) {
      const timeout = setTimeout(() => {
        router.replace(callbackUrl || '/dashboard');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [isAuthenticated, router, callbackUrl]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <Spinner size="lg" label="Checking session..." />
        <p className="text-sm text-(--color-fg-muted)">Checking session...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    const displayName = user?.name || user?.email || 'User';

    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="w-12 h-12 rounded-full bg-(--color-primary) text-(--color-primary-fg) flex items-center justify-center text-lg font-semibold">
          {user?.name
            ? user.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)
            : user?.email?.[0]?.toUpperCase() || 'U'}
        </div>
        <div className="text-center">
          <p className="text-base font-medium text-(--color-fg)">Welcome, {displayName}</p>
          <p className="text-sm text-(--color-fg-muted) mt-1">Redirecting to your dashboard...</p>
        </div>
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {signedOut && (
        <div className="flex items-center gap-3 rounded-lg border border-(--color-border) bg-(--color-bg-subtle) p-3">
          <LogOut className="w-4 h-4 text-(--color-fg-muted) shrink-0" />
          <p className="text-sm text-(--color-fg-muted)">
            Your session has ended. Sign in again to continue.
          </p>
        </div>
      )}

      <p className="text-center text-sm text-(--color-fg-muted)">
        Use your organization account to sign in.
      </p>

      <Button
        variant="primary"
        className="w-full justify-center"
        leftIcon={<LogIn className="w-4 h-4" />}
        onClick={() => login()}
      >
        Sign in with Keycloak
      </Button>
    </div>
  );
}
