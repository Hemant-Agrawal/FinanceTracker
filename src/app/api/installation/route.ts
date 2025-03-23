import { getAuthUrl } from "@/ai/gmail/client";
import { NextResponse } from "next/server";

export const GET = async function (req: Request) {
  const authUrl = await getAuthUrl();
  return NextResponse.redirect(authUrl);
};
