import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileForm } from '@/components/settings/profile-form';

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Profile" text="Manage your profile details" />
      <ProfileForm />
    </DashboardShell>
  );
}
