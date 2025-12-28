'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { Switch } from '@/ui/switch';
import { updateUser } from '@/lib/actions';

const settingsFormSchema = z.object({
  language: z.string().optional(),
  currency: z.string({
    message: 'Please select a currency.',
  }),
  dateFormat: z.string({
    message: 'Please select a date format.',
  }),
  darkMode: z.boolean(),
  notifications: z.boolean(),
  monthlyBudget: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

// This simulates a database record
const defaultValues: Partial<SettingsFormValues> = {
  language: 'en',
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  darkMode: false,
  notifications: true,
  monthlyBudget: '50000',
};

export function SettingsForm() {
  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues,
  });

  async function onSubmit(data: SettingsFormValues) {
    try {
      await updateUser(data);
      toast({
        title: 'Settings updated',
        description: 'Your settings have been updated successfully.',
      });
    } catch (err) {
      toast({
        title: 'Error updating settings',
        description: err instanceof Error ? err.message : 'Failed to update settings',
        variant: 'destructive',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-6">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="language"
              type="select"
              label="Language"
              placeholder="Select language"
              options={[
                { label: 'English', value: 'en' },
                { label: 'Hindi', value: 'hi' },
                { label: 'Spanish', value: 'es' },
                { label: 'French', value: 'fr' },
                { label: 'German', value: 'de' },
              ]}
              description="This will be used for displaying all text in the application."
            />
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
              description="This will be used for displaying all monetary values."
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
              description="This will be used for displaying all dates."
            />
            <FormField
              control={form.control}
              name="monthlyBudget"
              type="number"
              label="Monthly Budget"
              description="Set your monthly budget to track spending limits."
              placeholder="0.00"
            />
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Preferences</h3>
            <FormField
              control={form.control}
              name="darkMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Dark Mode</FormLabel>
                    <FormDescription>Enable dark mode for the application.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="notifications"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Notifications</FormLabel>
                    <FormDescription>Receive notifications for important updates.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="reset" variant="outline">
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
