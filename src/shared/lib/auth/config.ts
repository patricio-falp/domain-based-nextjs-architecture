import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import Keycloak from 'next-auth/providers/keycloak';

/**
 * Refresh the access token using Keycloak's token endpoint.
 * Uses the standard OAuth2 refresh_token grant.
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    const issuer = process.env.AUTH_KEYCLOAK_ISSUER!;
    const tokenUrl = `${issuer}/protocol/openid-connect/token`;

    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: process.env.AUTH_KEYCLOAK_ID!,
        client_secret: process.env.AUTH_KEYCLOAK_SECRET!,
        refresh_token: token.refreshToken as string,
      }),
    });

    const refreshed = await response.json();

    if (!response.ok) {
      throw new Error(refreshed.error_description || refreshed.error || 'Token refresh failed');
    }

    token.accessToken = refreshed.access_token;
    token.refreshToken = refreshed.refresh_token ?? token.refreshToken;
    token.expiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;
    token.error = undefined;
    return token;
  } catch (error) {
    console.error('Error refreshing access token:', error);
    token.error = 'RefreshTokenError';
    return token;
  }
}

export const authConfig: NextAuthConfig = {
  trustHost: true,
  providers: [
    Keycloak({
      clientId: process.env.AUTH_KEYCLOAK_ID!,
      clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
      issuer: process.env.AUTH_KEYCLOAK_ISSUER!,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth }) {
      // Route protection is handled by middleware.ts matcher
      return !!auth?.user;
    },
    async jwt({ token, account, profile }) {
      // Initial sign-in — store tokens from Keycloak
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = account.expires_at;
        token.id = profile?.sub ?? undefined;
        return token;
      }

      // Token still valid — return as-is
      if (token.expiresAt && Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Token expired — attempt refresh
      if (token.refreshToken) {
        return refreshAccessToken(token);
      }

      return token;
    },
    session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
      }
      if (token.accessToken) {
        session.accessToken = token.accessToken as string;
      }
      if (token.error) {
        session.error = token.error;
      }
      return session;
    },
  },
};
