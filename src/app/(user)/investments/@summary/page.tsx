import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDownIcon, ArrowUpIcon, BarChart3, TrendingUp, Wallet, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const Summary = async () => {
  await new Promise((resolve) => setTimeout(resolve, 10000));

  const portfolioData = {
    totalValue: 1250000,
    totalInvested: 1000000,
    profitLoss: 250000,
    profitLossPercentage: 25,
    cashReserves: 150000,
    portfolioGrowth: 3.2,
    lastUpdated: new Date('2023-12-01T09:30:00'),
  };
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{portfolioData.totalValue.toLocaleString()}</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <span>Invested: ₹{portfolioData.totalInvested.toLocaleString()}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Returns</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{portfolioData.profitLoss.toLocaleString()}</div>
          <div className="flex items-center pt-1">
            <span
              className={cn('text-xs', portfolioData.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500')}
            >
              {portfolioData.profitLossPercentage >= 0 ? (
                <ArrowUpIcon className="mr-1 h-3 w-3 inline" />
              ) : (
                <ArrowDownIcon className="mr-1 h-3 w-3 inline" />
              )}
              {Math.abs(portfolioData.profitLossPercentage)}%
            </span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Cash Reserves</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{portfolioData.cashReserves.toLocaleString()}</div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <span>Available for investment</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Portfolio Growth</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={cn('text-2xl font-bold', portfolioData.portfolioGrowth >= 0 ? 'text-green-500' : 'text-red-500')}
          >
            {portfolioData.portfolioGrowth >= 0 ? '+' : ''}
            {portfolioData.portfolioGrowth}%
          </div>
          <div className="flex items-center pt-1 text-xs text-muted-foreground">
            <span>Compared to last month</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Summary;
