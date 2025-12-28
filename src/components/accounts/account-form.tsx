'use client';

import type React from 'react';

import { Button } from '@/ui/button';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { toast } from '@/hooks/use-toast';
import { Account } from '@/models/Account';
import { createAccount, updateAccount } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { AccountTypes } from '@/config';
import { Form, FormField } from '../ui/form';

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
  accountDetails: z.string().optional(),
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
      accountDetails: account?.accountDetails ?? '',
      openingBalance: account?.openingBalance?.toString() ?? '',
      type: account?.type ?? 'Bank',
    },
  });

  async function onSubmit(data: AccountFormValues) {
    try {
      const accountData: Partial<Account> = {
        ...data,
        openingBalance: parseFloat(data.openingBalance) || 0,
      };
      
      if (isEdit && account?._id) {
        await updateAccount(account._id.toString(), accountData);
      } else {
        await createAccount(accountData);
      }
      toast({
        title: isEdit ? 'Account updated' : 'Account created',
        description: `Your account has been ${isEdit ? 'updated' : 'created'} successfully.`,
      });
      router.back();
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Something went wrong',
        variant: 'destructive',
      });
    }
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 ">
        <FormField control={form.control} name="name" label="Account Name" placeholder="e.g. HDFC Bank" type="input" />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="type"
            label="Account Type"
            placeholder="Select type"
            type="select"
            options={AccountTypes.map(type => ({ label: type, value: type }))}
          />
          <FormField
            control={form.control}
            name="openingBalance"
            label="Opening Balance"
            placeholder="0.00"
            type="number"
            className="col-span-2"
            description={
              isEdit ? 'Current balance will be set to this amount' : 'Initial balance when account was added'
            }
          />
        </div>
        <FormField
          control={form.control}
          name="accountDetails"
          label="Account Details (Optional)"
          placeholder="Additional details about this account"
          type="textarea"
        />
        <div className="flex justify-end pt-2">
          <Button type="submit">{isEdit ? 'Save changes' : 'Create Account'}</Button>
        </div>
      </form>
    </Form>
  );
}
