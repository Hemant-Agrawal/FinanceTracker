'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/ui/badge';
import { Transaction } from '@/models/Transaction';
import { formatDateWithTime } from '@/lib/date';


interface Props {
  transactions: Transaction[];
}

export function RecentTransactions({ transactions }: Props) {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Your most recent financial activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {transactions.map(transaction => (
            <div key={`${transaction._id}`} className="flex items-center">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{transaction.description}</p>
                <p className="text-sm text-muted-foreground">{formatDateWithTime(transaction.date)}</p>
              </div>
              <div className="ml-auto flex flex-col items-end gap-2">
                <p className={`text-sm font-medium ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(transaction.amount)}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{transaction.category}</Badge>
                  <Badge variant="secondary">{transaction.paymentMethod.name}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
