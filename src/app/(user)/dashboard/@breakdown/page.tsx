import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from '@/components/common/chart';

export default async function Breakdown() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Category-wise expense distribution</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Chart type="pie" data={[]} xAxisKey="name" dataKeys={['value']} />
      </CardContent>
    </Card>
  );
}
