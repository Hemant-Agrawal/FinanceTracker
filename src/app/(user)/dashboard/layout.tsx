import { DashboardHeader, DashboardShell } from '@/components/dashboard';
import Filter from './filter';


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
        <Filter />
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
