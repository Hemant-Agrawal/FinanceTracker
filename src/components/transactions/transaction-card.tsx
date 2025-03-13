import React from 'react';

import { Card, CardContent } from '@/ui/card';
import { Checkbox } from '@/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/ui/dropdown-menu';
import { Button } from '@/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { Badge } from '@/ui/badge';
import { getPaymentMethodIcon, getStatusColor, formatCurrency } from '@/lib/utils';
import { Transaction } from '@/models/Transaction';
import { formatDate } from '@/lib/date';

interface TransactionCardProps {
  transaction: Transaction;
  selectedTransactions: string[];
  onSelectTransaction: (id: string, isSelected: boolean) => void;
  onViewTransaction: (transaction: Transaction) => void;
}

const TransactionCard = ({
  transaction,
  selectedTransactions,
  onSelectTransaction,
  onViewTransaction,
}: TransactionCardProps) => {
  return (
    <Card
      key={`${transaction._id}`}
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onViewTransaction(transaction)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-medium flex items-center gap-2">
              {transaction.description}
              <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
            </h3>

            <p className="text-sm text-muted-foreground">{formatDate(transaction.date)}</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={selectedTransactions.includes(`${transaction._id}`)}
              onCheckedChange={checked => onSelectTransaction(`${transaction._id}`, checked === true)}
              aria-label={`Select transaction ${transaction.description}`}
              onClick={e => e.stopPropagation()}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild onClick={e => e.stopPropagation()}>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onViewTransaction(transaction)}>View details</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            {getPaymentMethodIcon(transaction.paymentMethod.type)}
            <span className="text-sm">{transaction.paymentMethod.name}</span>
          </div>
          <p className={`font-semibold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(transaction.amount)}
          </p>
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {transaction.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {transaction.tags.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{transaction.tags.length - 2} more
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionCard;
