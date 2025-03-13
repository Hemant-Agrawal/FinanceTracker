import { auth } from '@/auth';
import { TransactionColl } from '@/models';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = async function () {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const filter = { createdBy: new ObjectId(authUser.user.id) };
  const transactions = await TransactionColl.list(filter, 5, 0, { createdAt: -1 });
  return NextResponse.json(transactions);
};
