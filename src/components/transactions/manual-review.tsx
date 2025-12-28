'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmailViewer from '@/components/common/email-viewer';
import { Transaction } from '@/models/Transaction';
import { EmailRecord } from '@/models/EmailRecord';
import { TransactionDetails } from './transaction-details';
import { approveTransaction, rejectTransaction } from '@/lib/actions';

export default function TransactionReview({
  transactions,
  emailRecords,
}: {
  transactions: Transaction[];
  emailRecords: EmailRecord[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const transaction = transactions[currentIndex];
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!transactions.length) return;

      if (e.key === 'y' || e.key === 'Enter') {
        handleApprove();
      } else if (e.key === 'n' || e.key === 'Escape') {
        handleReject();
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    },
    [transactions, currentIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentIndex < transactions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const updateStatus = async (status: string) => {
    if (!transaction || !transaction._id) return;

    try {
      if (status === 'approve') {
        await approveTransaction(transaction._id.toString());
      } else {
        await rejectTransaction(transaction._id.toString());
      }

      toast({
        title: `Transaction ${status === 'approve' ? 'approved' : 'rejected'}`,
        description: `Transaction #${transaction._id} has been ${status}`,
        variant: status === 'approve' ? 'default' : 'destructive',
      });

      // Move to next pending transaction
      const nextPendingIndex = transactions.findIndex((t, i) => i > currentIndex && t.status === 'pending');

      if (nextPendingIndex !== -1) {
        setCurrentIndex(nextPendingIndex);
      } else {
        // If no more pending, stay on current or go to first pending
        const firstPendingIndex = transactions.findIndex(t => t.status === 'pending');
        if (firstPendingIndex !== -1 && firstPendingIndex !== currentIndex) {
          setCurrentIndex(firstPendingIndex);
        }
      }
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        title: 'Error updating transaction',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = () => updateStatus('approve');
  const handleReject = () => updateStatus('reject');

  if (!transactions.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No transactions to review</h2>
        <Button onClick={() => router.refresh()}>Refresh</Button>
      </div>
    );
  }

  const email = emailRecords.find(e => e._id === transaction.referenceId);

  return (
    <div className="flex gap-6">
      <div className="w-full max-w-lg">
        <Card>
          {/* <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction Details</span>
              <Badge
                variant={
                  transaction.status === 'approved' ? 'success' : transaction.status === 'rejected' ? 'destructive' : 'secondary'
                }
              >
                {transaction.status}
              </Badge>
            </CardTitle>
          </CardHeader> */}
          <CardContent>
            <TransactionDetails transaction={transaction} hideHistory />
          </CardContent>
          <CardFooter className="flex justify-between border-t p-4">
            <Button
              variant="outline"
              onClick={handleReject}
              className="flex items-center gap-2"
              title="Reject (n or Escape)"
            >
              <X className="h-4 w-4" /> Reject
            </Button>
            <Button onClick={handleApprove} className="flex items-center gap-2" title="Approve (y or Enter)">
              <Check className="h-4 w-4" /> Approve
            </Button>
          </CardFooter>
        </Card>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {currentIndex + 1} of {transactions.length}
            </Badge>
            <Badge variant={pendingCount > 0 ? 'secondary' : 'outline'} className="text-sm">
              {pendingCount} pending
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              disabled={currentIndex === transactions.length - 1}
              title="Next (Right Arrow)"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {email && <EmailViewer email={email} className="w-full" />}
    </div>
  );
}

//   <div className="mt-4 text-sm text-muted-foreground">
//     <p className="font-medium">Keyboard shortcuts:</p>
//     <ul className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 mt-1">
//       <li>
//         <kbd className="px-1 rounded bg-muted">y</kbd> or <kbd className="px-1 rounded bg-muted">Enter</kbd>:
//         Approve
//       </li>
//       <li>
//         <kbd className="px-1 rounded bg-muted">n</kbd> or <kbd className="px-1 rounded bg-muted">Esc</kbd>: Reject
//       </li>
//       <li>
//         <kbd className="px-1 rounded bg-muted">←</kbd>: Previous transaction
//       </li>
//       <li>
//         <kbd className="px-1 rounded bg-muted">→</kbd>: Next transaction
//       </li>
//       <li>
//         <kbd className="px-1 rounded bg-muted">h</kbd>: HTML view
//       </li>
//       <li>
//         <kbd className="px-1 rounded bg-muted">t</kbd>: Text view
//       </li>
//     </ul>
//   </div>
