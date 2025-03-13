// components/TransactionsTable.tsx
'use client';

import { Badge } from '@/ui/badge';
import { formatCurrency, getPaymentMethodIcon, getStatusColor } from '@/lib/utils';
import { Column, DataTable } from '@/components/common/table';
import { Transaction } from '@/models/Transaction';
import { formatDate, formatTime } from '@/lib/date';
import { WithId } from 'mongodb';

interface Props {
  transactions: WithId<Transaction>[];
  selectedTransactions?: string[];
  onSelectTransaction?: (id: string, isSelected: boolean) => void;
  onSelectAll?: (isSelected: boolean) => void;
  onViewTransaction?: (transaction: WithId<Transaction>) => void;
  showTime?: boolean;
}

export function TransactionsTable({
  transactions,
  selectedTransactions,
  onSelectTransaction,
  onSelectAll,
  onViewTransaction,
  showTime = false,
}: Props) {
  const columns: Column<Transaction>[] = [
    {
      key: 'date',
      label: 'Date',
      render: row => (
        <div className="flex flex-col">
          {formatDate(row.date)}
          {showTime && <span className="text-xs text-gray-500">{formatTime(row.date)}</span>}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Transaction',
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      hideBreakpoint: 'md',
      render: row => (
        <div className="flex items-center">
          {getPaymentMethodIcon(row.paymentMethod.type)}
          {row.paymentMethod.name}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      hideBreakpoint: 'md',
    },
    {
      key: 'tags',
      label: 'Tags',
      hideBreakpoint: 'lg',
      render: row => (
        <div className="flex flex-wrap gap-1">
          {row.tags.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      hideBreakpoint: 'lg',
      render: row => <Badge className={getStatusColor(row.status)}>{row.status}</Badge>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: row => (
        <span className={row.amount < 0 ? 'text-red-500' : 'text-green-500'}>{formatCurrency(row.amount)}</span>
      ),
    },
  ];

  return (
    <DataTable
      hideBorder={showTime}
      columns={columns}
      data={transactions}
      selectedRows={selectedTransactions}
      onSelectRow={onSelectTransaction}
      onSelectAll={onSelectAll}
      onRowClick={onViewTransaction}
    />
  );
}
