import { NextResponse } from 'next/server';
import { UserColl } from '@/models';
import { auth } from '@/auth';

export const GET = async function () {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const user = await UserColl.findById(authUser.user.id);
  return NextResponse.json(user);
};

export const PATCH = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();

  const user = await UserColl.updateById(authUser.user.id, body);
  return NextResponse.json(user);
};

// export const DELETE = auth(async function (req) {
//   if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

//   const user = await UserColl.deleteById(req.auth.user?.id!);
//   return NextResponse.json(user);
// });
