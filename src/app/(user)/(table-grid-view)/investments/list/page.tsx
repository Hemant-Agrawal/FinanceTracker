import { DashboardHeader, DashboardShell } from '@/components/dashboard';
import Refresh from '@/ui/refresh';
import { ViewToggle } from '@/ui/view-toggle';
import { Filters } from '@/components/common/filter';
import Investments from '@/components/investments';
import Pagination from '@/components/common/pagination';
import { fetchInvestments } from '@/lib/server-api';
import { BulkActionsMenu } from '@/table-grid-view/bulk-actions-menu';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const { data: investments, pagination } = await fetchInvestments(params);
  const filters = {};

  return (
    <DashboardShell>
      <DashboardHeader heading="Your Investments" text="View and track all your investment holdings">
        <Refresh />
        <ViewToggle />
      </DashboardHeader>
      <div className="mx-auto space-y-6">
        <Filters filters={filters} />

        <BulkActionsMenu />
        <Investments investments={investments} />

        <Pagination {...pagination} />
      </div>
    </DashboardShell>
  );
}
