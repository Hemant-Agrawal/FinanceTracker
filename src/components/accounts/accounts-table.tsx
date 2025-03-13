'use client';

import { formatCurrency, getAccountTypeColor, getPaymentMethodIcon } from '@/lib/utils';
import { Edit, Trash } from 'lucide-react';
import { Badge } from '@/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/ui/tooltip';
import Link from 'next/link';
import { Account } from '@/models/Account';
import { formatDateWithTime } from '@/lib/date';
import { Column, DataTable } from '../common/table';


interface Props {
  accounts: Account[];
  selectedAccounts: string[];
  onSelectAccount: (id: string, isSelected: boolean) => void;
  onSelectAll: (isSelected: boolean) => void;
  onViewDetails: (account: Account) => void;
}

export function AccountsTable({ accounts, selectedAccounts, onSelectAccount, onSelectAll, onViewDetails }: Props) {
  const columns: Column<Account>[] = [
    {
      key: 'name',
      label: 'Name',
      render: account => (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/accounts/${account._id}`} className="hover:underline">
                {account.name}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>Current Balance: {formatCurrency(account.currentBalance)}</p>
              <p className="text-xs text-muted-foreground">Click to view details</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ),
    },
    {
      key: 'accountDetails',
      label: 'Account Details',
    },
    {
      key: 'type',
      label: 'Type',
      render: account => (
        <Badge className={getAccountTypeColor(account.type)} variant="outline">
          {getPaymentMethodIcon(account.type)}
          {account.type}
        </Badge>
      ),
    },
    {
      key: 'openingBalance',
      label: 'Opening Balance',
      render: account => (
        <span className={account.openingBalance < 0 ? 'text-red-500' : 'text-green-500'}>
          {formatCurrency(account.openingBalance)}
        </span>
      ),
    },
    {
      key: 'currentBalance',
      label: 'Current Balance',
      render: account => (
        <span className={account.currentBalance < 0 ? 'text-red-500' : 'text-green-500'}>
          {formatCurrency(account.currentBalance)}
        </span>
      ),
    },
    {
      key: 'updatedAt',
      label: 'Last Updated On',
      render: account => formatDateWithTime(account.updatedAt!),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={accounts}
      selectedRows={selectedAccounts}
      onSelectRow={onSelectAccount}
      onSelectAll={onSelectAll}
      onRowClick={onViewDetails}
      actions={[
        {
          label: 'Edit',
          icon: <Edit />,
          onClick: account => console.log(account),
        },
        {
          label: 'Delete',
          icon: <Trash />,
          onClick: account => console.log(account),
        },
      ]}
    />
  );
}
