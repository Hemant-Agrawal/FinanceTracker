import { NextResponse } from 'next/server';
import { InvestmentTransactionColl } from '@/models';
import { auth } from '@/auth';

export const GET = auth(async function (req) {
  if (!req.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const { searchParams } = new URL(req.url);

  // Pagination
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Filters
  const type = searchParams.get('type') || undefined; // Filter by investment type
  const filters: any = {};
  if (type) filters.type = type;

  // Sorting
  const sortField = searchParams.get('sortField') || 'createdAt'; // Default sorting field
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Sorting order

  const transactions = await InvestmentTransactionColl.list(filters, pageSize, (page - 1) * pageSize, {
    [sortField]: sortOrder,
  });
  return NextResponse.json(transactions);
});

export const POST = auth(async function (req) {
  if (!req.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();
  const newTransaction = await InvestmentTransactionColl.insert(body, req.auth.user.id);
  return NextResponse.json(newTransaction, { status: 201 });
});
