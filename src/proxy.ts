export { auth as proxy } from '@/shared/lib/auth';

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico, favicon.svg (browser favicon)
     * - public assets (images, etc.)
     * - api/auth (NextAuth routes must remain public)
     */
    '/((?!_next/static|_next/image|favicon\\.ico|favicon\\.svg|api/auth).*)',
  ],
};
