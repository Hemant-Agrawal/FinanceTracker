import type { Metadata } from 'next';
import { DashboardHeader, DashboardShell } from '@/components/dashboard';
import { fetchAccounts } from '@/lib/server-api';
import Pagination from '@/components/common/pagination';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Accounts from '@/components/accounts';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Accounts | Finance Tracker',
  description: 'Manage your financial accounts',
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AccountsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const { data: accounts, pagination } = await fetchAccounts(params);
  return (
    <DashboardShell>
      <DashboardHeader heading="Accounts" text="View and manage your financial accounts">
        <Link href="/accounts/create">
          <Button className="hidden md:flex">
            <Plus className="mr-2 h-4 w-4" />
            Add Account
          </Button>
        </Link>
      </DashboardHeader>
      <Accounts accounts={accounts} />
      <Pagination {...pagination} />
    </DashboardShell>
  );
}
