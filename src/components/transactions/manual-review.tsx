'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import EmailViewer from '@/components/common/email-viewer';
import { EmailRecord } from '@/models/EmailRecord';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

export default function TransactionReview({ emails }: { emails: EmailRecord[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();
  const { toast } = useToast();

  const email = emails[currentIndex];
  const pendingCount = emails.filter(t => t.status === 'pending').length;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!emails.length) return;

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
    [emails, currentIndex]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  const handleNext = () => {
    if (currentIndex < emails.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const updateStatus = async (status: string) => {
    if (!email) return;

    try {
      //   await updateTransactionStatus(currentTransaction.id, status)

      toast({
        title: `Transaction ${status === 'approved' ? 'approved' : 'rejected'}`,
        description: `Transaction #${email._id} has been ${status}`,
        variant: status === 'approved' ? 'default' : 'destructive',
      });

      // Move to next pending transaction
      const nextPendingIndex = emails.findIndex((t, i) => i > currentIndex && t.status === 'pending');

      if (nextPendingIndex !== -1) {
        setCurrentIndex(nextPendingIndex);
      } else {
        // If no more pending, stay on current or go to first pending
        const firstPendingIndex = emails.findIndex(t => t.status === 'pending');
        if (firstPendingIndex !== -1 && firstPendingIndex !== currentIndex) {
          setCurrentIndex(firstPendingIndex);
        }
      }
    } catch (error) {
      toast({
        title: 'Error updating transaction',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleApprove = () => updateStatus('approved');
  const handleReject = () => updateStatus('rejected');

  if (!emails.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-4">No transactions to review</h2>
        <Button onClick={() => router.refresh()}>Refresh</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Transaction Details</span>
              <Badge
                variant={
                  email.status === 'approved' ? 'success' : email.status === 'rejected' ? 'destructive' : 'secondary'
                }
              >
                {email.status}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>{/* <TransactionDetails transaction={currentTransaction} /> */}</CardContent>
          <CardFooter className="flex justify-between border-t pt-6">
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
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {currentIndex + 1} of {emails.length}
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
              disabled={currentIndex === emails.length - 1}
              title="Next (Right Arrow)"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <EmailViewer email={email} className="col-span-2" />
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
