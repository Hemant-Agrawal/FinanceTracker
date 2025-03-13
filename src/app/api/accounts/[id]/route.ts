import { NextResponse, NextRequest } from 'next/server';
import { AccountColl, TransactionColl } from '@/models';
import { auth } from '@/auth';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const account = await AccountColl.findById(id);
  return account ? NextResponse.json(account) : NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await AccountColl.updateById(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  await AccountColl.deleteById(id);
  await TransactionColl.deleteByAccountId(id);
  return NextResponse.json({ message: 'Account deleted' });
}
