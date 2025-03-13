'use client';

import { formatCurrency, getPaymentMethodIcon, getAccountTypeColor, cn } from '@/lib/utils';
import { Badge } from '@/ui/badge';
import { formatDateWithTime } from '@/lib/date';
import { Account } from '@/models/Account';
import { WithId } from 'mongodb';

export function AccountDetails({ type, openingBalance, currentBalance, updatedAt }: WithId<Account>) {
  return (
    <div className="grid gap-4 border rounded-md p-4">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Account Type:</span>
        <Badge className={getAccountTypeColor(type)} variant="outline">
          {getPaymentMethodIcon(type)}
          {type}
        </Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Opening Balance:</span>
        <span className={openingBalance < 0 ? 'text-red-500' : 'text-green-500'}>
          {formatCurrency(openingBalance)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Current Balance:</span>
        <span className={cn('text-lg font-bold', currentBalance < 0 ? 'text-red-500' : 'text-green-500')}>
          {formatCurrency(currentBalance)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-semibold">Last Updated:</span>
        <span>{formatDateWithTime(updatedAt!)}</span>
      </div>
    </div>
  );
}
