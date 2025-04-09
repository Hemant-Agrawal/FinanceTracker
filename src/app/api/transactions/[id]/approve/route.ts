import { auth } from "@/auth";
import { TransactionColl } from "@/models";

import { AccountColl } from "@/models";
import { NextResponse } from "next/server";

export const POST = async function (req: Request, { params }: { params: Promise<{ id: string }> }) {
    const authUser = await auth();
    if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
    const { id } = await params;
    const transaction = await TransactionColl.findById(id);
    if (!transaction) return NextResponse.json({ message: 'Transaction not found' }, { status: 404 });
    const updated = await TransactionColl.updateById(id, { status: 'approved' });
    if (updated) {
      await AccountColl.updateBalance(transaction.paymentMethod._id, transaction.amount);
    } else {
      return NextResponse.json({ message: 'Failed to approve transaction' }, { status: 500 });
    }
  
    return NextResponse.json(updated, { status: 200 });
  };
