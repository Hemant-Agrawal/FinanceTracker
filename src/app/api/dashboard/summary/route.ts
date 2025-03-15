import { auth } from '@/auth';
import { getPeriod } from '@/lib/utils';
import { AccountColl, TransactionColl } from '@/models';
import dayjs, { ManipulateType } from 'dayjs';
import { NextResponse } from 'next/server';

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const { dateUnit, dateValue } = getPeriod(searchParams.get('period') || '7days');
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

  return NextResponse.json({
    totalBalance: currentBalance,
    totalIncome: currentTotalIncome,
    totalExpenses: currentTotalExpenses,
    netSavings: currentTotalIncome + currentTotalExpenses,
    balanceChange: ((currentBalance - previousBalance) / (previousBalance || 1)) * 100,
    incomeChange: ((currentTotalIncome - previousTotalIncome) / (previousTotalIncome || 1)) * 100,
    expensesChange: ((currentTotalExpenses - previousTotalExpenses) / (previousTotalExpenses || 1)) * 100,
    savingsChange: ((currentTotalIncome + currentTotalExpenses) / (previousTotalIncome + previousTotalExpenses || 1)) * 100,
  });
};
