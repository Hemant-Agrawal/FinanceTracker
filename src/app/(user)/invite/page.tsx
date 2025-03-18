'use client';

import type React from 'react';

import { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { toast } from '@/hooks/use-toast';

export default function InviteUserPage() {
  const [email, setEmail] = useState('');

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the invitation to your backend
    console.log(`Inviting user: ${email}`);
    toast({
      title: 'Invitation Sent',
      description: `An invitation has been sent to ${email}`,
    });
    setEmail('');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Invite a User</CardTitle>
          <CardDescription>Send an invitation to join your Finance Tracker team</CardDescription>
        </CardHeader>
        <form onSubmit={handleInvite}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Email Address
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              Send Invitation
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
