'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Link, Mail, Settings, Bell, ChartPie } from 'lucide-react';
import { User } from '@/models/User';
import { getRequest } from '@/lib/api';
import { Button } from '../ui/button';
import { RemoveIntegrationModal } from './remove-integration-modal';
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser() {
  const registration = await navigator.serviceWorker.ready;

  const subscription = await registration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
  });

  // Send subscription to your server
  await fetch('/api/subscribe', {
    method: 'POST',
    body: JSON.stringify(subscription),
    headers: {
      'Content-Type': 'application/json',
    },
  });
}

const Integration = ({ user }: { user: User }) => {
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);

  async function subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!),
    });
    setSubscription(sub);
    await subscribeUser();
  }

  async function unsubscribeFromPush() {
    await subscription?.unsubscribe();
    setSubscription(null);
    //   await unsubscribeUser()
  }

  const userIntegrations = [
    {
      id: 'notification',
      name: 'Push Notification',
      icon: <Bell className="h-6 w-6" />,
      connected: !!subscription,
      connect: () => {
        if (subscription) {
          unsubscribeFromPush();
        } else {
          subscribeToPush();
        }
      },
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="h-6 w-6" />,
      connected: !!user.gmail?.refreshToken,
      connect: async () => {
        if (!user.gmail?.refreshToken) {
          window.open(`${BASE_URL}/api/installation?type=gmail`, '_blank');
        } else {
          await getRequest('/transactions/sync');
        }
      },
    },
    {
      id: 'upstok',
      name: 'Upstok',
      icon: <ChartPie className="h-6 w-6" />,
      connected: !!user.upstok,
      connect: async () => {
        if (!user.upstok) {
          window.open(`${BASE_URL}/api/installation?type=upstok`, '_blank');
        } else {
        }
      },
    },
  ];

  useEffect(() => {
    async function registerServiceWorker() {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/',
        updateViaCache: 'none',
      });
      const sub = await registration.pushManager.getSubscription();
      setSubscription(sub);
    }
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      registerServiceWorker();
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>Connect external services</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {userIntegrations.map(integration => (
          <div key={integration.id} className="flex items-center space-x-3 w-full">
            <div className="flex items-center justify-center p-2 rounded-full bg-muted">{integration.icon}</div>
            <div className="grow">
              <p className="font-medium">{integration.name}</p>
              <p className="text-sm text-muted-foreground">{integration.connected ? 'Connected' : 'Not Connected'}</p>
            </div>
            {integration.connected ? (
              <RemoveIntegrationModal title={integration.name} onRemove={integration.connect}>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Settings className="h-6 w-6" />
                  <span className="sr-only">Connect {integration.name}</span>
                </Button>
              </RemoveIntegrationModal>
            ) : (
              <Button variant="ghost" size="icon" className="rounded-full" onClick={integration.connect}>
                <Link className="h-6 w-6" />
                <span className="sr-only">Connect {integration.name}</span>
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Integration;
