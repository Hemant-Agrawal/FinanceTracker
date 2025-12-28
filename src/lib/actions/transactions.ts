'use server';

import { AccountColl, TransactionColl } from '@/models';
import { auth } from '@/auth';
import { Filter, ObjectId } from 'mongodb';
import { Transaction } from '@/models/Transaction';
import { revalidatePath } from 'next/cache';

export interface GetTransactionsParams {
  pageSize?: number;
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getTransactions(params: GetTransactionsParams = {}) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  const filters: Filter<Transaction> = { status: 'approved' };
  if (params.search) {
    filters.description = { $regex: params.search };
  }
  filters.createdBy = new ObjectId(authUser.user.id);

  const sortField = params.sortField || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

  const transactions = await TransactionColl.paginate(filters, page, pageSize, {
    [sortField]: sortOrder,
  });

  return transactions;
}

export async function getTransactionById(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const transaction = await TransactionColl.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }
  return transaction;
}

export async function createTransaction(data: Partial<Transaction>) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  if (!data.paymentMethod) {
    throw new Error('Payment method is required');
  }

  if (!data.type) {
    throw new Error('Transaction type is required');
  }

  if (!data.description) {
    throw new Error('Description is required');
  }

  if (data.amount === undefined || data.amount === null) {
    throw new Error('Amount is required');
  }

  const paymentMethodId = typeof data.paymentMethod === 'string' 
    ? data.paymentMethod 
    : (data.paymentMethod as { _id?: { toString: () => string } })?._id?.toString() || '';
  const paymentMethod = await AccountColl.findById(paymentMethodId);
  if (!paymentMethod) {
    throw new Error('Invalid Payment Method');
  }

  const body = {
    description: data.description,
    amount: data.amount,
    date: data.date ? new Date(data.date) : new Date(),
    type: data.type,
    paymentMethod: {
      _id: paymentMethod._id,
      name: paymentMethod.name,
      type: paymentMethod.type,
    },
    tags: data.tags || [],
    notes: data.notes || '',
    history: data.history || [],
  } as Transaction;

  const newTransaction = await TransactionColl.insert(body, authUser.user.id);
  if (newTransaction) {
    await AccountColl.updateBalance(paymentMethod._id, data.amount);
  }

  revalidatePath('/transactions');
  return newTransaction;
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  // If paymentMethod is a string (ID), convert it to PaymentMethod object
  if (data.paymentMethod && typeof data.paymentMethod === 'string') {
    const paymentMethod = await AccountColl.findById(data.paymentMethod);
    if (!paymentMethod) {
      throw new Error('Invalid Payment Method');
    }
    data.paymentMethod = {
      _id: paymentMethod._id,
      name: paymentMethod.name,
      type: paymentMethod.type,
    };
  }

  // Convert date string to Date if needed
  if (data.date && typeof data.date === 'string') {
    data.date = new Date(data.date);
  }

  const updated = await TransactionColl.updateById(id, data);
  revalidatePath('/transactions');
  revalidatePath(`/transactions/${id}`);
  return updated;
}

export async function deleteTransaction(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  await TransactionColl.deleteById(id);
  revalidatePath('/transactions');
  return { message: 'Transaction deleted' };
}

export async function getRecentTransactions(limit = 5) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const filter = { createdBy: new ObjectId(authUser.user.id) };
  const transactions = await TransactionColl.list(filter, limit, 0, { createdAt: -1 });
  return transactions;
}

export async function approveTransaction(id: string) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const transaction = await TransactionColl.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const updated = await TransactionColl.updateById(id, { status: 'approved' });
  if (updated && transaction.paymentMethod) {
    await AccountColl.updateBalance(transaction.paymentMethod._id, transaction.amount);
  } else {
    throw new Error('Failed to approve transaction');
  }

  revalidatePath('/transactions');
  revalidatePath('/transactions/review');
  return { success: true };
}

export async function rejectTransaction(id: string) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const transaction = await TransactionColl.findById(id);
  if (!transaction) {
    throw new Error('Transaction not found');
  }

  const updated = await TransactionColl.updateById(id, { status: 'rejected' });
  if (updated && transaction.paymentMethod) {
    // Reverse the balance change if transaction was already applied
    await AccountColl.updateBalance(transaction.paymentMethod._id, -transaction.amount);
  } else {
    throw new Error('Failed to reject transaction');
  }

  revalidatePath('/transactions');
  revalidatePath('/transactions/review');
  return { success: true };
}

export async function getTransactionsForReview() {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const { EmailRecordColl } = await import('@/models');
  const filter: Filter<Transaction> = {
    createdBy: new ObjectId(authUser.user.id),
    status: 'pending',
  };
  const transactions = await TransactionColl.list(filter, 100, 0, { date: -1 });
  const emailRecords = await EmailRecordColl.list(
    {
      createdBy: new ObjectId(authUser.user.id),
      _id: { $in: transactions.map(t => new ObjectId(t.referenceId || '')) },
    },
    100,
    0,
    { date: -1 }
  );

  return { transactions, emailRecords };
}

