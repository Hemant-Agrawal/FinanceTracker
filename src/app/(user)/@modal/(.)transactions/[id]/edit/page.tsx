import { TransactionForm } from '@/components/transactions/transaction-form';
import { fetchAccounts, getTransactionById } from '@/lib/server-api';
import Modal from '@/modal';
import { notFound } from 'next/navigation';
export default async function EditPageModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const transaction = await getTransactionById(id);
  if (!transaction) notFound();
  
  const { data: accounts } = await fetchAccounts({});

  return (
    <Modal title="Edit Transaction" description="Edit a transaction to your account.">
      <TransactionForm paymentMethods={accounts} transaction={transaction} />
    </Modal>
  );
}
