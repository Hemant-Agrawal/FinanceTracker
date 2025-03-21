'use client';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link, Mail, Settings } from 'lucide-react';
import { User } from '@/models/User';
import { getRequest } from '@/lib/api';
import { Button } from '../ui/button';
// import { getAuthUrl } from '@/ai/gmail/email';

interface UserIntegration {
  id: string;
  name: string;
  connected: boolean;
  connect: () => Promise<void>;
}

const IntegrationCard = ({ userIntegrations }: { userIntegrations: UserIntegration[] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect external services</CardDescription>
      </CardHeader>
      <CardContent className="px-4 space-y-3">
        {userIntegrations.map(integration => (
          <div key={integration.id} className="flex items-center space-x-3 w-full">
            <div className="flex items-center justify-center p-2 rounded-full bg-muted">
              <Mail className="h-6 w-6" />
            </div>
            <div className="grow">
              <p className="font-medium">{integration.name}</p>
              <p className="text-sm text-muted-foreground">{integration.connected ? 'Connected' : 'Not Connected'}</p>
            </div>
            <Button variant="ghost" size="icon" className="rounded-full" onClick={integration.connect}>
              {integration.connected ? <Settings className="h-6 w-6" /> : <Link className="h-6 w-6" />}
              <span className="sr-only">Connect {integration.name}</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default IntegrationCard;
