import type React from 'react';
import '@/styles/globals.css';
import type { Metadata, Viewport } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/ui/toaster';
import { FloatingActionButton } from '@/components/common/floating-button';
import Providers from './providers';
import { auth } from '@/auth';
import { InstallButton } from '@/components/pwa';
// import { FirstVisitModal } from '@/components/first-visit-modal';


export const metadata: Metadata = {
  title: {
    default: 'Finance Tracker',
    template: '%s | Finance Tracker',
  },
  description: 'A comprehensive Finance Tracker application',
  icons: {
    icon: '/favicon.ico',
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#2563eb',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  return (
    <html lang="en" suppressHydrationWarning>
      <meta name="apple-mobile-web-app-title" content="Finance Tracker" />
      <body>
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 w-full max-w-full overflow-x-hidden">
                {children}
                <InstallButton />
                {/* {session && !session.user?.name ? <FirstVisitModal /> : children} */}
                <FloatingActionButton />
              </main>
              <SiteFooter />
            </div>
            <Toaster />
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
