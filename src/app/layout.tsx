import type React from 'react';
import '@/styles/globals.css';
import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { SiteHeader } from '@/components/site-header';
import { SiteFooter } from '@/components/site-footer';
import { Toaster } from '@/ui/toaster';
import { FloatingActionButton } from '@/components/common/floating-button';
import Providers from './providers';
import { auth } from '@/auth';
import { FirstVisitModal } from '@/components/first-visit-modal';

// const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Finance Tracker',
    template: '%s | Finance Tracker',
  },
  description: 'A comprehensive Finance Tracker application',
  icons: {
    icon: '/favicon.ico',
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers session={session}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <div className="relative flex min-h-screen flex-col">
              <SiteHeader />
              <main className="flex-1 w-full max-w-full overflow-x-hidden">
                {session && !session.user?.name ? <FirstVisitModal /> : children}
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
