import Chart from '@/components/common/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequest } from '@/lib/server-api';

export default async function ComparisonChart({ searchParams }: { searchParams: Promise<{ period: string }> }) {
  const { period } = await searchParams;
  const data = await getRequest<Record<string, string | number>[]>('/dashboard/comparison', { period });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Compare your monthly income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        <Chart
          type="bar"
          data={data}
          xAxisKey="key"
          dataKeys={[
            { key: 'income', label: 'Income' },
            { key: 'expenses', label: 'Expenses' },
          ]}
        />
      </CardContent>
    </Card>
  );
}
