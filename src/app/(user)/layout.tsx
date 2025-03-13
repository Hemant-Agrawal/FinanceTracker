import { auth } from '@/auth';
import { redirect } from 'next/navigation';
export default async function AuthLayout({ children, modal }: { children: React.ReactNode; modal: React.ReactNode }) {
  const user = await auth();
  if (!user) {
    redirect('/auth/signin');
  }
  return (
    <>
      {modal}
      {children}
    </>
  );
}
