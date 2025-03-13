'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card';
import { formatCurrency } from '@/lib/utils';

export function AccountSummary() {
  // In a real app, this would be fetched from the database
  const totalBalance = 90807.82;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(totalBalance)}</div>
        <p className="text-xs text-muted-foreground">Across all accounts</p>
      </CardContent>
    </Card>
  );
}
