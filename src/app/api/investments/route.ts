import { NextResponse, NextRequest } from 'next/server';
import { InvestmentColl } from '@/models';
import { ObjectId, Filter } from 'mongodb';
import { Investment } from '@/models/Investment';
import { auth } from '@/auth';

export const GET = async function (req: NextRequest) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const { searchParams } = new URL(req.url);

  // Pagination
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Filters
  const search = searchParams.get('search') || ''; // Filter by investment type
  const filters: Filter<Investment> = {};
  if (search) filters.description = { $regex: search };
  filters.createdBy = new ObjectId(authUser.user.id);

  // Sorting
  const sortField = searchParams.get('sortField') || 'createdAt'; // Default sorting field
  const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1; // Sorting order

  const accounts = await InvestmentColl.paginate(filters, page, pageSize, { [sortField]: sortOrder });
  return NextResponse.json(accounts);
};

export const POST = async function (req: NextRequest) {
  const authUser = await auth();
  if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  const body = await req.json();

  const newAccount = await InvestmentColl.insert({ ...body, currentBalance: +body.openingBalance }, authUser.user.id);
  return NextResponse.json(newAccount, { status: 201 });
};
