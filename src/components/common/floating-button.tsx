'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, TrendingUp, Wallet, CreditCard, BarChart4, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Backdrop } from '@/ui/backdrop';

interface FloatingActionButtonProps {
  className?: string;
}

export function FloatingActionButton({ className }: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const menuItems = [
    {
      id: 'add-transaction',
      label: 'Add Transaction',
      icon: <Wallet className="h-5 w-5" />,
      onClick: () => {
        console.log('Add Transaction clicked');
        setIsOpen(false);
      },
    },
    {
      id: 'add-investment',
      label: 'Add Investment',
      icon: <TrendingUp className="h-5 w-5" />,
      onClick: () => {
        console.log('Add Investment clicked');
        setIsOpen(false);
      },
    },
    {
      id: 'add-expense',
      label: 'Add Expense',
      icon: <CreditCard className="h-5 w-5" />,
      onClick: () => {
        console.log('Add Expense clicked');
        setIsOpen(false);
      },
    },
    {
      id: 'add-budget',
      label: 'Add Budget',
      icon: <BarChart4 className="h-5 w-5" />,
      onClick: () => {
        console.log('Add Budget clicked');
        setIsOpen(false);
      },
    },
    {
      id: 'add-savings',
      label: 'Add Savings Goal',
      icon: <PiggyBank className="h-5 w-5" />,
      onClick: () => {
        console.log('Add Savings Goal clicked');
        setIsOpen(false);
      },
    },
  ];

  return (
    <>
      <AnimatePresence>{isOpen && <Backdrop onClick={closeMenu} />}</AnimatePresence>
      <div className={cn('fixed bottom-12 right-6 z-50 flex flex-col items-end gap-4 md:hidden', className)}>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.id}
                  onClick={item.onClick}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: {
                      delay: 0.05 * index,
                      duration: 0.2,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    x: 20,
                    transition: {
                      delay: 0.05 * (menuItems.length - 1 - index),
                      duration: 0.2,
                    },
                  }}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                  aria-label={item.label}
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {item.icon}
                  </span>
                  {item.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={toggleMenu}
          className="flex h-14 w-14 items-center justify-center text-primary-foreground rounded-full bg-primary shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          whileTap={{ scale: 0.9 }}
          aria-label={isOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={isOpen ? 'close' : 'open'}
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
            </motion.div>
          </AnimatePresence>
        </motion.button>
      </div>
    </>
  );
}
