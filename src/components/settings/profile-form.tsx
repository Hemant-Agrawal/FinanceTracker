'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { patchRequest } from '@/lib/api';
import { User } from '@/models/User';

const profileFormSchema = z.object({
  name: z.string({
    required_error: 'Name is required.',
  }),
  email: z.string({
    required_error: 'Email is required.',
  }),
  phone: z.string().optional(),
  gmailToken: z.string().optional(),
  currency: z.string().optional(),
  dateFormat: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm({ user }: { user: User }) {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      // phone: user.phone,
      // gmailToken: user.gmailToken,
    },
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField control={form.control} name="name" label="Name" />
        <FormField control={form.control} name="email" label="Email" />
        <FormField control={form.control} name="phone" label="Phone" />
        <FormField
          control={form.control}
          name="currency"
          type="select"
          label="Currency"
          placeholder="Select currency"
          options={[
            { label: 'Indian Rupee (₹)', value: 'INR' },
            { label: 'US Dollar ($)', value: 'USD' },
            { label: 'Euro (€)', value: 'EUR' },
            { label: 'British Pound (£)', value: 'GBP' },
          ]}
          // description="This will be used for displaying all monetary values."
        />
        <FormField
          control={form.control}
          name="dateFormat"
          type="select"
          label="Date Format"
          placeholder="Select date format"
          options={[
            { label: 'DD/MM/YYYY', value: 'DD/MM/YYYY' },
            { label: 'MM/DD/YYYY', value: 'MM/DD/YYYY' },
            { label: 'YYYY-MM-DD', value: 'YYYY-MM-DD' },
          ]}
          // description="This will be used for displaying all dates."
        />

        <div className="flex justify-end gap-2 pt-4">
          {/* <Button type="reset" variant="outline" disabled>
            Reset
          </Button> */}
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
  );
}
