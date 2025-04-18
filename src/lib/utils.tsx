import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CreditCard, Wallet, Building2, Landmark, PiggyBank, Banknote } from 'lucide-react';
import { AccountType } from '@/config';
import { ManipulateType } from 'dayjs';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAccountTypeColor(type: AccountType): string {
  const colors: { [key: string]: string } = {
    Bank: 'bg-blue-200 text-blue-800',
    Cash: 'bg-green-200 text-green-800',
    'Credit Card': 'bg-red-200 text-red-800',
    Investment: 'bg-purple-200 text-purple-800',
    Loan: 'bg-orange-200 text-orange-800',
    // Add more account types and colors as needed
  };
  return colors[type] || 'bg-gray-200 text-gray-800';
}

export const getPaymentMethodIcon = (method: AccountType) => {
  switch (method.toLowerCase()) {
    case 'credit card':
      return <CreditCard className="h-4 w-4 mr-1" />;
    case 'cash':
      return <Wallet className="h-4 w-4 mr-1" />;
    case 'bank':
      return <Building2 className="h-4 w-4 mr-1" />;
    case 'loan':
      return <Landmark className="h-4 w-4 mr-1" />;
    case 'other':
      return <CreditCard className="h-4 w-4 mr-1" />;
    default:
      return null;
  }
};

export const getStatusColor = (status = '') => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    case 'failed':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    case 'Active':
      return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    case 'Matured':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    case 'Closed':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  }
};

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getInvestmentTypeIcon(type: string) {
  switch (type) {
    case 'Stock':
      return <Building2 className="h-4 w-4 mr-2 text-blue-500" />;
    case 'Mutual Fund':
      return <PiggyBank className="h-4 w-4 mr-2 text-purple-500" />;
    case 'Bond':
      return <Landmark className="h-4 w-4 mr-2 text-green-500" />;
    case 'Fixed Deposit':
      return <Banknote className="h-4 w-4 mr-2 text-red-500" />;
    case 'ETF':
      return <Building2 className="h-4 w-4 mr-2 text-blue-500" />;
    case 'Insurance':
      return <Wallet className="h-4 w-4 mr-2 text-yellow-500" />;
    default:
      return <CreditCard className="h-4 w-4 mr-2 text-gray-500" />;
  }
}

export function getPeriod(period: string): { dateUnit: ManipulateType; dateValue: number } {
  switch (period) {
    case 'today':
      return { dateUnit: 'day', dateValue: 1 };
    case '7days':
      return { dateUnit: 'day', dateValue: 7 };
    case 'week':
      return { dateUnit: 'week', dateValue: 1 };
    case 'month':
      return { dateUnit: 'month', dateValue: 1 };
    case 'quarter':
      return { dateUnit: 'month', dateValue: 3 };
    case '6months':
      return { dateUnit: 'month', dateValue: 6 };
    case 'year':
      return { dateUnit: 'year', dateValue: 1 };
    default:
      return { dateUnit: 'day', dateValue: 7 };
  }
}

export function getInitial(name: string | null | undefined): string {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.charAt(0).toUpperCase();
}