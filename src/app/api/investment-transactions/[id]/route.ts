import { NextResponse } from 'next/server';
import { InvestmentTransactionColl } from '@/models';
import { auth } from '@/auth';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const transaction = await InvestmentTransactionColl.findById(id);
  return transaction ? NextResponse.json(transaction) : NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();
  const { id } = await params;
  const updated = await InvestmentTransactionColl.updateById(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  await InvestmentTransactionColl.deleteById(id);
  return NextResponse.json({ message: 'Investment transaction deleted' });
}
