import { auth } from '@/auth';
import { UserColl } from '@/models';
import { NextResponse } from 'next/server';

export const GET = auth(async function (req) {
  if (!req?.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  //   const body = await req.json();
  const { searchParams } = new URL(req.url);

  console.log(req.auth, Object.fromEntries(searchParams.entries()));
  const user = await UserColl.updateById(req.auth.user.id, { gmailToken: searchParams.get('code') as string });
  return NextResponse.json(user);
});
