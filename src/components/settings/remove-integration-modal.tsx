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
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface RemoveIntegrationModalProps {
  children: React.ReactNode;
  onRemove: () => void;
  title: string;
}

export function RemoveIntegrationModal({ children, onRemove, title }: RemoveIntegrationModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const onDelete = () => {
    onRemove();
    toast({
      title: 'Integration Removed',
      description: 'Integration have been removed successfully.',
    });
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Remove Integration
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to remove this integration? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <p className="mb-2">You are about to remove:</p>
          <p className="font-medium">{title}</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Remove Integration
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
