import { NextResponse } from 'next/server';
import { InvestmentColl } from '@/models';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const investment = await InvestmentColl.findById(params.id);
  return investment ? NextResponse.json(investment) : NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json();
  const updated = await InvestmentColl.updateById(params.id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await InvestmentColl.deleteById(params.id);
  return NextResponse.json({ message: 'Investment deleted' });
}
