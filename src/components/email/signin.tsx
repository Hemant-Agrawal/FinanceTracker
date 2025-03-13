import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface MagicLinkEmailProps {
  magicLink: string;
  name?: string;
  isNewUser?: boolean;
}

export const MagicLinkEmail = ({ magicLink, name = '', isNewUser = false }: MagicLinkEmailProps) => {
  const previewText = isNewUser ? 'Welcome to Budget App! Verify your email to get started' : 'Sign in to Budget App';

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-gray-100 font-sans">
          <Container className="mx-auto my-10 max-w-[500px] rounded bg-white p-10">
            <Heading className="text-center text-xl font-bold text-gray-900">
              {isNewUser ? 'Welcome to Budget App!' : 'Sign in to Budget App'}
            </Heading>

            {isNewUser ? (
              <Text className="text-gray-600">
                Hi {name}, thanks for creating an account with Budget App. Click the button below to verify your email
                address and get started.
              </Text>
            ) : (
              <Text className="text-gray-600">
                Click the button below to sign in to your account. This link will expire in 10 minutes.
              </Text>
            )}

            <Section className="text-center">
              <Button
                className="rounded bg-primary px-6 py-3 text-center text-sm font-medium text-white"
                href={magicLink}
              >
                {isNewUser ? 'Verify Email & Sign In' : 'Sign In'}
              </Button>
            </Section>

            <Text className="text-sm text-gray-500">If you didn&apos;t request this email, you can safely ignore it.</Text>

            <Hr className="my-6 border-gray-300" />

            <Text className="text-xs text-gray-500">
              If the button above doesn&apos;t work, copy and paste this URL into your browser:
            </Text>
            <Link href={magicLink} className="block break-all text-xs text-blue-600">
              {magicLink}
            </Link>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

export default MagicLinkEmail;
