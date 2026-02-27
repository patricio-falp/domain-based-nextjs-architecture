import '@/shared/styles/global.css';
import type { Metadata } from 'next';
import { Providers } from './providers';
import { Header } from './header';

export const metadata: Metadata = {
  title: 'Next.js Starter Template',
  description: 'A modern Next.js starter with auth, themes, and UI components',
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Next.js Starter Template',
    description: 'A modern Next.js starter with auth, themes, and UI components',
    type: 'website',
    siteName: 'Next.js Starter Template',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Starter Template',
    description: 'A modern Next.js starter with auth, themes, and UI components',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const THEME_KEY = 'app-theme';
                function getStoredTheme() {
                  try {
                    const stored = localStorage.getItem(THEME_KEY);
                    if (stored === 'light' || stored === 'dark' || stored === 'system') {
                      return stored;
                    }
                  } catch {}
                  return 'system';
                }
                function applyTheme(theme) {
                  const root = document.documentElement;
                  if (theme === 'system') {
                    root.removeAttribute('data-theme');
                  } else {
                    root.setAttribute('data-theme', theme);
                  }
                }
                applyTheme(getStoredTheme());
              })();
            `,
          }}
        />
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#f4f6fa" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a1120" />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-screen bg-(--color-bg) text-(--color-fg) antialiased"
      >
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
