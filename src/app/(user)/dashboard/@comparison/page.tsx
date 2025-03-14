import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default async function ComparisonChart() {
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
        <CardDescription>Compare your monthly income and expenses</CardDescription>
      </CardHeader>
      <CardContent>
        
      </CardContent>
    </Card>
  );
}
