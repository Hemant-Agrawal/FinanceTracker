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

  const user = await UserColl.updateById(authUser.user.id, { gmail: { refreshToken, syncEnabled: true } });
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.redirect(`${process.env.NEXT_PUBLIC_BASE_URL}/settings`);
};
