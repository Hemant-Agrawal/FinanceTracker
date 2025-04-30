import { NextResponse } from 'next/server';
import { UserColl } from '@/models';
import { auth } from '@/auth';

export const GET = async function () {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const user = await UserColl.findById(authUser.user.id);
  if (!user?.isInternalUser) {
    delete user?.isInternalUser;
  }
  return NextResponse.json(user);
};

export const PATCH = async function (req: Request) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();
  delete body?.isInternalUser;

  const userUpdated = await UserColl.updateById(authUser.user.id, body);
  if (!userUpdated) return NextResponse.json({ message: 'User not found' }, { status: 404 });
  return NextResponse.json(userUpdated);
};

// export const DELETE = auth(async function (req) {
//   if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

//   const user = await UserColl.deleteById(req.auth.user?.id!);
//   return NextResponse.json(user);
// });
