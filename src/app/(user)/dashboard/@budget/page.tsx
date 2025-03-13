import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Budget() {
  await new Promise(resolve => setTimeout(resolve, 10000));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget Tracking</CardTitle>
        <CardDescription>Monitor your spending against budget limits</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
};