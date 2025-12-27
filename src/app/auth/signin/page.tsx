'use client';

import type React from 'react';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const result = await signIn('email', { email, redirect: false });

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error',
        description: 'An error occurred during sign in.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-primary/10 via-background to-background">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>Enter your email to sign in to your account</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                value={email}
                disabled={isLoading}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit" disabled={!email || isLoading}>
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : 'Continue with Email'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
