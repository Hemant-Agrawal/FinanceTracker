import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import GenericChart from '@/components/common/chart';

// Sample data - would be fetched from API in production
const ALLOCATION_DATA = [
  { name: 'Stocks', value: 650000, color: '#0ea5e9' },
  { name: 'Mutual Funds', value: 350000, color: '#8b5cf6' },
  { name: 'Bonds', value: 150000, color: '#10b981' },
  { name: 'Fixed Deposits', value: 100000, color: '#f59e0b' },
  { name: 'Gold', value: 50000, color: '#f97316' },
];

const AllocationChart = () => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Investment Allocation</CardTitle>
        <CardDescription>Distribution of your investments across different asset classes</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <GenericChart type="pie" data={ALLOCATION_DATA} dataKeys={['value']} showLegend showTooltip />
        </div>
      </CardContent>
    </Card>
  );
};

export default AllocationChart;
