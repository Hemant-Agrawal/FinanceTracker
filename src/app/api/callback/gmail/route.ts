import { auth } from '@/auth';
import { UserColl } from '@/models';
import { NextResponse } from 'next/server';

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  //   const body = await req.json();
  const { searchParams } = new URL(req.url);

  console.log(authUser, Object.fromEntries(searchParams.entries()));
  const user = await UserColl.updateById(authUser.user.id, { gmailToken: searchParams.get('code') as string });
  return NextResponse.json(user);
};
