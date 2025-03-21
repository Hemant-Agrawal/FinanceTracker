import type { Metadata } from 'next';
import TransactionReview from '@/components/transactions/manual-review';
import { fetchEmails } from '@/lib/server-api';
export const metadata: Metadata = {
  title: 'Dashboard | Finance Tracker',
  description: 'Monitor your financial activities and track your expenses',
};

export default async function DashboardPage() {
  const emails = await fetchEmails();
  return (
    <div className="p-4">
      <TransactionReview emails={emails} />
    </div>
  );
}
