import Chart from '@/components/common/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getDashboardComparison } from '@/lib/actions';

export default async function ComparisonChart({ searchParams }: { searchParams: Promise<{ period: string }> }) {
  const { period } = await searchParams;
  const data = await getDashboardComparison(period);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Compare your monthly income and expenses</CardDescription>
      </CardHeader>
      <CardContent className="h-[400px]">
        <Chart
          type="bar"
          data={data as unknown as Record<string, unknown>[]}
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
