'use client';
import React from 'react';
import { DialogDescription, DialogContent, DialogHeader, DialogTitle, Dialog } from '@/components/ui/dialog';
import { useRouter } from 'next/navigation';

const Modal = ({
  children,
  title,
  description,
  actions = [],
  className,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  description: React.ReactNode;
  actions?: React.ReactNode[];
  className?: string;
}) => {
  const router = useRouter();

  function onDismiss() {
    router.back();
  }

  return (
    <Dialog open onOpenChange={onDismiss}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{title}</span>
            <div className="flex items-center gap-2 pr-4">
              {actions.map((action, index) => (
                <React.Fragment key={index}>{action}</React.Fragment>
              ))}
            </div>
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
