'use client';

import { Transaction } from '@/models/Transaction';
import { useSearchParams, useRouter } from 'next/navigation';
import { TransactionsTable } from './transactions-table';
import TransactionCard from './transaction-card';
import { useTableGridContext } from '@/table-grid-view/provider';
import { WithId } from 'mongodb';

interface TransactionListProps {
  transactions: WithId<Transaction>[];
}

export default function Transactions({ transactions }: TransactionListProps) {
  const { selectedItems, handleSelectAll, handleSelectItem } = useTableGridContext();

  const isListView = useSearchParams().get('view') !== 'grid';
  const router = useRouter();

  const handleViewItem = (transaction: Transaction) => {
    router.push(`/transactions/${transaction._id}`);
  };

  return (
    <>
      {isListView ? (
        <TransactionsTable
          transactions={transactions}
          selectedTransactions={selectedItems}
          onSelectTransaction={handleSelectItem}
          onSelectAll={value => handleSelectAll(value, transactions)}
          onViewTransaction={handleViewItem}
        />
      ) : (
        // Card view for mobile/alternative view
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.length === 0 ? (
            <div className="col-span-full text-center py-10">No transactions found.</div>
          ) : (
            transactions.map(transaction => (
              <TransactionCard
                key={`${transaction._id}`}
                transaction={transaction}
                selectedTransactions={selectedItems}
                onSelectTransaction={handleSelectItem}
                onViewTransaction={handleViewItem}
              />
            ))
          )}
        </div>
      )}
    </>
  );
}
