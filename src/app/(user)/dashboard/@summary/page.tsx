import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Percent, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getRequest } from '@/lib/server-api';

function getPeriodText(period: string) {
  switch (period) {
    case 'today':
      return 'day';
    case 'week':
      return 'week';
    case 'month':
      return 'month';
    case 'quarter':
      return 'quarter';
    case '6months':
      return '6 months';
    case 'year':
      return 'year';
    default:
      return '7 days';
  }
}

const Summary = async ({ searchParams }: { searchParams: Promise<{ period: string }> }) => {
  const { period } = await searchParams;
  const overviewData = await getRequest('/dashboard/summary', { period });

  const cards = [
    {
      title: 'Total Balance',
      icon: Wallet,
      value: overviewData.totalBalance,
      change: overviewData.balanceChange,
    },
    {
      title: 'Total Income',
      icon: ArrowUp,
      value: overviewData.totalIncome,
      change: overviewData.incomeChange,
    },
    {
      title: 'Total Expenses',
      icon: ArrowDown,
      value: overviewData.totalExpenses,
      change: overviewData.expensesChange,
      reverse: true,
    },
    {
      title: 'Net Savings',
      icon: Percent,
      value: overviewData.netSavings,
      change: overviewData.savingsChange,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map(card => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(card.value)}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
              <span
                className={`inline-flex items-center ${card.change >= 0 && !card.reverse ? 'text-green-500' : 'text-red-500'}`}
              >
                {card.change >= 0 ? <ArrowUp className="mr-1 h-3 w-3" /> : <ArrowDown className="mr-1 h-3 w-3" />}
                {Math.abs(card.change).toFixed(2)}%
              </span>
              from last {getPeriodText(period)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Summary;
