import Modal from '@/app/(user)/@modal/modal';
// import { DeleteTransactionModal } from '@/components/transactions/delete-transaction-modal';
import { Button } from '@/components/ui/button';
import { Edit, Trash } from 'lucide-react';
import { getTransactionById } from '@/lib/server-api';
import Link from 'next/link';

export default async function TransactionModal({ params }: { params: Promise<{ id: string }> }) {
  const photoId = (await params).id;

  const transaction = await getTransactionById(photoId);

  const actions = [
    <Link href={`/transactions/${photoId}/edit`}>
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Edit className="h-4 w-4" />
        Edit
      </Button>
    </Link>,
    <Link href={`/transactions/${photoId}/delete`}>
      <Button variant="destructive" size="sm" className="flex items-center gap-1">
        <Trash className="h-4 w-4" />
        Delete
      </Button>
    </Link>,
  ];
  return (
    <Modal title="Transaction Details" description="Add a new financial account to track your balance." actions={actions}>
      {/* <TransactionDetails transaction={transaction} /> */}
      <></>
    </Modal>
  );
}
