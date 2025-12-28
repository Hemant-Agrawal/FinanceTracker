import Modal from '@/app/(user)/@modal/modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { getTransactionById } from '@/lib/actions';
import Link from 'next/link';
import { TransactionDetails } from '@/components/transactions/transaction-details';
import { notFound } from 'next/navigation';

export default async function TransactionModal({ params }: { params: Promise<{ id: string }> }) {
  const photoId = (await params).id;

  const transaction = await getTransactionById(photoId);
  if (!transaction) return notFound();

  const actions = [
    <Link key="edit" href={`/transactions/${photoId}/edit`}>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </Link>,
    <Link key="delete" href={`/transactions/${photoId}/delete`}>
      <Button variant="destructive" size="sm" className="flex items-center gap-1">
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </Link>,
  ];
  return (
    <Modal title="Transaction Details" description="View and manage transaction details." actions={actions} className="w-full max-w-2xl">
      <TransactionDetails transaction={transaction} />
    </Modal>
  );
}
