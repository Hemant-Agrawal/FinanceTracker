import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { EmailRecordColl, TransactionColl } from '@/models';
import { Filter, ObjectId } from 'mongodb';
import { Transaction } from '@/models/Transaction';

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  console.log('🔍 Reviewing transactions');
  const filter: Filter<Transaction> = {
    createdBy: new ObjectId(authUser.user.id),
    status: 'pending',
  };
  const transactions = await TransactionColl.list(filter, 100, 0, { date: -1 });
  const emailRecords = await EmailRecordColl.list({
    createdBy: new ObjectId(authUser.user.id),
    _id: { $in: transactions.map(t => new ObjectId(t.referenceId)) },
  }, 100, 0, { date: -1 });

  return NextResponse.json({ transactions, emailRecords }, { status: 200 });
};
