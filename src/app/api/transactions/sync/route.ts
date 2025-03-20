import { checkForCASEmail } from "@/ai/gmail/email";
// import { auth } from "@/auth";
import { NextResponse } from "next/server";

export const GET = async function (req: Request) {
  // const authUser = await auth();
  // if (!authUser?.user?.id) return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });

  const email = await checkForCASEmail('67cd9192570a97b7aebdad40');

  return NextResponse.json({ message: 'Synced' }, { status: 200 });
};