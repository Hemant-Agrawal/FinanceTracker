'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { toast } from '@/hooks/use-toast';
import { createInvestmentTransaction } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { ObjectId } from 'mongodb';
import { InvestmentTransactionType } from '@/models/InvestmentTransaction';

const formSchema = z.object({
  name: z.string().min(1, {
    message: 'Investment name is required.',
  }),
  type: z.string().min(1, {
    message: 'Investment type is required.',
  }),
  amount: z.string().min(1, {
    message: 'Amount is required.',
  }),
  date: z.string().min(1, {
    message: 'Transaction date is required.',
  }),
  transactionType: z.enum(['buy', 'sell'], {
    message: 'Transaction type is required.',
  }),
});

export function InvestmentTransactionForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      type: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      transactionType: 'buy',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // Convert transactionType to InvestmentTransactionType ('Buy' | 'Sell')
      const transactionType: InvestmentTransactionType = values.transactionType === 'buy' ? 'Buy' : 'Sell';
      
      await createInvestmentTransaction({
        investmentId: new ObjectId(), // TODO: This should come from form or context
        accountId: new ObjectId(), // TODO: This should come from form or context
        type: transactionType,
        date: new Date(values.date),
        totalAmount: parseFloat(values.amount),
        pricePerUnit: 0, // TODO: Calculate or get from form
        quantity: 0, // TODO: Get from form
        notes: values.name, // Using name as notes for now
      } as any); // Using type assertion since form is incomplete
      toast({
        title: 'Transaction recorded',
        description: 'Your investment transaction has been recorded successfully.',
      });
      router.refresh();
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record transaction',
        variant: 'destructive',
      });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Investment Transaction</CardTitle>
        <CardDescription>Enter the details of your investment transaction</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField control={form.control} name="name" label="Investment Name" placeholder="Enter investment name" />
            <FormField
              control={form.control}
              name="type"
              type="select"
              label="Investment Type"
              placeholder="Select investment type"
              options={[
                { label: 'Stock', value: 'stock' },
                { label: 'Mutual Funds', value: 'mutual-funds' },
                { label: 'ETF', value: 'etf' },
                { label: 'Bond', value: 'bond' },
              ]}
            />
            <FormField control={form.control} name="amount" label="Amount" placeholder="Enter amount" />
            <FormField
              control={form.control}
              name="date"
              type="date"
              label="Transaction Date"
              placeholder="Select transaction date"
            />
            <FormField
              control={form.control}
              name="transactionType"
              type="select"
              label="Transaction Type"
              placeholder="Select transaction type"
              options={[
                { label: 'Buy', value: 'buy' },
                { label: 'Sell', value: 'sell' },
              ]}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Record Transaction</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
