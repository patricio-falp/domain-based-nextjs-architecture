'use client';

import { useAuth } from '@/shared/hooks/useAuth';
import { Card } from '@components/ui/Card';
import { Spinner } from '@components/ui/Spinner';
import Image from 'next/image';
import { Mail, Shield, Key, Clock } from 'lucide-react';

export default function ProfilePage() {
  const { user, session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[300px]">
          <Spinner size="lg" label="Loading profile..." />
        </div>
      </div>
    );
  }

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : user?.email?.[0]?.toUpperCase() || 'U';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-(--color-fg)">Profile</h1>
        <p className="mt-2 text-(--color-fg-muted)">Your account information from Keycloak.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User card */}
        <Card variant="elevated">
          <Card.Content>
            <div className="flex flex-col items-center py-4">
              {user?.image ? (
                <Image
                  src={user.image}
                  alt={user.name || 'User'}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-(--color-primary) text-(--color-primary-fg) flex items-center justify-center text-2xl font-semibold">
                  {initials}
                </div>
              )}
              <h2 className="mt-4 text-lg font-semibold text-(--color-fg)">
                {user?.name || 'Unknown user'}
              </h2>
              <p className="text-sm text-(--color-fg-muted)">{user?.email}</p>
            </div>
          </Card.Content>
        </Card>

        {/* Account details */}
        <Card variant="elevated" className="md:col-span-2">
          <Card.Header
            title="Account Details"
            description="Information provided by your identity provider."
          />
          <Card.Content>
            <dl className="space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-(--color-fg-muted) mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs font-medium text-(--color-fg-muted) uppercase tracking-wide">
                    User ID
                  </dt>
                  <dd className="mt-1 text-sm text-(--color-fg) font-mono break-all">
                    {user?.id || '—'}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-(--color-fg-muted) mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs font-medium text-(--color-fg-muted) uppercase tracking-wide">
                    Email
                  </dt>
                  <dd className="mt-1 text-sm text-(--color-fg)">{user?.email || '—'}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Key className="w-5 h-5 text-(--color-fg-muted) mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs font-medium text-(--color-fg-muted) uppercase tracking-wide">
                    Access Token
                  </dt>
                  <dd className="mt-1 text-sm text-(--color-fg) font-mono break-all bg-(--color-bg-subtle) rounded-md p-2">
                    {session?.accessToken
                      ? `${session.accessToken.slice(0, 20)}...${session.accessToken.slice(-10)}`
                      : '—'}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-(--color-fg-muted) mt-0.5 shrink-0" />
                <div>
                  <dt className="text-xs font-medium text-(--color-fg-muted) uppercase tracking-wide">
                    Session Expires
                  </dt>
                  <dd className="mt-1 text-sm text-(--color-fg)">
                    {session?.expires ? new Date(session.expires).toLocaleString() : '—'}
                  </dd>
                </div>
              </div>
            </dl>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
