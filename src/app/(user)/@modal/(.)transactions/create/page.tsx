import { TransactionForm } from '@/components/transactions/transaction-form';
import { fetchAccounts } from '@/lib/server-api';
import Modal from '@/modal';

export default async function CreatePageModal() {
  const { data: accounts } = await fetchAccounts({});
  return (
    <Modal title="Create Transaction" description="Add a new transaction to your account.">
      <TransactionForm paymentMethods={accounts} />
    </Modal>
  );
}
