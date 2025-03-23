import { google } from "googleapis";

export async function getGmailClient() {
    return new google.auth.OAuth2(
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
      process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI
    );
  }
  
  export async function getAuthUrl() {
    const auth = await getGmailClient();
    const authUrl = auth.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/gmail.readonly'],
    });
    console.log('🔗 Authorize this app by visiting this URL:', authUrl);
    return authUrl;
  }