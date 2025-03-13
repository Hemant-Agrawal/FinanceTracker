import { auth } from '@/auth';
import { TransactionColl } from '@/models';
import { ObjectId } from 'mongodb';
import { NextResponse } from 'next/server';

export const GET = auth(async function ({ auth }) {
  if (!auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const filter = { createdBy: new ObjectId(auth.user?.id) };
  const transactions = await TransactionColl.list(filter, 5, 0, { createdAt: -1 });
  return NextResponse.json(transactions);
});
