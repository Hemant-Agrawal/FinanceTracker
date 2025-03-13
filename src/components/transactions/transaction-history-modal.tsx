import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/ui/dialog';
import { formatCurrency } from '@/lib/utils';
import { Clock, ArrowUpDown } from 'lucide-react';
import { Badge } from '@/ui/badge';
import { Transaction } from '@/models/Transaction';
import { formatDateWithTime } from '@/lib/date';
import HistoryCard from '../common/history';

interface TransactionHistoryModalProps {
  transaction: Transaction;
  children: React.ReactNode;
}

export function TransactionHistoryModal({ transaction, children }: TransactionHistoryModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Transaction History
          </DialogTitle>
          <DialogDescription>View the history of changes for this transaction.</DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="mb-4 p-3 bg-muted rounded-md">
            <h3 className="font-medium">{transaction.description}</h3>
            <div className="flex items-center justify-between mt-1">
              <p className="text-sm text-muted-foreground">{formatDateWithTime(transaction.date)}</p>
              <p className={`font-medium ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                {formatCurrency(transaction.amount)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {transaction.history.length > 0 ? (
              transaction.history.map(entry => <HistoryCard key={`${entry._id}`} user={'system'} {...entry} />)
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No history available for this transaction.</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
