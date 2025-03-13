import { NextResponse } from 'next/server';
import { AccountColl } from '@/models';
import { auth } from '@/auth';
import { Filter, ObjectId } from 'mongodb';
import { Account } from '@/models/Account';

export const GET = auth(async function (req) {
  if (!req.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(req.url);

  // Pagination
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Filters
  const search = searchParams.get('search') || ''; // Filter by investment type
  const filters: Filter<Account> = {};
  if (search) filters.description = { $regex: search };
  filters.createdBy = new ObjectId(req.auth.user?.id);

  // Sorting
  const sortField = searchParams.get('sortField') || 'createdAt'; // Default sorting field
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Sorting order

  const accounts = await AccountColl.paginate(filters, page, pageSize, { [sortField]: sortOrder });
  return NextResponse.json(accounts);
});

export const POST = auth(async function (req) {
  if (!req.auth?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();

  const newAccount = await AccountColl.insert({ ...body, currentBalance: +body.openingBalance }, req.auth.user.id);
  return NextResponse.json(newAccount, { status: 201 });
});
