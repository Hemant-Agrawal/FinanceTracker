import { getAuthUrl } from "@/ai/gmail/client";
import { upstoxClient } from "@/ai";
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export const GET = async function (req: NextRequest) {  
  const authUser = await auth();
  if (!authUser?.user?.id) {
    return NextResponse.redirect(new URL('/api/auth/signin', req.url));
  }
  const type = req.nextUrl.searchParams.get('type');
  let authUrl = '';
  if (type === 'gmail') {
    authUrl = await getAuthUrl();
  } else if (type === 'upstok') {
    authUrl = await upstoxClient.getAuthUrl(authUser.user.id);
  }
  return NextResponse.redirect(authUrl);
};
