import { checkForCASEmail } from '@/ai/gmail/email';
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  checkForCASEmail(authUser.user.id).catch(err => {
    console.error(err);
    return NextResponse.json({ message: 'Error syncing emails' }, { status: 400 });
  });

  return NextResponse.json({ message: 'Synced' }, { status: 200 });
};