'use server';

import { InvestmentTransactionColl } from '@/models';
import { InvestmentTransaction } from '@/models/InvestmentTransaction';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';
import { ObjectId } from 'mongodb';

export interface GetInvestmentTransactionsParams {
  pageSize?: number;
  page?: number;
  type?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getInvestmentTransactions(params: GetInvestmentTransactionsParams = {}) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  const filters: Record<string, unknown> = {};
  if (params.type) {
    filters.type = params.type;
  }

  const sortField = params.sortField || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

  const transactions = await InvestmentTransactionColl.list(
    filters,
    pageSize,
    (page - 1) * pageSize,
    {
      [sortField]: sortOrder,
    }
  );

  return transactions;
}

export async function getInvestmentTransactionById(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const transaction = await InvestmentTransactionColl.findById(id);
  if (!transaction) {
    throw new Error('Investment transaction not found');
  }
  return transaction;
}

export async function createInvestmentTransaction(data: Partial<InvestmentTransaction>) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  if (!data.investmentId || !data.accountId || !data.type || !data.date) {
    throw new Error('Missing required fields: investmentId, accountId, type, and date are required');
  }

  const newTransaction = await InvestmentTransactionColl.insert(
    {
      investmentId: data.investmentId instanceof ObjectId ? data.investmentId : new ObjectId(data.investmentId),
      accountId: data.accountId instanceof ObjectId ? data.accountId : new ObjectId(data.accountId),
      type: data.type,
      date: data.date instanceof Date ? data.date : new Date(data.date),
      pricePerUnit: data.pricePerUnit || 0,
      quantity: data.quantity || 0,
      totalAmount: data.totalAmount || (data.pricePerUnit || 0) * (data.quantity || 0),
      notes: data.notes || '',
    },
    authUser.user.id
  );
  revalidatePath('/investments');
  return newTransaction;
}

export async function updateInvestmentTransaction(id: string, data: Record<string, unknown>) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const updated = await InvestmentTransactionColl.updateById(id, data);
  revalidatePath('/investments');
  return updated;
}

export async function deleteInvestmentTransaction(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  await InvestmentTransactionColl.deleteById(id);
  revalidatePath('/investments');
  return { message: 'Investment transaction deleted' };
}

