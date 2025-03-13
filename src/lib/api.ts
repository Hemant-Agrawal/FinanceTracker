import { Transaction } from '@/models/Transaction';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

export async function apiRequest(endpoint: string, method = 'GET', data: any = {}) {
  const url = new URL(`${BASE_URL}/api${endpoint}`);
  if (method === 'GET' && data) {
    Object.keys(data).forEach(key => url.searchParams.append(key, String(data[key])));
  }
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: method !== 'GET' && data ? JSON.stringify(data) : undefined,
  };
  const res = await fetch(url.toString(), options);
  if (!res.ok) {
    throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function getRequest(endpoint: string, params?: Record<string, any>) {
  return apiRequest(endpoint, 'GET', params);
}

export async function postRequest(endpoint: string, data: any) {
  return apiRequest(endpoint, 'POST', data);
}

export async function deleteRequest(endpoint: string, id: string) {
  return apiRequest(endpoint, 'DELETE');
}

export async function patchRequest(endpoint: string, data: any) {
  return apiRequest(endpoint, 'PATCH', data);
}

export async function createTransaction(data: Partial<Transaction>) {
  return postRequest('/transactions', data);
}

export async function updateTransaction(id: string, data: Partial<Transaction>) {
  return patchRequest(`/transactions/${id}`, data);
}
