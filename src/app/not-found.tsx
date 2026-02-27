import Link from 'next/link';
import { Button } from '@components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-6xl font-bold text-(--color-fg-muted)">404</h1>
      <h2 className="text-xl font-semibold text-(--color-fg)">Page not found</h2>
      <p className="max-w-md text-(--color-fg-muted)">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link href="/">
        <Button variant="primary">Go home</Button>
      </Link>
    </div>
  );
}
