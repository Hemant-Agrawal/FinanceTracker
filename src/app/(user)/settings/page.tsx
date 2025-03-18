import { DashboardShell } from '@/components/dashboard/dashboard-shell';
import { ProfileForm } from '@/components/settings/profile-form';
import ProfilePictureForm from '@/components/settings/profile-picture-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRequest } from '@/lib/server-api';
import { Camera, Link, Mail, Settings, Settings2 } from 'lucide-react';
import UserAvatar from '@/components/common/user-avatar';
import { User } from '@/models/User';

export default async function SettingsPage() {
  const user = await getRequest<User>('/users');
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
              <h2 className="text-lg font-semibold">Hemant Agarwal</h2>
              <h4 className="text-sm text-muted-foreground">hemantagarwal@gmail.com</h4>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Integrations</CardTitle>
              <CardDescription>Connect external services</CardDescription>
            </CardHeader>
            <CardContent className="px-4 space-y-3">
              {[
                {
                  id: 'email',
                  name: 'Email',
                  icon: Mail,
                  connected: !!user.gmailToken,
                  connect: () => {},
                },
              ].map(integration => (
                <div key={integration.id} className="flex items-center space-x-3 w-full">
                  <div className="flex items-center justify-center p-2 rounded-full bg-muted">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div className="grow">
                    <p className="font-medium">{integration.name}</p>
                    <p className="text-sm text-muted-foreground">{integration.connected ? 'Connected' : 'Not Connected'}</p>
                  </div>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    {integration.connected ? <Settings className="h-6 w-6" /> : <Link className="h-6 w-6" />}
                    <span className="sr-only">Toggle theme</span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
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
