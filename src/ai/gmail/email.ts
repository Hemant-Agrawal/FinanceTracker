import { google } from 'googleapis';

async function authenticate(token: string) {
    const auth = new google.auth.OAuth2(
        process.env.GOOGLE_CLIENT_ID,
        process.env.GOOGLE_CLIENT_SECRET,
        process.env.NEXT_PUBLIC_BASE_URL
    );

    auth.setCredentials({ refresh_token: token });
    return auth;
}

export async function checkForCASEmail(token: string) {
    const auth = await authenticate(token);
    const gmail = google.gmail({ version: 'v1', auth });

    const res = await gmail.users.messages.list({
        userId: 'me',
        q:'from:(alerts@hdfcbank.net) OR subject:transaction OR subject:UPI OR subject:debit',
    });

    if (!res.data.messages) {
        console.log('❌ No new CAS emails found.');
        return;
    }

    for (const msg of res.data.messages) {
        // @ts-expect-error - gmail api types are not updated
        const email = await gmail.users.messages.get({ userId: 'me', id: msg.id });
        // @ts-expect-error - gmail api types are not updated
        console.log('✅ CAS Email Found! Subject:', email.data.payload?.headers?.find(h => h.name === 'Subject')?.value);
    }
}