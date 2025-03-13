'use client';

import type React from 'react';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { toast } from '@/hooks/use-toast';

export default function SignIn() {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await signIn('nodemailer', { email, redirectTo: '/dashboard' });

      if (result?.error) {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred during sign in.',
        variant: 'destructive',
      });
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
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button className="w-full" type="submit">
              Continue with Email
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
