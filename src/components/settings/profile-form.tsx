'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/ui/input';
import { patchRequest } from '@/lib/api';
import { Mail } from 'lucide-react';

const profileFormSchema = z.object({
  avatar: z.string().optional(),
  name: z.string({
    required_error: 'Name is required.',
  }),
  email: z.string({
    required_error: 'Email is required.',
  }),
  phone: z.string().optional(),
  gmailToken: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This simulates a database record
const defaultValues: Partial<ProfileFormValues> = {
  avatar: '',
  name: '',
  email: '',
  phone: '',
  gmailToken: '',
};

export function ProfileForm() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues,
  });

  function onSubmit(data: ProfileFormValues) {
    patchRequest('/users', data)
      .then(() => {
        toast({
          title: 'Settings updated',
          description: 'Your settings have been updated successfully.',
        });
      })
      .catch(err => {
        toast({
          title: 'Error updating settings',
          description: err.message,
        });
      });
  }

  const openGitHubAppModal = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('access_type', 'offline');
    authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/gmail.readonly');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || '');
    const modalWidth = 600;
    const modalHeight = 700;
    const modalLeft = (window.innerWidth - modalWidth) / 2;
    const modalTop = (window.innerHeight - modalHeight) / 2;

    // Open a popup window for GitHub App installation
    const popup = window.open(
      authUrl,
      'InstallGmailApp',
      `width=${modalWidth},height=${modalHeight},left=${modalLeft},top=${modalTop}`
    );

    if (popup) {
      // Monitor the popup window for completion
      const checkPopup = setInterval(async () => {
        if (popup.closed) {
          clearInterval(checkPopup); // Stop checking if the popup is closed
          console.log('Gmail App installation window closed');
        }
      }, 500);

      // Listen for messages from the popup
    } else {
      console.error('Failed to open the popup window.');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Avatar</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <Input {...field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            {/* <Button type="reset" variant="outline">Cancel</Button> */}
            <Button type="button" variant="outline" onClick={openGitHubAppModal}>
              <Mail className="h-4 w-4" />
              Connect Gmail
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
