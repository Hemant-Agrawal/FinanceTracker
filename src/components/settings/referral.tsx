'use client';
import { Copy, Share2 } from 'lucide-react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { toast } from '@/hooks/use-toast';

export default function Referral({ referralCode }: { referralCode: string }) {
  const copyReferralCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: 'Referral Code Copied',
      description: 'The referral code has been copied to your clipboard.',
    });
  };

  const shareReferralCode = () => {
    if (navigator.share) {
      navigator
        .share({
          title: 'Join Finance Tracker',
          text: `Use my referral code ${referralCode} to sign up for Finance Tracker!`,
          url: `${process.env.NEXT_PUBLIC_APP_URL}/signup?referralCode=${referralCode}`,
        })
        .then(() => {
          console.log('Thanks for sharing!');
        })
        .catch(console.error);
    } else {
      // Fallback for browsers that don't support the Web Share API
      copyReferralCode();
    }
  };
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Refer a Friend</CardTitle>
        <CardDescription>Share Finance Tracker and earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            htmlFor="referral-code"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Your Referral Code
          </label>
          <div className="flex mt-2">
            <Input id="referral-code" value={referralCode} readOnly className="flex-grow" />
            <Button onClick={copyReferralCode} className="ml-2">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button onClick={shareReferralCode} className="w-full">
          <Share2 className="mr-2 h-4 w-4" />
          Share Referral Code
        </Button>
        <p className="text-sm text-muted-foreground">
          Share this code with your friends. When they sign up using your code, both of you will receive a reward!
        </p>
      </CardContent>
    </Card>
  );
}
