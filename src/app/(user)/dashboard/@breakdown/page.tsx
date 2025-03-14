import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function Breakdown() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Category-wise expense distribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4"></CardContent>
    </Card>
  );
}
