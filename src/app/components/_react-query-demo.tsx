'use client';

import { useState } from 'react';
import { useDemoUsers, useDemoPosts } from '@/shared/hooks/useDemoData';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { Spinner } from '@components/ui/Spinner';
import { Skeleton, SkeletonText } from '@components/ui/Skeleton';
import { RefreshCw, ChevronRight, ArrowLeft } from 'lucide-react';

export function ReactQueryDemo() {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const {
    data: users,
    isLoading: usersLoading,
    isFetching: usersFetching,
    error: usersError,
    refetch: refetchUsers,
  } = useDemoUsers();

  const {
    data: posts,
    isLoading: postsLoading,
    isFetching: postsFetching,
  } = useDemoPosts(selectedUserId);

  const selectedUser = users?.find((u) => u.id === selectedUserId);

  return (
    <div className="space-y-4">
      {/* Status bar */}
      <div className="flex items-center gap-3 flex-wrap">
        <Badge variant={usersLoading ? 'warning' : usersError ? 'error' : 'success'} dot>
          {usersLoading ? 'Loading' : usersError ? 'Error' : 'Connected'}
        </Badge>
        <span className="text-xs text-(--color-fg-subtle)">jsonplaceholder.typicode.com</span>
        {(usersFetching || postsFetching) && <Spinner size="sm" />}
        <Button
          size="sm"
          variant="ghost"
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
          onClick={() => refetchUsers()}
          loading={usersFetching}
        >
          Refetch
        </Button>
      </div>

      {/* Error state */}
      {usersError && (
        <Card variant="outlined" padding>
          <div className="flex items-center gap-3">
            <Badge variant="error">Error</Badge>
            <p className="text-sm text-(--color-error)">
              {usersError instanceof Error ? usersError.message : 'Failed to fetch'}
            </p>
            <Button size="sm" variant="secondary" onClick={() => refetchUsers()}>
              Retry
            </Button>
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Users list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-(--color-fg)">
              Users {users && <span className="text-(--color-fg-subtle)">({users.length})</span>}
            </h4>
          </div>

          {usersLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} variant="outlined" padding>
                  <div className="flex items-center gap-3">
                    <Skeleton width="2.5rem" height="2.5rem" className="rounded-full" />
                    <div className="flex-1">
                      <SkeletonText lines={2} />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {users?.map((user) => (
                <Card
                  key={user.id}
                  variant={selectedUserId === user.id ? 'filled' : 'outlined'}
                  hoverable
                  padding
                  className="cursor-pointer"
                  onClick={() => setSelectedUserId(user.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-(--color-fg) truncate">{user.name}</p>
                      <p className="text-xs text-(--color-fg-muted) truncate">{user.email}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-(--color-fg-subtle) shrink-0" />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Posts for selected user */}
        <div className="space-y-2">
          {selectedUser ? (
            <>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<ArrowLeft className="w-3.5 h-3.5" />}
                  onClick={() => setSelectedUserId(null)}
                >
                  Back
                </Button>
                <h4 className="text-sm font-medium text-(--color-fg) truncate">
                  Posts by {selectedUser.name}
                </h4>
                {postsFetching && <Spinner size="sm" />}
              </div>

              {/* User detail card */}
              <Card variant="filled" padding>
                <div className="space-y-1">
                  <p className="text-xs text-(--color-fg-muted)">
                    @{selectedUser.username} &middot; {selectedUser.company.name}
                  </p>
                  <p className="text-xs text-(--color-fg-subtle)">
                    {selectedUser.phone} &middot; {selectedUser.website}
                  </p>
                </div>
              </Card>

              {postsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i} variant="outlined" padding>
                      <SkeletonText lines={3} />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {posts?.map((post) => (
                    <Card key={post.id} variant="outlined" padding>
                      <p className="text-sm font-medium text-(--color-fg) line-clamp-1">
                        {post.title}
                      </p>
                      <p className="text-xs text-(--color-fg-muted) mt-1 line-clamp-2">
                        {post.body}
                      </p>
                    </Card>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center justify-center h-full min-h-48">
              <p className="text-sm text-(--color-fg-subtle)">Select a user to view their posts</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
