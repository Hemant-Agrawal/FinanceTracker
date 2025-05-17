'use client';

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
import { patchRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { UpstoxClient } from '@/ai/upstok/client';

const formSchema = z.object({
  clientId: z.string().min(1, { message: 'Client ID is required.' }),
  clientSecret: z.string().min(1, { message: 'Client Secret is required.' }),
  accessToken: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface UpstokIntegrationModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function UpstokIntegrationModal({ isOpen, setIsOpen }: UpstokIntegrationModalProps) {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientId: '',
      clientSecret: '',
      accessToken: '',
    },
  });

  async function onSubmit(data: FormValues) {
    try{

      await UpstoxClient.makeAccessTokenRequest(data.clientId);
    } catch {
      toast({
        title: 'Error',
        description: 'Invalid client ID or client secret',
      });
      return;
    }
    await patchRequest('/users', { upstok: data });
    toast({
      title: 'Upstok integration saved',
      description: 'Thank you for providing your details!',
    });
    router.refresh();
    setIsOpen(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upstok Integration</DialogTitle>
          <DialogDescription>
            Please provide your Upstok client ID and client secret to get started with your personalized experience.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField control={form.control} name="clientId" label="Client ID" placeholder="1234567890" />
            <FormField control={form.control} name="clientSecret" label="Client Secret" placeholder="1234567890" />
            <FormField control={form.control} name="accessToken" label="Access Token (Optional)" placeholder="Access Token" />
            <DialogFooter>
              <Button type="submit">Save Information</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
