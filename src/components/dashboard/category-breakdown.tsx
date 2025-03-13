'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { cn } from '@/lib/utils';

interface CategoryBreakdownProps {
  className?: string;
}

export function CategoryBreakdown({ className }: CategoryBreakdownProps) {
  // In a real app, this would be fetched from the database
  const data = [
    { name: 'Housing', value: 5000 },
    { name: 'Food', value: 2500 },
    { name: 'Transportation', value: 1200 },
    { name: 'Entertainment', value: 800 },
    { name: 'Utilities', value: 1500 },
    { name: 'Others', value: 1450 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <Card className={cn('lg:col-span-3', className)}>
      <CardHeader>
        <CardTitle>Expense Categories</CardTitle>
        <CardDescription>Breakdown of your expenses by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={value => `₹${value.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
