/**
 * Authentication Hook
 *
 * Wrapper around next-auth/react for consistent auth state access.
 * Uses Keycloak OAuth/OIDC provider.
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useCallback, useEffect } from 'react';

export interface UseAuthReturn {
  /** Current user session */
  session: ReturnType<typeof useSession>['data'];
  /** Loading state */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Current user */
  user: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
  } | null;
  /** Sign in via Keycloak */
  login: () => Promise<void>;
  /** Sign out */
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  // If the refresh token failed, force re-login
  useEffect(() => {
    if (session?.error === 'RefreshTokenError') {
      signIn('keycloak');
    }
  }, [session?.error]);

  const user = session?.user
    ? {
        id: session.user.id,
        email: session.user.email ?? '',
        name: session.user.name ?? null,
        image: session.user.image ?? null,
      }
    : null;

  const login = useCallback(async (): Promise<void> => {
    try {
      // After Keycloak auth, redirect back to signin page (which shows welcome)
      // then the SignInForm redirects to the final destination
      const params = new URLSearchParams(window.location.search);
      const destination = params.get('callbackUrl') || '/dashboard';
      const callbackUrl = `/auth/signin?callbackUrl=${encodeURIComponent(destination)}`;
      await signIn('keycloak', { callbackUrl });
    } catch (error) {
      console.error('Login failed:', error);
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    try {
      await signOut({ redirect: false });

      // Flag for the sign-in page to show "session ended" message
      sessionStorage.setItem('signedOut', 'true');

      const issuer = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ISSUER;
      const clientId = process.env.NEXT_PUBLIC_AUTH_KEYCLOAK_ID;
      const signInPath = `${window.location.origin}/auth/signin`;

      if (issuer) {
        // End Keycloak session and redirect back to sign-in page
        const logoutUrl = new URL(`${issuer}/protocol/openid-connect/logout`);
        logoutUrl.searchParams.set('post_logout_redirect_uri', signInPath);
        if (clientId) {
          logoutUrl.searchParams.set('client_id', clientId);
        }
        window.location.href = logoutUrl.toString();
      } else {
        window.location.href = '/auth/signin';
      }
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, []);

  return {
    session,
    isLoading,
    isAuthenticated,
    user,
    login,
    logout,
  };
}
