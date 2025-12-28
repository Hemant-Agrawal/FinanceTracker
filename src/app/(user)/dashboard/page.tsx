import type { Metadata } from 'next';
import { getRecentTransactions } from '@/lib/actions';
import { TransactionsTable } from '@/components/transactions/transactions-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { List } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Dashboard | Finance Tracker',
  description: 'Monitor your financial activities and track your expenses',
};

export default async function DashboardPage() {
  const transactions = await getRecentTransactions();
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Recent Transactions</CardTitle>
          <Link href="/transactions">
            <Button>
              <List className="h-4 w-4" />
              View All
            </Button>
          </Link>
        </div>
        <CardDescription>Track your recent transactions</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <TransactionsTable transactions={transactions} showTime />
      </CardContent>
    </Card>
  );
}
