import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log('Received order update webhook:', body);

  // You can process and store order update here

  return NextResponse.json({ success: true });
}
