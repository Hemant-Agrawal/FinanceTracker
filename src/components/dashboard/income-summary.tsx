'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { formatCurrency } from '@/lib/utils';

export function IncomeSummary() {
  // In a real app, this would be fetched from the database
  const monthlyIncome = 45000;
  const previousMonthIncome = 42000;
  const percentageChange = ((monthlyIncome - previousMonthIncome) / previousMonthIncome) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(monthlyIncome)}</div>
        <p className={`text-xs ${percentageChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {percentageChange > 0 ? '+' : ''}
          {percentageChange.toFixed(1)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}
