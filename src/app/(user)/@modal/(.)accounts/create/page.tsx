import { AccountForm } from '@/components/accounts/account-form';
import Modal from '@/modal';

export default async function CreatePageModal() {
  return (
    <Modal title="Create Account" description="Add a new financial account to track your balance.">
      <AccountForm />
    </Modal>
  );
}
