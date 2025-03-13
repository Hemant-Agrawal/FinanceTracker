'use client';

import type React from 'react';

import { Button } from '@/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Account } from '@/models/Account';
import { patchRequest, postRequest } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { AccountTypes } from '@/config';

const accountFormSchema = z.object({
  name: z.string().min(1, {
    message: 'Account name is required.',
  }),
  type: z.string().min(1, {
    message: 'Account type is required.',
  }),
  openingBalance: z.string().min(1, {
    message: 'Opening balance is required.',
  }),
  details: z.string().optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AccountFormProps {
  account?: Account;
}

export function AccountForm({ account }: AccountFormProps) {
  const router = useRouter();
  const isEdit = Boolean(account?._id);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account?.name ?? '',
      details: account?.accountDetails ?? '',
      openingBalance: account?.openingBalance?.toString() ?? '',
      type: account?.type ?? 'Bank',
    },
  });

  async function onSubmit(data: AccountFormValues) {
    let response;
    if (isEdit) {
      response = await patchRequest(`/accounts/${account?._id}`, data);
    } else {
      response = await postRequest('/accounts', data);
    }
    if (response) {
      toast({
        title: isEdit ? 'Account updated' : 'Account created',
        description: `Your account has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      router.back();
      router.refresh();
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. HDFC Bank" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Account Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {AccountTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openingBalance"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Opening Balance</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
                </FormControl>
                <FormDescription>
                  {isEdit
                    ? 'Current balance will be set to this amount'
                    : 'Initial balance when account was added'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="details"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Details (Optional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Additional details about this account" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button type="submit">{isEdit ? 'Save changes' : 'Add Account'}</Button>
        </div>
      </form>
    </Form>
  );
}
