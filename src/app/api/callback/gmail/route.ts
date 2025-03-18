import { auth } from '@/auth';
import { UserColl } from '@/models';
import { NextResponse } from 'next/server';
import { getAccessToken } from '@/ai/gmail/email';

export const GET = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  //   const body = await req.json();
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code') as string;
  const refreshToken = await getAccessToken(code);
  if (!refreshToken) return NextResponse.json({ message: 'No refresh token' }, { status: 400 });

  const user = await UserColl.updateById(authUser.user.id, { gmailToken: refreshToken });
  return NextResponse.json(user);
};
