import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { TransactionColl } from '@/models';
import { getPeriod } from '@/lib/utils';
import dayjs from 'dayjs';

const format: Record<string, string> = {
  month: 'MMM',
  day: 'DD',
  week: 'ddd',
  year: 'YYYY',
  hour: 'HH',
};

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { searchParams } = new URL(req.url);
  const { dateUnit, dateValue } = getPeriod(searchParams.get('period') || '7days');

  const data = [];
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

  return NextResponse.json(data);
};
