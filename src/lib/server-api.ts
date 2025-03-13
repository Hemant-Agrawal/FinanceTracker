'use server';
import { headers } from 'next/headers';

import { Account } from '@/models/Account';
import { PaginatedResult } from '@/models/BaseModel';
import { Investment } from '@/models/Investment';
import { Transaction } from '@/models/Transaction';
import { WithId } from 'mongodb';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export async function apiRequest(endpoint: string, method = 'GET', data: any = {}) {
  const url = new URL(`${BASE_URL}/api${endpoint}`);
  if (method === 'GET' && data) {
    Object.keys(data).forEach(key => url.searchParams.append(key, String(data[key])));
  }
  const options: RequestInit = {
    method,
    headers: await headers(),
    body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
  };
  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    return null;
  }
  return res.json();
}

export async function getRequest(endpoint: string, params?: Record<string, any>) {
  return apiRequest(endpoint, 'GET', params);
}

export async function postRequest(endpoint: string, data: any) {
  return apiRequest(endpoint, 'POST', data);
}

export async function deleteRequest(endpoint: string) {
  return apiRequest(endpoint, 'DELETE');
}

export async function patchRequest(endpoint: string, data: any) {
  return apiRequest(endpoint, 'PATCH', data);
}

export async function fetchAccounts(params: Record<string, any>): Promise<PaginatedResult<WithId<Account>>> {
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

export async function fetchTransactions(params: Record<string, any>): Promise<PaginatedResult<WithId<Transaction>>> {
  return getRequest('/transactions', params);
}

export async function fetchInvestments(params: Record<string, any>): Promise<PaginatedResult<WithId<Investment>>> {
  return getRequest('/investments', params);
}
