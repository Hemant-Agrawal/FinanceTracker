"use client"
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Sample data - would be fetched from API in production
const MONTHLY_DATA = [
  { date: 'Jan', value: 1000000 },
  { date: 'Feb', value: 1020000 },
  { date: 'Mar', value: 1050000 },
  { date: 'Apr', value: 1040000 },
  { date: 'May', value: 1080000 },
  { date: 'Jun', value: 1100000 },
  { date: 'Jul', value: 1150000 },
  { date: 'Aug', value: 1180000 },
  { date: 'Sep', value: 1200000 },
  { date: 'Oct', value: 1230000 },
  { date: 'Nov', value: 1240000 },
  { date: 'Dec', value: 1250000 },
];

const YEARLY_DATA = [
  { date: '2018', value: 800000 },
  { date: '2019', value: 900000 },
  { date: '2020', value: 950000 },
  { date: '2021', value: 1050000 },
  { date: '2022', value: 1150000 },
  { date: '2023', value: 1250000 },
];

const QUARTERLY_DATA = [
  { date: 'Q1 2022', value: 1000000 },
  { date: 'Q2 2022', value: 1050000 },
  { date: 'Q3 2022', value: 1100000 },
  { date: 'Q4 2022', value: 1150000 },
  { date: 'Q1 2023', value: 1180000 },
  { date: 'Q2 2023', value: 1200000 },
  { date: 'Q3 2023', value: 1220000 },
  { date: 'Q4 2023', value: 1250000 },
];

const Performance = () => {

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Portfolio Performance</CardTitle>
        <CardDescription>Historical growth of your investment portfolio</CardDescription>
        <Tabs className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="quarterly">Quarterly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ value: { label: 'Portfolio Value', color: 'hsl(var(--chart-1))' } }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={MONTHLY_DATA}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={value => `₹${(value / 100000).toFixed(1)}L`} />
              <ChartTooltip
                content={<ChartTooltipContent formatter={value => `₹${Number(value).toLocaleString()}`} />}
              />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="var(--color-value)" activeDot={{ r: 8 }} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default Performance;
