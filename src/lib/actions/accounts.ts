'use server';

import { AccountColl, TransactionColl } from '@/models';
import { auth } from '@/auth';
import { Filter, ObjectId } from 'mongodb';
import { Account } from '@/models/Account';
import { revalidatePath } from 'next/cache';

export interface GetAccountsParams {
  pageSize?: number;
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getAccounts(params: GetAccountsParams = {}) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  const filters: Filter<Account> = {};
  if (params.search) {
    filters.description = { $regex: params.search };
  }
  filters.createdBy = new ObjectId(authUser.user.id);

  const sortField = params.sortField || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

  const accounts = await AccountColl.paginate(filters, page, pageSize, {
    [sortField]: sortOrder,
  });

  return accounts;
}

export async function getAccountById(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const account = await AccountColl.findById(id);
  if (!account) {
    throw new Error('Account not found');
  }
  return account;
}

export async function createAccount(data: Partial<Account>) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  if (!data.name) {
    throw new Error('Account name is required');
  }

  if (!data.type) {
    throw new Error('Account type is required');
  }

  const newAccount = await AccountColl.insert(
    {
      name: data.name,
      type: data.type,
      accountDetails: data.accountDetails || '',
      openingBalance: +(data.openingBalance || 0),
      currentBalance: +(data.openingBalance || 0),
      isActive: data.isActive ?? true,
    },
    authUser.user.id
  );

  revalidatePath('/accounts');
  return newAccount;
}

export async function updateAccount(id: string, data: Partial<Account>) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const updated = await AccountColl.updateById(id, data);
  revalidatePath('/accounts');
  revalidatePath(`/accounts/${id}`);
  return updated;
}

export async function deleteAccount(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  await AccountColl.deleteById(id);
  await TransactionColl.deleteByAccountId(id);
  revalidatePath('/accounts');
  return { message: 'Account deleted' };
}

