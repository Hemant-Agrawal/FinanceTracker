'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ui/button';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

export default function VerifyPage() {
  const router = useRouter();
  const [verificationStatus] = useState<'pending' | 'success' | 'error'>('pending');

  const openGmail = () => {
    const gmailUrl = 'https://mail.google.com/';
    const gmailWindow = window.open(gmailUrl, 'GmailWindow', 'width=800,height=600');

    if (gmailWindow) {
      const checkVerification = setInterval(() => {
        if (verificationStatus === 'success') {
          clearInterval(checkVerification);
          gmailWindow.close();
          router.push('/dashboard');
        }
      }, 1000);
    }
  };

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col items-center justify-center space-y-6 sm:w-[350px]">
        {verificationStatus === 'pending' && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Verifying your magic link...</h1>
            <p className="text-center text-sm text-muted-foreground">
              This won&apos;t take long. We&apos;re making sure it&apos;s really you!
            </p>
          </>
        )}
        {verificationStatus === 'success' && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Verification successful!</h1>
            <p className="text-center text-sm text-muted-foreground">
              Great news! You&apos;re verified. We&apos;re redirecting you to the dashboard...
            </p>
          </>
        )}
        {verificationStatus === 'error' && (
          <>
            <XCircle className="h-16 w-16 text-red-500" />
            <h1 className="text-2xl font-semibold tracking-tight">Oops! Verification failed</h1>
            <p className="text-center text-sm text-muted-foreground">
              Something went wrong. Please try again or contact support.
            </p>
          </>
        )}
        <Button onClick={openGmail} className="mt-4">
          Open Gmail
        </Button>
      </div>
    </div>
  );
}
