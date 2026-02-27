'use client';

import { useEffect } from 'react';
import { Button } from '@components/ui/Button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Unhandled error:', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-(--color-error)">500</h1>
      <h2 className="text-xl font-semibold text-(--color-fg)">Something went wrong</h2>
      <p className="max-w-md text-(--color-fg-muted)">
        An unexpected error occurred. Please try again.
      </p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
