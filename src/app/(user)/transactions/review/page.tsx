import type { Metadata } from 'next';
import TransactionReview from '@/components/transactions/manual-review';
import { getTransactionsForReview } from '@/lib/actions';
export const metadata: Metadata = {
  title: 'Dashboard | Finance Tracker',
  description: 'Monitor your financial activities and track your expenses',
};

export default async function DashboardPage() {
  const { transactions, emailRecords } = await getTransactionsForReview();
  return (
    <div className="p-4">
      <TransactionReview transactions={transactions} emailRecords={emailRecords} />
    </div>
  );
}
