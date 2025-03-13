import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DashboardShell, DashboardHeader } from '@/components/dashboard';
import { AccountDetails } from '@/components/accounts/account-details';
import { fetchTransactions, getAccountById } from '@/lib/server-api';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { DeleteAccountModal } from '@/components/accounts/delete-account-modal';
import Link from 'next/link';
import Transactions from '@/components/transactions';

export const metadata: Metadata = {
  title: 'Account Details | Expense Tracker',
  description: 'View and manage your account details',
};

export default async function AccountPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }

  const { data: transactions } = await fetchTransactions({ accountId: id });

  return (
    <DashboardShell>
      <DashboardHeader heading={account.name} text="View and manage your account details">
        <Link href={`/accounts/${id}/edit`}>
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit Account
          </Button>
        </Link>
        <DeleteAccountModal account={account}>
          <Button variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            Delete Account
          </Button>
        </DeleteAccountModal>
      </DashboardHeader>
      <AccountDetails {...account} />
      <h1 className="font-heading text-lg md:text-xl lg:text-2xl pt-6 pb-2">Transactions</h1>
      <Transactions transactions={transactions} />
    </DashboardShell>
  );
}
