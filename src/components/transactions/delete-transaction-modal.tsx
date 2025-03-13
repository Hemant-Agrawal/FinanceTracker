'use client';

import { Button } from '@/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { deleteRequest } from '@/lib/api';
import { Transaction } from '@/models/Transaction';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface DeleteTransactionModalProps {
  transaction: Transaction;
  children: React.ReactNode;
}

export function DeleteTransactionModal({ transaction, children }: DeleteTransactionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onDelete = () => {
    deleteRequest('/transactions', `${transaction._id}`).then(() => {
      router.refresh();
      toast({
        title: 'Transaction Deleted',
        description: 'Transaction have been deleted successfully.',
      });
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Transaction
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this transaction? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-2">You are about to delete:</p>
          <p className="font-medium">{transaction.description}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete Transaction
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
