import { NextResponse } from 'next/server';
import { AccountColl, TransactionColl } from '@/models';
import { auth } from '@/auth';
import { Filter, ObjectId } from 'mongodb';
import { Transaction } from '@/models/Transaction';

export const GET = auth(async function (req) {
  if (!req.auth) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(req.url);

  // Pagination
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Filters
  const search = searchParams.get('search') || undefined; // Filter by investment type
  const filters: Filter<Transaction> = {};
  if (search) filters.description = { $regex: search };
  filters.createdBy = new ObjectId(req.auth.user?.id);

  // Sorting
  const sortField = searchParams.get('sortField') || 'createdAt'; // Default sorting field
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Sorting order

  const transactions = await TransactionColl.paginate(filters, page, pageSize, { [sortField]: sortOrder });
  return NextResponse.json(transactions);
});

export const POST = auth(async function (req) {
  if (!req.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const body = await req.json();
  const paymentMethod = await AccountColl.findById(body.paymentMethod);
  if (!paymentMethod) return NextResponse.json({ error: 'Invalid Payment Method' }, { status: 400 });
  body.paymentMethod = {
    _id: paymentMethod._id,
    name: paymentMethod.name,
    type: paymentMethod.type,
  };

  const newTransaction = await TransactionColl.insert(body, req.auth.user.id);
  if (newTransaction) {
    await AccountColl.updateBalance(paymentMethod._id, body.amount);
  }

  return NextResponse.json(newTransaction, { status: 201 });
});
