import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from '@/components/common/chart';

export default async function Breakdown() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const spendingBreakdownData = [
    { name: 'Rent & Utilities', value: 1200, color: '#8884d8' },
    { name: 'Food & Dining', value: 850, color: '#82ca9d' },
    { name: 'Transport', value: 450, color: '#ffc658' },
    { name: 'Entertainment', value: 350, color: '#ff8042' },
    { name: 'Loans & EMIs', value: 300, color: '#0088fe' },
    { name: 'Medical & Health', value: 200, color: '#00C49F' },
    { name: 'Others', value: 100, color: '#FFBB28' },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Breakdown</CardTitle>
        <CardDescription>Category-wise expense distribution</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Chart type="pie" data={spendingBreakdownData} xAxisKey="name" dataKeys={['value']} />
      </CardContent>
    </Card>
  );
}
