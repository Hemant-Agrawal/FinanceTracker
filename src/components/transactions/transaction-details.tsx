'use client';

import { Receipt, ArrowLeftRight, Calendar, Tag } from 'lucide-react';
import { Badge } from '@/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { formatCurrency, getStatusColor } from '@/lib/utils';
import { formatDate } from '@/lib/date';
import { Transaction } from '@/models/Transaction';
import HistoryCard from '../common/history';

interface TransactionDetailsProps {
  transaction: Transaction;
}

export function TransactionDetails({ transaction }: TransactionDetailsProps) {
  return (
    <Tabs defaultValue="details">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="details">Details</TabsTrigger>
        {/* <TabsTrigger value="splits">
              {transaction.splitExpense ? 'Split Details' : 'Related Transactions'}
            </TabsTrigger> */}
        <TabsTrigger value="history">History</TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-6 pt-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-semibold">{transaction.description}</h3>
          <div className={`text-2xl font-bold ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
            {formatCurrency(transaction.amount)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Date: </p>
            <p>{formatDate(transaction.date)}</p>
          </div>

          <div className="flex items-center gap-2">
            <ArrowLeftRight className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Type: </p>
            <p>{transaction.amount < 0 ? 'Expense' : 'Income'}</p>
          </div>

          <div className="flex items-center gap-2">
            <Tag className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Category: </p>
            <p>{transaction.category}</p>
          </div>

          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Payment Method: </p>
            <p>{transaction.paymentMethod.name}</p>
          </div>

          <div className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">Status: </p>
            <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
          </div>
        </div>

        {transaction.tags && transaction.tags.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-1">Tags</p>
            <div className="flex flex-wrap gap-1">
              {transaction.tags.map(tag => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {transaction.notes && (
          <div>
            <p className="text-sm font-medium mb-1">Notes</p>
            <p className="text-muted-foreground">{transaction.notes}</p>
          </div>
        )}

        {transaction.isRecurring && (
          <div>
            <p className="text-sm font-medium mb-1">Recurring</p>
            <p className="text-muted-foreground">This is a recurring transaction</p>
          </div>
        )}
      </TabsContent>

      <TabsContent value="splits" className="space-y-4 pt-4">
        {transaction.splitExpense ? (
          <div className="space-y-4">
            <div className="p-3 bg-muted rounded-md">
              <h3 className="font-medium">Split Details</h3>
              <p className="text-sm text-muted-foreground mt-1">
                This expense is split by {transaction.splitExpense.type === 'amount' ? 'amount' : 'percentage'}
              </p>
            </div>

            <div className="space-y-2">
              {transaction.splitExpense.parties.map((party, index) => (
                <div key={party.id} className="flex items-center justify-between p-3 border rounded-md">
                  <div>
                    <p className="font-medium">{party.name || `Person ${index + 1}`}</p>
                  </div>
                  <div className="font-medium">
                    {transaction.splitExpense?.type === 'amount'
                      ? formatCurrency(Number.parseFloat(party.amount || '0'))
                      : `${party.percentage || '0'}%`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-md border">
            <div className="p-4 text-center text-muted-foreground">
              <p>Related transactions will appear here.</p>
              <p className="text-sm">No related transactions found.</p>
            </div>
          </div>
        )}
      </TabsContent>
      <TabsContent value="history" className="space-y-4 pt-4">
        {transaction.history?.length > 0 ? (
          transaction.history.map(entry => <HistoryCard key={`${entry._id}`} user={'system'} {...entry} />)
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No history available for this transaction.</p>
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
