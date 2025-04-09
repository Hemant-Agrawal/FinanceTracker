import type { Metadata } from 'next';
import TransactionReview from '@/components/transactions/manual-review';
import { fetchTransactionsForReview } from '@/lib/server-api';
import Modal from '@/modal';

export const metadata: Metadata = {
  title: 'Review | Finance Tracker',
  description: 'Review your transactions',
};

export default async function ReviewPage() {
  const { transactions, emailRecords } = await fetchTransactionsForReview();

  return (
    <Modal title="Review Transactions" description="" className="max-w-screen-xl">
      <TransactionReview transactions={transactions} emailRecords={emailRecords} />
    </Modal>
  );
}
