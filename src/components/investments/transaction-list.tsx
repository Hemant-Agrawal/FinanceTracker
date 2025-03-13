'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Input } from '@/ui/input';
import { Button } from '@/ui/button';
import { Badge } from '@/ui/badge';
import { Filter } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/ui/table';
import { cn } from '@/lib/utils';

type Transaction = {
  id: string;
  date: Date;
  type: 'Buy' | 'Sell' | 'Dividend' | 'Interest' | 'Maturity';
  investmentId: string;
  investmentName: string;
  investmentType: string;
  units?: number;
  price?: number;
  amount: number;
  notes?: string;
};

// Sample transaction data
const transactions: Transaction[] = [
  {
    id: 't1',
    date: new Date('2023-01-15'),
    type: 'Buy',
    investmentId: '1',
    investmentName: 'Reliance Industries',
    investmentType: 'Stock',
    units: 100,
    price: 2500,
    amount: 250000,
    notes: 'Initial investment',
  },
  {
    id: 't2',
    date: new Date('2023-02-20'),
    type: 'Buy',
    investmentId: '2',
    investmentName: 'HDFC Bank',
    investmentType: 'Stock',
    units: 50,
    price: 1600,
    amount: 80000,
    notes: 'Portfolio diversification',
  },
  {
    id: 't3',
    date: new Date('2023-03-10'),
    type: 'Dividend',
    investmentId: '1',
    investmentName: 'Reliance Industries',
    investmentType: 'Stock',
    amount: 5000,
    notes: 'Quarterly dividend',
  },
  {
    id: 't4',
    date: new Date('2023-04-05'),
    type: 'Buy',
    investmentId: '3',
    investmentName: 'SBI Bluechip Fund',
    investmentType: 'Mutual Fund',
    units: 1000,
    price: 45,
    amount: 45000,
    notes: 'SIP investment',
  },
  {
    id: 't5',
    date: new Date('2023-05-15'),
    type: 'Sell',
    investmentId: '2',
    investmentName: 'HDFC Bank',
    investmentType: 'Stock',
    units: 20,
    price: 1650,
    amount: 33000,
    notes: 'Partial profit booking',
  },
  {
    id: 't6',
    date: new Date('2023-06-30'),
    type: 'Interest',
    investmentId: '5',
    investmentName: 'ICICI Bank FD',
    investmentType: 'Fixed Deposit',
    amount: 3000,
    notes: 'Half-yearly interest',
  },
  {
    id: 't7',
    date: new Date('2023-07-15'),
    type: 'Buy',
    investmentId: '4',
    investmentName: 'Government Bond 2025',
    investmentType: 'Bond',
    units: 10,
    price: 10000,
    amount: 100000,
    notes: 'Safe investment',
  },
  {
    id: 't8',
    date: new Date('2023-08-20'),
    type: 'Dividend',
    investmentId: '10',
    investmentName: 'Gold ETF',
    investmentType: 'ETF',
    amount: 2500,
    notes: 'Quarterly dividend',
  },
  {
    id: 't9',
    date: new Date('2023-09-10'),
    type: 'Sell',
    investmentId: '7',
    investmentName: 'Tata Motors',
    investmentType: 'Stock',
    units: 50,
    price: 500,
    amount: 25000,
    notes: 'Partial profit booking',
  },
  {
    id: 't10',
    date: new Date('2023-12-01'),
    type: 'Maturity',
    investmentId: '9',
    investmentName: 'Corporate Bond 2024',
    investmentType: 'Bond',
    amount: 102500,
    notes: 'Bond maturity',
  },
];

export function TransactionList() {
  const searchParams = useSearchParams();
  const investmentId = searchParams.get('investment');

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Filter transactions based on search term, type filter, and investment ID
  const filteredTransactions = transactions.filter(transaction => {
    if (investmentId && transaction.investmentId !== investmentId) return false;
    if (typeFilter && transaction.type !== typeFilter) return false;

    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.investmentName.toLowerCase().includes(searchLower) ||
      transaction.notes?.toLowerCase().includes(searchLower) ||
      transaction.type.toLowerCase().includes(searchLower)
    );
  });

  // Sort transactions by date (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Get unique transaction types
  const transactionTypes = Array.from(new Set(transactions.map(t => t.type)));

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              {investmentId ? 'Transactions for selected investment' : 'All investment transactions'}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center py-4 gap-4">
          <Input
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />

          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex-shrink-0">
                  <Filter className="mr-2 h-4 w-4" />
                  Type
                  {typeFilter && (
                    <Badge variant="secondary" className="ml-2">
                      {typeFilter}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTypeFilter(null)} className={!typeFilter ? 'bg-accent' : ''}>
                  All Types
                </DropdownMenuItem>
                {transactionTypes.map(type => (
                  <DropdownMenuItem
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={typeFilter === type ? 'bg-accent' : ''}
                  >
                    {type}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {(typeFilter || investmentId) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setTypeFilter(null);
                  // Clear the URL parameter for investment ID
                  if (investmentId) {
                    window.history.pushState({}, '', '/portfolio/transactions');
                  }
                }}
                className="flex-shrink-0"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        <div className="rounded-md border overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Investment</TableHead>
                  <TableHead className="hidden md:table-cell">Details</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.length > 0 ? (
                  sortedTransactions.map(transaction => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date.toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === 'Buy'
                              ? 'default'
                              : transaction.type === 'Sell'
                                ? 'destructive'
                                : transaction.type === 'Dividend'
                                  ? 'outline'
                                  : transaction.type === 'Interest'
                                    ? 'outline'
                                    : 'secondary'
                          }
                        >
                          {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{transaction.investmentName}</div>
                        <div className="text-xs text-muted-foreground">{transaction.investmentType}</div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {transaction.units && transaction.price ? (
                          <div>
                            <div>
                              {transaction.units} units at{' '}
                              {new Intl.NumberFormat('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                              }).format(transaction.price)}
                            </div>
                            {transaction.notes && (
                              <div className="text-xs text-muted-foreground">{transaction.notes}</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm">{transaction.notes}</div>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div
                          className={cn(
                            'font-medium',
                            transaction.type === 'Buy'
                              ? 'text-red-500'
                              : transaction.type === 'Sell' ||
                                  transaction.type === 'Dividend' ||
                                  transaction.type === 'Interest' ||
                                  transaction.type === 'Maturity'
                                ? 'text-green-500'
                                : ''
                          )}
                        >
                          {transaction.type === 'Buy' ? '-' : '+'}
                          {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                          }).format(transaction.amount)}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No transactions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
