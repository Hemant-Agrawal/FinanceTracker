import { UserColl } from '@/models';
import { User } from '@/models/User';
import { NextRequest, NextResponse } from 'next/server';
import { upstoxClient } from '@/ai';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state'); // optional, depends on your auth

  if (!code || !state) {
    return NextResponse.json({ error: 'Authorization code missing' }, { status: 400 });
  }

  try {
    // Now you would typically exchange this code for an access token
    const upstokAccessToken = await upstoxClient.getAccessToken(code);
    console.log('accessToken', upstokAccessToken);
    await UserColl.updateById(state, { upstok: upstokAccessToken as User['upstok'] });
    console.log('Received code:', code, state);

    // Redirect user to dashboard or success page
    return NextResponse.redirect(new URL('/dashboard', req.url));
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to exchange code for access token' }, { status: 500 });
  }
}
