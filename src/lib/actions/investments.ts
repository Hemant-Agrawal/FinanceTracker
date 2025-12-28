'use server';

import { InvestmentColl } from '@/models';
import { ObjectId, Filter } from 'mongodb';
import { Investment } from '@/models/Investment';
import { auth } from '@/auth';
import { revalidatePath } from 'next/cache';

export interface GetInvestmentsParams {
  pageSize?: number;
  page?: number;
  search?: string;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export async function getInvestments(params: GetInvestmentsParams = {}) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const pageSize = params.pageSize || 10;
  const page = params.page || 1;

  const filters: Filter<Investment> = {};
  if (params.search) {
    filters.description = { $regex: params.search };
  }
  filters.createdBy = new ObjectId(authUser.user.id);

  const sortField = params.sortField || 'createdAt';
  const sortOrder = params.sortOrder === 'asc' ? 1 : -1;

  const investments = await InvestmentColl.paginate(filters, page, pageSize, {
    [sortField]: sortOrder,
  });

  return investments;
}

export async function getInvestmentById(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }
  const investment = await InvestmentColl.findById(id);
  if (!investment) {
    throw new Error('Investment not found');
  }
  return investment;
}

export async function createInvestment(data: Partial<Investment>) {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  if (!data.name || !data.type) {
    throw new Error('Investment name and type are required');
  }

  const newInvestment = await InvestmentColl.insert(
    {
      name: data.name,
      type: data.type,
      details: data.details || '',
      units: data.units || 0,
      buyPrice: data.buyPrice || 0,
      currentPrice: data.currentPrice || data.buyPrice || 0,
      currentValue: (data.currentPrice || data.buyPrice || 0) * (data.units || 0),
      profitLoss: 0,
      profitLossPercentage: 0,
      status: data.status || 'Active',
      notes: data.notes || '',
    },
    authUser.user.id
  );

  revalidatePath('/investments');
  return newInvestment;
}

export async function updateInvestment(id: string, data: Partial<Investment>) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  const updated = await InvestmentColl.updateById(id, data);
  revalidatePath('/investments');
  revalidatePath(`/investments/${id}`);
  return updated;
}

export async function deleteInvestment(id: string) {
  const user = await auth();
  if (!user) {
    throw new Error('Not authenticated');
  }

  await InvestmentColl.deleteById(id);
  revalidatePath('/investments');
  return { message: 'Investment deleted' };
}

