import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log('Received access token webhook:', body);

  // You would typically securely store this token

  return NextResponse.json({ success: true });
}
