'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { formatCurrency } from '@/lib/utils';

export function ExpenseSummary() {
  // In a real app, this would be fetched from the database
  const monthlyExpenses = 12450.75;
  const previousMonthExpenses = 10200.5;
  const percentageChange = ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(monthlyExpenses)}</div>
        <p className={`text-xs ${percentageChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
          {percentageChange > 0 ? '+' : ''}
          {percentageChange.toFixed(1)}% from last month
        </p>
      </CardContent>
    </Card>
  );
}
