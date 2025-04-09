'use server';
import { headers } from 'next/headers';
import { WithId } from 'mongodb';

import { Account } from '@/models/Account';
import { PaginatedResult } from '@/models/BaseModel';
import { Investment } from '@/models/Investment';
import { Transaction } from '@/models/Transaction';
import { EmailRecord } from '@/models/EmailRecord';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export async function apiRequest(endpoint: string, method = 'GET', data: Record<string, unknown> = {}) {
  const url = new URL(`${BASE_URL}/api${endpoint}`);
  if (method === 'GET' && data) {
    Object.keys(data).forEach(key => url.searchParams.append(key, String(data[key])));
  }
  const headersList = await headers();
  const options: RequestInit = {
    method,
    headers: new Headers(headersList),
    body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
  };
  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getRequest<T>(endpoint: string, params = {}): Promise<T> {
  return apiRequest(endpoint, 'GET', params);
}

// export async function postRequest(endpoint: string, data = {}) {
//   return apiRequest(endpoint, 'POST', data);
// }

// export async function deleteRequest(endpoint: string) {
//   return apiRequest(endpoint, 'DELETE');
// }

// export async function patchRequest(endpoint: string, data = {}) {
//   return apiRequest(endpoint, 'PATCH', data);
// }

export async function fetchAccounts(params = {}): Promise<PaginatedResult<WithId<Account>>> {
  return getRequest('/accounts', params);
}

export async function getAccountById(id: string): Promise<WithId<Account> | null> {
  return getRequest(`/accounts/${id}`);
}

export async function getTransactionById(id: string): Promise<WithId<Transaction> | null> {
  return getRequest(`/transactions/${id}`);
}

export async function fetchRecentTransactions(): Promise<WithId<Transaction>[]> {
  return getRequest('/recent-transactions');
}

export async function fetchTransactions(params = {}): Promise<PaginatedResult<WithId<Transaction>>> {
  return getRequest('/transactions', params);
}

export async function fetchInvestments(params = {}): Promise<PaginatedResult<WithId<Investment>>> {
  return getRequest('/investments', params);
}

export async function fetchTransactionsForReview(
  params = {}
): Promise<{ transactions: WithId<Transaction>[]; emailRecords: WithId<EmailRecord>[] }> {
  return getRequest('/transactions/review', params);
}
