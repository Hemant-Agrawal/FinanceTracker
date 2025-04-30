import { UserColl } from '@/models';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();

  console.log('Received access token webhook:', body);
  if (body.message_type !== 'access_token') {
    return NextResponse.json({ success: false, error: 'Invalid event' }, { status: 400 });
  }

  const user = await UserColl.getUserByUpstokClientId(body.client_id);
  if (!user) {
    return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
  }

  await UserColl.updateOne(
    { _id: user._id },
    {
      $set: {
        'upstok.accessToken': body.access_token,
        'upstok.user_id': body.user_id,
        'upstok.issued_at': body.issued_at,
        'upstok.expiresAt': body.expires_at,
      },
    }
  );

  // You would typically securely store this token

  return NextResponse.json({ success: true });
}
