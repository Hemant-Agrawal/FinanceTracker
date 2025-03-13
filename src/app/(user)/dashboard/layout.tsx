import { DashboardHeader, DashboardShell } from '@/components/dashboard';

import { Button } from '@/components/ui/button';
import { Calendar, Download, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function Layout({
  children,
  summary,
  comparison,
  breakdown,
  budget,
  portfolio,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
  comparison: React.ReactNode;
  breakdown: React.ReactNode;
  budget: React.ReactNode;
  portfolio: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Monitor your financial activities and track your expenses">
        <Select defaultValue="7days">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 Days</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Calendar className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Date Range</span>
        </Button>
        <Button variant="outline" size="sm" className="h-8 gap-1">
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Export</span>
        </Button>
        <Button variant="outline" size="icon" className="h-8 w-8">
          <RefreshCw className="h-4 w-4" />
          <span className="sr-only">Refresh</span>
        </Button>
      </DashboardHeader>
      <div className="space-y-6">
        {summary}
        <div className="grid gap-6 md:grid-cols-2">
          {comparison}
          {breakdown}
        </div>
        {children}
        <div className="grid gap-6 md:grid-cols-2">
          {portfolio}
          {budget}
        </div>
      </div>
    </DashboardShell>
  );
}
