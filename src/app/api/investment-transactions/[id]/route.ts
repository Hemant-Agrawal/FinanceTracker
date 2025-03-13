import { NextResponse } from 'next/server';
import { InvestmentTransactionColl } from '@/models';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const transaction = await InvestmentTransactionColl.findById(params.id);
  return transaction ? NextResponse.json(transaction) : NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await InvestmentTransactionColl.updateById(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await InvestmentTransactionColl.deleteById(params.id);
  return NextResponse.json({ message: 'Investment transaction deleted' });
}
