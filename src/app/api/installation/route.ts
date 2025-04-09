import { getAuthUrl } from "@/ai/gmail/client";
import { NextResponse } from "next/server";

export const GET = async function () {
  const authUrl = await getAuthUrl();
  return NextResponse.redirect(authUrl);
};
