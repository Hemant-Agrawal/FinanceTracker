import { google } from 'googleapis';

const auth = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.NEXT_PUBLIC_BASE_URL
);
export async function getAuthUrl() {
  const authUrl = auth.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/gmail.readonly'],
  });
  console.log('🔗 Authorize this app by visiting this URL:', authUrl);
  return authUrl;
}

export async function getAccessToken(code: string) {
  const { tokens } = await auth.getToken(code);
  console.log('Your Refresh Token:', tokens.refresh_token);
  return tokens.refresh_token;
}
