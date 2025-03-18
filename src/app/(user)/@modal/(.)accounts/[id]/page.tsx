import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AccountDetails } from '@/components/accounts/account-details';
import { getAccountById } from '@/lib/server-api';
import Modal from '../../modal';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Account Details | Finance Tracker',
  description: 'View and manage your account details',
};

export default async function AccountPageModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }

  const actions = [
    <Link key="view" href={`/accounts/${id}`}>
      <Button variant="outline">
        <Eye className="h-4 w-4" />
        View
      </Button>
    </Link>,
  ];

  return (
    <Modal title="Account Details" description="View and manage your account details" actions={actions}>
      <AccountDetails {...account} />
    </Modal>
  );
}
