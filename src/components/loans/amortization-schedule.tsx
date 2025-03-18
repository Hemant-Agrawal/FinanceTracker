'use client';

import { formatCurrency } from '@/lib/utils';
import { Column, DataTable } from '../common/table';
import { Loan } from '@/models/Loan';

interface Props {
  loan: Loan;
}

// Calculate amortization schedule
const calculateAmortizationSchedule = (loan: Loan) => {
  const monthlyRate = loan.interestRate / 100 / 12;
  const emi = loan.emiAmount;

  let balance = loan.principalAmount;
  const schedule = [];

  for (let i = 1; i <= loan.tenure; i++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = emi - interestPayment;
    balance -= principalPayment;

    schedule.push({
      month: i,
      emi: emi,
      principal: principalPayment,
      interest: interestPayment,
      balance: balance > 0 ? balance : 0,
    });

    if (balance <= 0) break;
  }

  return schedule;
};

export function AmortizationSchedule({ loan }: Props) {
  const amortizationSchedule = calculateAmortizationSchedule(loan);
  const columns: Column<(typeof amortizationSchedule)[number]>[] = [
    {
      key: 'month',
      label: 'Month',
    },
    {
      key: 'emi',
      label: 'EMI',
      render: row => formatCurrency(row.emi),
    },
    {
      key: 'principal',
      label: 'Principal',
      render: row => formatCurrency(row.principal),
    },
    {
      key: 'interest',
      label: 'Interest',
      render: row => formatCurrency(row.interest),
    },
    {
      key: 'balance',
      label: 'Balance',
      render: row => formatCurrency(row.balance),
    },
  ];

  return <DataTable columns={columns} data={amortizationSchedule.slice(0, 12)} getRowId={row => row.month.toString()} />;
}
