'use server';

import { auth } from '@/auth';
import { getPeriod } from '@/lib/utils';
import { AccountColl, TransactionColl } from '@/models';
import dayjs, { ManipulateType } from 'dayjs';

export interface DashboardSummary {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  balanceChange: number;
  incomeChange: number;
  expensesChange: number;
  savingsChange: number;
}

export async function getDashboardSummary(period = '7days'): Promise<DashboardSummary> {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const { dateUnit, dateValue } = getPeriod(period);
  const specificTime = dayjs()
    .subtract(dateValue, dateUnit as ManipulateType)
    .toDate();

  const previousBalance = await AccountColl.getTotalBalance({ updatedAt: { $lt: specificTime } }, authUser.user.id);
  const previousTotalIncome = await TransactionColl.getTotalIncome({ date: { $lt: specificTime } }, authUser.user.id);
  const previousTotalExpenses = await TransactionColl.getTotalExpenses(
    { date: { $lt: specificTime } },
    authUser.user.id
  );

  const currentBalance = await AccountColl.getTotalBalance({}, authUser.user.id);
  const currentTotalIncome = await TransactionColl.getTotalIncome({}, authUser.user.id);
  const currentTotalExpenses = await TransactionColl.getTotalExpenses({}, authUser.user.id);

  return {
    totalBalance: currentBalance,
    totalIncome: currentTotalIncome,
    totalExpenses: currentTotalExpenses,
    netSavings: currentTotalIncome + currentTotalExpenses,
    balanceChange: ((currentBalance - previousBalance) / (previousBalance || 1)) * 100,
    incomeChange: ((currentTotalIncome - previousTotalIncome) / (previousTotalIncome || 1)) * 100,
    expensesChange: ((currentTotalExpenses - previousTotalExpenses) / (previousTotalExpenses || 1)) * 100,
    savingsChange: ((currentTotalIncome + currentTotalExpenses) / (previousTotalIncome + previousTotalExpenses || 1)) * 100,
  };
}

export interface DashboardComparisonData {
  key: string;
  income: number;
  expenses: number;
}

export async function getDashboardComparison(period = '7days'): Promise<DashboardComparisonData[]> {
  const authUser = await auth();
  if (!authUser?.user?.id) {
    throw new Error('Not authenticated');
  }

  const { dateUnit, dateValue } = getPeriod(period);

  const format: Record<string, string> = {
    month: 'MMM',
    day: 'DD',
    week: 'ddd',
    year: 'YYYY',
    hour: 'HH',
  };

  const data: DashboardComparisonData[] = [];
  for (let i = Math.max(dateValue - 1, 1); i >= 0; i--) {
    const date = dayjs().subtract(i, dateUnit).startOf(dateUnit);
    const income = await TransactionColl.getTotalIncome(
      { date: { $gte: date.toDate(), $lte: date.add(1, dateUnit).toDate() } },
      authUser.user.id
    );
    const expenses = await TransactionColl.getTotalExpenses(
      { date: { $gte: date.toDate(), $lte: date.add(1, dateUnit).toDate() } },
      authUser.user.id
    );
    data.push({ key: dayjs(date).format(format[dateUnit]), income, expenses: Math.abs(expenses) });
  }

  return data;
}

