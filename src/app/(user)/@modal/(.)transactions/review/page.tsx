import type { Metadata } from 'next';
import TransactionReview from '@/components/transactions/manual-review';
import { getTransactionsForReview } from '@/lib/actions';
import Modal from '@/modal';

export const metadata: Metadata = {
  title: 'Review | Finance Tracker',
  description: 'Review your transactions',
};

export default async function ReviewPage() {
  const { transactions, emailRecords } = await getTransactionsForReview();

  return (
    <Modal title="Review Transactions" description="" className="max-w-screen-xl">
      <TransactionReview transactions={transactions} emailRecords={emailRecords} />
    </Modal>
  );
}
