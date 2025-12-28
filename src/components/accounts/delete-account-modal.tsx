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
import { deleteAccount } from '@/lib/actions';
import { AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Account } from '@/models/Account';

interface DeleteAccountModalProps {
  account: Account;
  children: React.ReactNode;
}

export function DeleteAccountModal({ account, children }: DeleteAccountModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const onDelete = async () => {
    try {
      if (account._id) {
        await deleteAccount(account._id.toString());
        router.refresh();
        toast({
          title: 'Account Deleted',
          description: 'Account have been deleted successfully.',
        });
        setIsOpen(false);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to delete account',
        variant: 'destructive',
      });
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this account? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-2">You are about to delete:</p>
          <p className="font-medium">{account.name}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete Account
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
