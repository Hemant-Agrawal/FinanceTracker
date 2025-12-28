import { AccountForm } from '@/components/accounts/account-form';
import { getAccountById } from '@/lib/actions';
import { notFound } from 'next/navigation';
import Modal from '@/modal';

export default async function EditPageModal({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const account = await getAccountById(id);

  if (!account) {
    notFound();
  }
  return (
    <Modal title="Edit Account" description="Make changes to your account here. Click save when you're done.">
      <AccountForm account={account} />
    </Modal>
  );
}
