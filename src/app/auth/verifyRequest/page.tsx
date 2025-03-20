'use client';

import { Button } from '@/ui/button';
import { Loader2, CheckCircle2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function VerifyPage() {
  const { push } = useRouter();
  const { status } = useSession();

  const openGmail = () => {
    const gmailUrl = 'https://mail.google.com/';
    const gmailWindow = window.open(gmailUrl, 'GmailWindow', 'width=800,height=600');

    if (gmailWindow) {
      const checkVerification = setInterval(() => {
        if (status === 'authenticated') {
          clearInterval(checkVerification);
          gmailWindow.close();
          push('/dashboard');
        }
      }, 1000);
    }
  };

  useEffect(() => {
    if (status === 'authenticated') {
      push('/dashboard');
    }
  }, [status, push]);

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
        {status === 'authenticated' ? (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Verification successful!</h1>
            <p className="text-center text-sm text-muted-foreground">
              Great news! You&apos;re verified. We&apos;re redirecting you to the dashboard...
            </p>
          </>
        ) : (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Verifying your magic link...</h1>
            <p className="text-center text-sm text-muted-foreground">
              This won&apos;t take long. We&apos;re making sure it&apos;s really you!
            </p>
          </>
        )}
        {status !== 'authenticated' && (
          <Button onClick={openGmail} className="mt-4">
            Open Gmail
          </Button>
        )}
      </div>
    </div>
  );
}
