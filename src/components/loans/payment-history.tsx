'use client';

import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { DataTable, Column } from '@/common/table';
import { formatDate } from '@/lib/date';
import { Loan } from '@/models/Loan';


// Generate mock payment history
const generatePaymentHistory = (loan: Loan) => {
  const history = [];

  const startDate = new Date(loan.startDate);
  const currentDate = new Date();
  const paymentDate = new Date(startDate);

  while (paymentDate < currentDate) {
    const status = Math.random() > 0.1 ? 'completed' : 'late';

    history.push({
      id: `payment-${loan._id}-${Math.random()}`,
      loanId: loan._id,
      loanName: loan.name,
      amount: loan.emiAmount,
      date: new Date(paymentDate),
      status: status,
      paymentMethod: ['Auto Debit', 'Net Banking', 'Credit Card'][Math.floor(Math.random() * 3)],
    });

    // Move to next month
    paymentDate.setMonth(paymentDate.getMonth() + 1);
  }

  // Sort by date, newest first
  return history.sort((a, b) => b.date.getTime() - a.date.getTime());
};
export function PaymentHistory({ loan }: { loan: Loan }) {
  const paymentHistory = generatePaymentHistory(loan);
  const columns: Column<(typeof paymentHistory)[number]>[] = [
    {
      key: 'date',
      label: 'Date',
      render: row => formatDate(row.date),
    },
    {
      key: 'loanName',
      label: 'Loan',
    },
    {
      key: 'amount',
      label: 'Amount',
      render: row => formatCurrency(row.amount),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
    },
    {
      key: 'status',
      label: 'Status',
      render: row => (
        <Badge variant={row.status === 'completed' ? 'default' : 'destructive'}>
          {row.status === 'completed' ? 'Paid' : 'Late'}
        </Badge>
      ),
    },
  ];

  return <DataTable columns={columns} data={paymentHistory} getRowId={row => row.id} />;
}
