import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Chart from '@/components/common/chart';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';

export default async function Portfolio() {
  await new Promise(resolve => setTimeout(resolve, 1500));

  const investmentData = [
    { month: 'Jan', value: 10000 },
    { month: 'Feb', value: 10200 },
    { month: 'Mar', value: 10150 },
    { month: 'Apr', value: 10400 },
    { month: 'May', value: 10800 },
    { month: 'Jun', value: 11200 },
    { month: 'Jul', value: 11500 },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Investment Portfolio</CardTitle>
          <Link href="/transactions">
            <Button>
              <ExternalLink className="h-4 w-4" />
              View
            </Button>
          </Link>
        </div>
        <CardDescription>Track your investment performance</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Chart type="line" data={investmentData} xAxisKey="month" dataKeys={[{ key: 'value', label: 'Value' }]} />
      </CardContent>
    </Card>
  );
}
