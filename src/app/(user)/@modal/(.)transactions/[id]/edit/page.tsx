import { TransactionForm } from '@/components/transactions/transaction-form';
import { getAccounts, getTransactionById } from '@/lib/actions';
import Modal from '@/modal';
import { notFound } from 'next/navigation';
export default async function EditPageModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  if (!transaction) notFound();
  
  const { data: accounts } = await getAccounts({});

  return (
    <Modal title="Edit Transaction" description="Edit a transaction to your account.">
      <TransactionForm paymentMethods={accounts} transaction={transaction} />
    </Modal>
  );
}
