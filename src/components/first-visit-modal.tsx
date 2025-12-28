'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { useSession } from 'next-auth/react';
import { updateUser } from '@/lib/actions';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits.' })
    .regex(/^\+?[0-9\s\-()]+$/, { message: 'Please enter a valid phone number.' }),
  preferredCurrency: z.string().min(1, { message: 'Please select a preferred currency.' }),
});

type FormValues = z.infer<typeof formSchema>;

export function FirstVisitModal() {
  const [isOpen, setIsOpen] = useState(true);
  const { data: session, update } = useSession();
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: session?.user?.email || '',
      phone: '',
      preferredCurrency: 'INR',
    },
  });

  async function onSubmit(data: FormValues) {
    try {
      await updateUser(data);
      toast({
        title: 'Profile information saved',
        description: 'Thank you for providing your details!',
      });
      update({
        ...session,
        user: {
          ...session?.user,
          ...data,
        },
      });
      router.push('/dashboard');
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error saving profile',
        description: error instanceof Error ? error.message : 'Failed to save',
        variant: 'destructive',
      });
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Finance Tracker</DialogTitle>
          <DialogDescription>
            Please provide some basic information to get started with your personalized experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="name" label="Full Name" placeholder="John Doe" />
            <FormField control={form.control} name="email" disabled label="Email" placeholder="john.doe@example.com" />
            <FormField control={form.control} name="phone" label="Phone Number" placeholder="+91 9876543210" />
            <FormField
              control={form.control}
              name="preferredCurrency"
              label="Preferred Currency"
              type="select"
              options={[
                { label: 'Indian Rupee (₹)', value: 'INR' },
                { label: 'US Dollar ($)', value: 'USD' },
                { label: 'Euro (€)', value: 'EUR' },
                { label: 'British Pound (£)', value: 'GBP' },
              ]}
            />
            <DialogFooter>
              <Button type="submit">Save Information</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
