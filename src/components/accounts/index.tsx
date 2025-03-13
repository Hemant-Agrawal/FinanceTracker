'use client';
import React from 'react';
import { AccountsTable } from './accounts-table';
import { Account } from '@/models/Account';
import { useTableGridContext } from '@/table-grid-view/provider';
import { useRouter } from 'next/navigation';

interface Props {
  accounts: Account[];
}

const Accounts = ({ accounts }: Props) => {
  const { selectedItems, handleSelectAll, handleSelectItem } = useTableGridContext();
  const router = useRouter();

  return (
    <AccountsTable
      accounts={accounts}
      selectedAccounts={selectedItems}
      onSelectAccount={handleSelectItem}
      onSelectAll={value => handleSelectAll(value, accounts)}
      onViewDetails={(item) => router.push(`/accounts/${item._id}`)}
    />
  );
};

export default Accounts;
