import { SignInForm } from '@components/auth/SignInForm';

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const { callbackUrl } = await searchParams;

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-(--color-fg)">Sign In</h1>
          <p className="mt-2 text-(--color-fg-muted)">Sign in to access your dashboard</p>
        </div>

        <div className="bg-(--color-bg) border border-(--color-border) rounded-xl p-6 shadow-sm">
          <SignInForm callbackUrl={callbackUrl} />
        </div>
      </div>
    </div>
  );
}
