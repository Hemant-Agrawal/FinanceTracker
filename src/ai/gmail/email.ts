import { EmailRecordColl, UserColl } from '@/models';
import { EmailAttachment } from '@/models/EmailRecord';
import dayjs from 'dayjs';
import { gmail_v1, google } from 'googleapis';
// import { parseTransactionEmail } from './parser';
// import { JSDOM } from 'jsdom';

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

export const authUrl = await getAuthUrl();

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
  const startDate = dayjs().subtract(10, 'year').startOf('month').format('YYYY/MM/DD');
  console.log('🔍 Searching for emails after:', startDate);

  const res = await gmail.users.messages.list({
    userId: 'me',
    q: `after:${startDate} subject:transaction OR subject:UPI OR subject:debit`,
    maxResults: 500,
  });

  if (!res.data.messages) {
    console.log('❌ No new CAS emails found.');
    return;
  }

  for (const msg of res.data.messages) {
    const exists = await EmailRecordColl.exists({ messageId: msg.id! });
    if (exists) {
      console.log('❌ Email already exists.');
      continue;
    }
    console.log('🔍 Processing email:', msg.id!);
    const details = await getEmailDetails(msg.id!, gmail);
    const attachments: EmailAttachment[] = [];
    if (details.attachments.length > 0) {
      for (const attachment of details.attachments) {
        const attachmentId = await EmailRecordColl.insertAttachment(attachment);
        attachments.push({
          _id: attachmentId,
          filename: attachment.filename,
          mimeType: attachment.mimeType,
          size: attachment.size,
        });
      }
    }
    await EmailRecordColl.insert({
      userId: user._id,
      messageId: msg.id!,
      from: details.from!,
      subject: details.subject!,
      body: details.body,
      format: details.format,
      to: details.to!,
      attachments,
      status: 'pending',
      date: new Date(details.date!),
    }, user._id);
    console.log('✅ Email processed:', msg.id!, 'with subject:', details.subject!);
  }
}

async function getEmailDetails(messageId: string, gmail: gmail_v1.Gmail) {
  const response = await gmail.users.messages.get({
    userId: 'me',
    id: messageId,
  });

  const payload = response.data.payload;
  const headers = payload?.headers;
  const subject = headers?.find(header => header.name === 'Subject')?.value;
  const from = headers?.find(header => header.name === 'From')?.value;
  const date = headers?.find(header => header.name === 'Date')?.value;
  const to = headers?.find(header => header.name === 'To')?.value;

  let body = '';
  let format = 'text';
  const attachments: { filename: string; mimeType: string; data: string; size: number }[] = [];

  // Extract body
  if (payload?.parts) {
    const htmlPart = payload.parts.find(p => p.mimeType === 'text/html');
    const textPart = payload.parts.find(p => p.mimeType === 'text/plain');

    if (htmlPart) {
      const html = Buffer.from(htmlPart.body?.data || '', 'base64').toString('utf-8');
      // const dom = new JSDOM(html);
      // body = dom.window.document.body.textContent?.trim() || '';
      body = html;
      format = 'html';
    } else if (textPart) {
      body = Buffer.from(textPart.body?.data || '', 'base64').toString('utf-8');
    }
  } else if (payload?.body?.data) {
    body = Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  // Extract attachments
  const parts = payload?.parts || [];
  for (const part of parts) {
    if (part.filename && part.body && part.body.attachmentId) {
      const attachmentResponse = await gmail.users.messages.attachments.get({
        userId: 'me',
        messageId,
        id: part.body.attachmentId,
      });

      attachments.push({
        filename: part.filename,
        mimeType: part.mimeType!,
        data: attachmentResponse.data.data!,
        size: attachmentResponse.data.size!,
      });
    }
  }

  return { subject, from, date, to, body, attachments, format };
}
