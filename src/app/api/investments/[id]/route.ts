import { NextResponse } from 'next/server';
import { InvestmentColl } from '@/models';
import { auth } from '@/auth';
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const investment = await InvestmentColl.findById(id);
  return investment ? NextResponse.json(investment) : NextResponse.json({ message: 'Not Found' }, { status: 404 });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  const body = await req.json();
  const updated = await InvestmentColl.updateById(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await auth();
  if (!user) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { id } = await params;
  await InvestmentColl.deleteById(id);
  return NextResponse.json({ message: 'Investment deleted' });
}
