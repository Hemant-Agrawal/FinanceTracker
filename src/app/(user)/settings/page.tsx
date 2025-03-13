import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { SettingsForm } from '@/components/settings/settings-form';

export default async function SettingsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Settings" text="Manage your application preferences" />
      <SettingsForm />
    </DashboardShell>
  );
}
