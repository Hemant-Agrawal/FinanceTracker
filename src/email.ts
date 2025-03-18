import { createTransport } from 'nodemailer';
import { MagicLinkEmail } from './components/email/signin';
import { render } from '@react-email/components';
import { NodemailerConfig } from 'next-auth/providers/nodemailer';

export async function sendVerificationRequest(params: { identifier: string; url: string; provider: NodemailerConfig }) {
  const { identifier, url, provider } = params;
  const transport = createTransport(provider.server);
  const emailHtml = await render(MagicLinkEmail({ magicLink: url }));

  const result = await transport.sendMail({
    to: identifier,
    from: provider.from,
    subject: `Sign in to Finance Tracker`,
    text: text({ url }),
    html: emailHtml,
  });
  const failed = result.rejected.filter(Boolean);
  if (failed.length) {
    throw new Error(`Email(s) (${failed.join(', ')}) could not be sent`);
  }
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url }: { url: string }) {
  return `Sign in to Finance Tracker\n${url}\n\n`;
}
