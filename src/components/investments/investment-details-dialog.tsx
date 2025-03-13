'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Badge } from '@/ui/badge';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/ui/chart';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
} from 'recharts';
import { cn } from '@/lib/utils';
import { Investment } from '@/models/Investment';
import { formatDateWithTime } from '@/lib/date';
import { WithId } from 'mongodb';
// Sample historical data - would be fetched from API in production
const generateHistoricalData = (investment: Investment) => {
  const data = [];
  const startDate = new Date();
  startDate.setFullYear(startDate.getFullYear() - 1);

  let currentPrice = investment.buyPrice;
  const endPrice = investment.currentPrice;

  for (let i = 0; i < 12; i++) {
    const date = new Date(startDate);
    date.setMonth(date.getMonth() + i);

    // Generate a price that gradually moves from buy price to current price
    // with some random fluctuation
    const progress = i / 11;
    const targetPrice = investment.buyPrice + (endPrice - investment.buyPrice) * progress;
    const randomFactor = 0.95 + Math.random() * 0.1; // Random between 0.95 and 1.05
    currentPrice = targetPrice * randomFactor;

    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      price: currentPrice,
      value: currentPrice * investment.units,
    });
  }

  return data;
};

// Sample transaction data - would be fetched from API in production
const generateTransactionData = (investment: Investment) => {
  const buyDate = new Date();
  buyDate.setFullYear(buyDate.getFullYear() - 1);

  const transactions = [
    {
      id: 't1',
      type: 'Buy',
      date: buyDate,
      units: investment.units,
      price: investment.buyPrice,
      value: investment.units * investment.buyPrice,
      notes: 'Initial investment',
    },
  ];

  // Add some additional transactions for certain investments
  if (investment.type === 'Mutual Fund') {
    const additionalBuyDate = new Date(buyDate);
    additionalBuyDate.setMonth(additionalBuyDate.getMonth() + 3);

    transactions.push({
      id: 't2',
      type: 'Buy',
      date: additionalBuyDate,
      units: investment.units * 0.2,
      price: investment.buyPrice * 1.05,
      value: investment.units * 0.2 * investment.buyPrice * 1.05,
      notes: 'Additional investment',
    });
  }

  if (investment.type === 'Stock' && investment.profitLossPercentage > 10) {
    const sellDate = new Date(buyDate);
    sellDate.setMonth(sellDate.getMonth() + 6);

    transactions.push({
      id: 't3',
      type: 'Sell',
      date: sellDate,
      units: investment.units * 0.3,
      price: investment.buyPrice * 1.15,
      value: investment.units * 0.3 * investment.buyPrice * 1.15,
      notes: 'Partial profit booking',
    });
  }

  return transactions;
};

// Sample dividend data - would be fetched from API in production
const generateDividendData = (investment: Investment) => {
  if (['Stock', 'ETF'].includes(investment.type)) {
    const dividends = [];
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);

    // Generate quarterly dividends
    for (let i = 0; i < 4; i++) {
      const date = new Date(startDate);
      date.setMonth(date.getMonth() + i * 3);

      // Random dividend between 0.5% and 1.5% of investment value
      const dividendPercentage = 0.005 + Math.random() * 0.01;
      const amount = investment.buyPrice * investment.units * dividendPercentage;

      dividends.push({
        id: `d${i + 1}`,
        date,
        amount,
        yieldPercentage: dividendPercentage * 100,
      });
    }

    return dividends;
  }

  return [];
};

interface InvestmentDetailsDialogProps {
  investment: WithId<Investment>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InvestmentDetailsDialog({ investment, open, onOpenChange }: InvestmentDetailsDialogProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const historicalData = generateHistoricalData(investment);
  const transactions = generateTransactionData(investment);
  const dividends = generateDividendData(investment);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            {investment.name}
            <Badge variant="outline" className="ml-2">
              {investment.type}
            </Badge>
          </DialogTitle>
          <DialogDescription>Investment details and performance history</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="dividends">Dividends</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Current Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(investment.currentValue)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {investment.units} units at{' '}
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(investment.currentPrice)}{' '}
                    per unit
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Total Investment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(investment.buyPrice * investment.units)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {investment.units} units at{' '}
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                    }).format(investment.buyPrice)}{' '}
                    per unit
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">Profit/Loss</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className={cn(
                      'text-2xl font-bold',
                      investment.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500'
                    )}
                  >
                    {investment.profitLossPercentage >= 0 ? (
                      <ArrowUpIcon className="mr-1 h-4 w-4 inline" />
                    ) : (
                      <ArrowDownIcon className="mr-1 h-4 w-4 inline" />
                    )}
                    {Math.abs(investment.profitLossPercentage).toFixed(2)}%
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Intl.NumberFormat('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      signDisplay: 'always',
                    }).format(investment.profitLoss)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
                <CardDescription>Key details about your {investment.name} investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Status</div>
                      <div>
                        <Badge
                          variant={
                            investment.status === 'Active'
                              ? 'outline'
                              : investment.status === 'Matured'
                                ? 'default'
                                : 'secondary'
                          }
                        >
                          {investment.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Investment Type</div>
                      <div>{investment.type}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Units Held</div>
                      <div>{investment.units}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Purchase Price</div>
                      <div>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(investment.buyPrice)}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Current Price</div>
                      <div>
                        {new Intl.NumberFormat('en-IN', {
                          style: 'currency',
                          currency: 'INR',
                        }).format(investment.currentPrice)}
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Last Updated</div>
                      <div>{formatDateWithTime(investment.updatedAt!)}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Holding Period</div>
                      <div>1 year</div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="text-sm font-medium">Annualized Return</div>
                      <div className={cn(investment.profitLossPercentage >= 0 ? 'text-green-500' : 'text-red-500')}>
                        {investment.profitLossPercentage >= 0 ? '+' : ''}
                        {investment.profitLossPercentage.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Historical Performance</CardTitle>
                <CardDescription>Price and value trends over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="price" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="price">Price History</TabsTrigger>
                    <TabsTrigger value="value">Value History</TabsTrigger>
                  </TabsList>
                  <TabsContent value="price" className="pt-4">
                    <ChartContainer
                      config={{
                        price: {
                          label: 'Price',
                          color: 'hsl(var(--chart-1))',
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={historicalData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <Line type="monotone" dataKey="price" stroke="var(--color-price)" activeDot={{ r: 8 }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </TabsContent>
                  <TabsContent value="value" className="pt-4">
                    <ChartContainer
                      config={{
                        value: {
                          label: 'Value',
                          color: 'hsl(var(--chart-2))',
                        },
                      }}
                      className="h-[300px]"
                    >
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={historicalData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <ChartTooltip content={<ChartTooltipContent />} />
                          <Legend />
                          <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--chart-2))" stopOpacity={0.8} />
                              <stop offset="95%" stopColor="hsl(var(--chart-2))" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="var(--color-value)"
                            fillOpacity={1}
                            fill="url(#colorValue)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Benchmark Comparison</CardTitle>
                <CardDescription>Performance compared to market benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={historicalData.map((item) => ({
                        ...item,
                        benchmark: item.price * (0.9 + Math.random() * 0.2),
                      }))}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="price"
                        name={investment.name}
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                      />
                      <Line type="monotone" dataKey="benchmark" name="Market Benchmark" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>All buy and sell transactions for this investment</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-2 text-left font-medium">Date</th>
                        <th className="p-2 text-left font-medium">Type</th>
                        <th className="p-2 text-left font-medium">Units</th>
                        <th className="p-2 text-left font-medium">Price</th>
                        <th className="p-2 text-left font-medium">Value</th>
                        <th className="p-2 text-left font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {transactions.map(transaction => (
                        <tr key={transaction.id} className="border-b">
                          <td className="p-2">{transaction.date.toLocaleDateString()}</td>
                          <td className="p-2">
                            <Badge variant={transaction.type === 'Buy' ? 'default' : 'secondary'}>
                              {transaction.type}
                            </Badge>
                          </td>
                          <td className="p-2">{transaction.units}</td>
                          <td className="p-2">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(transaction.price)}
                          </td>
                          <td className="p-2">
                            {new Intl.NumberFormat('en-IN', {
                              style: 'currency',
                              currency: 'INR',
                            }).format(transaction.value)}
                          </td>
                          <td className="p-2">{transaction.notes}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dividends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Dividend History</CardTitle>
                <CardDescription>Dividend payments received from this investment</CardDescription>
              </CardHeader>
              <CardContent>
                {dividends.length > 0 ? (
                  <div className="rounded-md border">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b bg-muted/50">
                          <th className="p-2 text-left font-medium">Date</th>
                          <th className="p-2 text-left font-medium">Amount</th>
                          <th className="p-2 text-left font-medium">Yield</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dividends.map(dividend => (
                          <tr key={dividend.id} className="border-b">
                            <td className="p-2">{dividend.date.toLocaleDateString()}</td>
                            <td className="p-2">
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                              }).format(dividend.amount)}
                            </td>
                            <td className="p-2">{dividend.yieldPercentage.toFixed(2)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    No dividend history available for this investment.
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
