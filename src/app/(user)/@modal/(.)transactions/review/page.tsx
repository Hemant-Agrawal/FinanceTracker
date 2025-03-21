import type { Metadata } from 'next';
import TransactionReview from '@/components/transactions/manual-review';
import { fetchEmails } from '@/lib/server-api';
import Modal from '@/modal';

export const metadata: Metadata = {
  title: 'Review | Finance Tracker',
  description: 'Review your transactions',
};

export default async function ReviewPage() {
  const emails = await fetchEmails();
  return (
    <Modal title="Review Transactions" description="Review your transactions" className="max-w-screen-xl">
      <TransactionReview emails={emails} />
    </Modal>
  );
}
