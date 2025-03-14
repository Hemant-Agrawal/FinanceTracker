import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Portfolio() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Investment Portfolio</CardTitle>
        <CardDescription>Track your investment performance</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
};
