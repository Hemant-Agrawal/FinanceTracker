'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { cn } from '@/lib/utils';

interface MonthlyOverviewProps {
  className?: string;
}

export function MonthlyOverview({ className }: MonthlyOverviewProps) {
  // In a real app, this would be fetched from the database
  const data = [
    { name: 'Jan', income: 42000, expenses: 9800 },
    { name: 'Feb', income: 42000, expenses: 10200 },
    { name: 'Mar', income: 42000, expenses: 11500 },
    { name: 'Apr', income: 42000, expenses: 9900 },
    { name: 'May', income: 45000, expenses: 10800 },
    { name: 'Jun', income: 45000, expenses: 11200 },
    { name: 'Jul', income: 45000, expenses: 12450 },
  ];

  return (
    <Card className={cn('lg:col-span-4', className)}>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Your income and expenses over the past months</CardDescription>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="income" fill="#10b981" name="Income" />
            <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
