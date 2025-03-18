import { UserColl } from '@/models';
import dayjs from 'dayjs';
import { google } from 'googleapis';

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

export async function getAccessToken(code: string) {
  const auth = await getGmailClient();
  const { tokens } = await auth.getToken(code);
  console.log('Your Refresh Token:', tokens, tokens.refresh_token);
  return tokens.refresh_token;
}

export async function checkForCASEmail(id: string) {
  const user = await UserColl.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  const auth = await getGmailClient();

  auth.setCredentials({ refresh_token: user.gmailToken });
  const gmail = google.gmail({ version: 'v1', auth });
  const startDate = dayjs().startOf('month').format('YYYY/MM/DD');

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${startDate} subject:transaction OR subject:UPI OR subject:debit`,
    maxResults: 1,
  });

  if (!res.data.messages) {
    console.log('❌ No new CAS emails found.');
    return;
  }

  for (const msg of res.data.messages) {
    const res = await gmail.users.messages.get({ userId: 'me', id: msg.id! });
    console.log('✅ Email Found! Subject:', startDate, msg.id, res.data.payload?.parts);

    // await EmailRecordsColl.insert({
    //   userId: user._id,
    //   email: email.data.payload.headers.find((h) => h.name === 'From')?.value,
    //   subject: email.data.payload.headers.find((h) => h.name === 'Subject')?.value,
    //   body: email.data.payload.body.data,
    //   attachments: email.data.payload.parts.map((p) => p.body.data),
    // });
  }
}
