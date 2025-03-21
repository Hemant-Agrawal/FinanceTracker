import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { EmailRecordColl } from '@/models';
import { Filter, ObjectId } from 'mongodb';
import { EmailRecord } from '@/models/EmailRecord';
export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  console.log('🔍 Reviewing transactions');
  const filter: Filter<EmailRecord> = {
    userId: new ObjectId(authUser.user.id),
    status: 'pending',
  };
  const emailRecords = await EmailRecordColl.list(filter, 100, 0, { date: -1 });

  return NextResponse.json(emailRecords, { status: 200 });
};
