import { NextResponse } from 'next/server';
import { UserColl } from '@/models';
import { auth } from '@/auth';

export const GET = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const user = await UserColl.findById(req.auth.user?.id!);
  return NextResponse.json(user);
});

export const PATCH = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();

  const user = await UserColl.updateById(req.auth.user?.id!, body);
  return NextResponse.json(user);
});

// export const DELETE = auth(async function (req) {
//   if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

//   const user = await UserColl.deleteById(req.auth.user?.id!);
//   return NextResponse.json(user);
// });
