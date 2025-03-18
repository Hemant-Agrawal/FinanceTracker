'use client';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import { Column, DataTable } from '@/common/table';
import { formatDate } from '@/lib/date';
import { Loan } from '@/models/Loan';

// Generate upcoming payments
const generateUpcomingPayments = (loan: Loan) => {
  const payments = [];

  const nextPaymentDate = new Date(loan.nextPaymentDate);

  for (let i = 0; i < 6; i++) {
    const paymentDate = new Date(nextPaymentDate);
    paymentDate.setMonth(paymentDate.getMonth() + i);

    payments.push({
      id: `upcoming-${loan._id}-${i}`,
      loanId: loan._id,
      loanName: loan.name,
      amount: loan.emiAmount,
      dueDate: new Date(paymentDate),
      status: i === 0 ? 'upcoming' : 'scheduled',
    });
  }

  // Sort by date
  return payments.sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());
};

export function UpcomingPayments({ loan }: { loan: Loan }) {
  const upcomingPayments = generateUpcomingPayments(loan);


  const columns: Column<(typeof upcomingPayments)[number]>[] = [
    {
      key: 'dueDate',
      label: 'Due Date',
      render: row => formatDate(row.dueDate),
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
      key: 'status',
      label: 'Status',
      render: row => row.status === 'upcoming' ? 'Due Soon' : 'Scheduled',
    },
  ];

  return <DataTable columns={columns} data={upcomingPayments} getRowId={row => row.id} />
}
