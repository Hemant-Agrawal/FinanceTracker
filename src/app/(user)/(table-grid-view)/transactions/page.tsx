import { DashboardHeader, DashboardShell } from '@/components/dashboard';
import { ViewToggle } from '@/ui/view-toggle';
import { Button } from '@/ui/button';
import { Plus } from 'lucide-react';
import { Filters } from '@/components/common/filter';
import { getTransactions, getAccounts } from '@/lib/actions';
import Pagination from '@/components/common/pagination';
import Transactions from '@/components/transactions';
import { BulkActionsMenu } from '@/table-grid-view/bulk-actions-menu';
import Link from 'next/link';

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;
  const accountsResult = await getAccounts({});
  const { data: accounts } = accountsResult;
  const paymentMethod = accounts.find(account => account.name === params.paymentMethod);
  if (paymentMethod) {
    params.paymentMethod = paymentMethod._id.toString();
  }
  const transactionsResult = await getTransactions({
    pageSize: params.pageSize ? parseInt(String(params.pageSize)) : undefined,
    page: params.page ? parseInt(String(params.page)) : undefined,
    search: params.search ? String(params.search) : undefined,
    sortField: params.sortField ? String(params.sortField) : undefined,
    sortOrder: params.sortOrder === 'asc' ? 'asc' : 'desc',
  });
  const { data: transactions, pagination } = transactionsResult;

  const filters = {
    Categories: {
      key: 'category',
      type: 'checkbox' as const,
      options: [],
    },
    'Price Range': {
      key: 'priceRange',
      type: 'range' as const,
      options: [
        { label: 'Min', value: 0 },
        { label: 'Max', value: 1000 },
      ],
    },
    'Payment Method': {
      key: 'paymentMethod',
      type: 'checkbox' as const,
      options: accounts.map(account => ({ label: account.name, value: `${account.name}` })),
    },
  };

  return (
    <>
      <DashboardShell>
        <DashboardHeader heading="Transactions" text="View and manage your financial transactions">
          <ViewToggle />
          <Link href="/transactions/create">
            <Button className="hidden md:flex">
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </Link>
        </DashboardHeader>
        <div className="mx-auto space-y-6">
          <Filters filters={filters} />
          <BulkActionsMenu />
          <Transactions transactions={transactions} />
          <Pagination {...pagination} />
        </div>
      </DashboardShell>
    </>
  );
}
