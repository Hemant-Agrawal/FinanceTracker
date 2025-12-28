import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileForm } from '@/components/settings/profile-form';
import ProfilePictureForm from '@/components/settings/profile-picture-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getUser } from '@/lib/actions';
import { Camera } from 'lucide-react';
import UserAvatar from '@/components/common/user-avatar';
import { User } from '@/models/User';
import Integration from '@/components/settings/integration';

export default async function SettingsPage() {
  const user = await getUser();

  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row gap-8">
        <div className="flex flex-col gap-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>Update your profile picture</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <UserAvatar user={user} size={40}>
                <ProfilePictureForm user={user}>
                  <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Camera className="text-white h-8 w-8 cursor-pointer" />
                  </div>
                </ProfilePictureForm>
              </UserAvatar>
              <h2 className="text-lg font-semibold">{user.name}</h2>
              <h4 className="text-sm text-muted-foreground">{user.email}</h4>
            </CardContent>
          </Card>
          <Integration user={user} />
        </div>
        <div className="grow">
          <Card>
            <CardHeader>
              <CardTitle>Profile Details</CardTitle>
              <CardDescription>Manage your profile details.</CardDescription>
            </CardHeader>
            <CardContent>
              <ProfileForm user={user} />
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
