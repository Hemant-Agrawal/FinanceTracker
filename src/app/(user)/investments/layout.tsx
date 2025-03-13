import { DashboardHeader, DashboardShell } from '@/components/dashboard';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { List } from 'lucide-react';

export default function Layout({
  children,
  summary,
  recommendation,
  allocation,
  performance,
  topPerformers,
}: {
  children: React.ReactNode;
  summary: React.ReactNode;
  recommendation: React.ReactNode;
  allocation: React.ReactNode;
  performance: React.ReactNode;
  topPerformers: React.ReactNode;
}) {
  return (
    <DashboardShell>
      <DashboardHeader heading="Investments" text="Manage your investment portfolio">
        <Link href="/investments/list">
          <Button>
            <List className="mr-2 h-4 w-4" />
            View Investments
          </Button>
        </Link>
      </DashboardHeader>
      <div className="py-6 space-y-6">
        {summary}
        <div className="grid gap-6 md:grid-cols-2">
          {allocation}
          {performance}
        </div>
        {topPerformers}
        {children}
        {recommendation}
      </div>
    </DashboardShell>
  );
}
