'use client';

import { useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/ui/button';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PaymentMethod, Transaction } from '@/models/Transaction';
import { createTransaction, updateTransaction } from '@/lib/actions';
import { Account } from '@/models/Account';
import { WithId } from 'mongodb';
import { useRouter } from 'next/navigation';
import { Form, FormField } from '@/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface TransactionFormProps {
  paymentMethods: Account[];
  transaction?: WithId<Transaction>;
}

const schema = z.object({
  description: z.string().min(1, {
    message: 'Transaction description is required',
  }),
  amount: z.string(),
  type: z.enum(['expense', 'income', 'transfer']),
  date: z.date(),
  paymentMethod: z.string({
    message: 'Payment method is required',
  }),
  notes: z.string(),
  tags: z.array(z.string()),
});

type TransactionFormValues = z.infer<typeof schema>;

export function TransactionForm({ transaction, paymentMethods }: TransactionFormProps) {
  const isEdit = Boolean(transaction);
  const router = useRouter();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      description: '',
      amount: '0',
      type: 'expense',
      date: new Date(),
      paymentMethod: paymentMethods.length > 0 ? `${paymentMethods[0]._id}` : '',
      notes: '',
      tags: [],
    },
  });
  const { control, handleSubmit, reset } = form;

  useEffect(() => {
    if (transaction && isEdit) {
      reset({
        description: transaction.description,
        amount: Math.abs(transaction.amount).toString(),
        type: transaction.type,
        date: new Date(transaction.date),
        paymentMethod: transaction.paymentMethod.toString(),
        tags: transaction.tags || [],
      });
    }
  }, [transaction, isEdit, reset]);

  const onSubmit: SubmitHandler<TransactionFormValues> = async data => {
    try {
      const parsedAmount = data.type === 'expense' ? -Math.abs(+data.amount) : Math.abs(+data.amount);

      const newTransaction: Partial<Transaction> = {
        description: data.description,
        amount: parsedAmount,
        date: data.date,
        paymentMethod: data.paymentMethod as any, // Server function handles string ID conversion
        tags: data.tags as string[],
        notes: data.notes,
        type: data.type,
        history: [],
      };

      if (transaction?._id) {
        await updateTransaction(transaction._id.toString(), newTransaction);
      } else {
        await createTransaction(newTransaction);
      }
      router.back();
      router.refresh();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
    reset();
  };
  const transactionTypes = [
    {
      label: (
        <div className="flex items-center">
          <Minus className="h-4 w-4 mr-2 text-red-500" />
          Expense
        </div>
      ),
      value: 'expense',
    },
    {
      label: (
        <div className="flex items-center">
          <Plus className="h-4 w-4 mr-2 text-green-500" />
          Income
        </div>
      ),
      value: 'income',
    },
    // { label: 'Transfer', value: 'transfer' },
  ];

  const tags = [
    { label: 'Groceries', value: 'groceries' },
    { label: 'Bills', value: 'bills' },
    { label: 'Salary', value: 'salary' },
    // Add more predefined tags here
  ];

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <FormField control={control} name="type" label="Type" type="select" options={transactionTypes} />
          <FormField control={control} name="date" label="Date" type="date" />
        </div>
        <FormField control={control} name="description" label="Description" type="input" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <FormField
            control={control}
            name="paymentMethod"
            label="Payment Method"
            type="select"
            options={paymentMethods.map(p => ({ label: p.name, value: `${p._id}` }))}
          />
          <FormField control={control} name="amount" label="Amount" type="number" className="md:col-span-2" />
        </div>
        <FormField control={control} name="tags" label="Tags" type="multi-select" options={tags} />
        <FormField control={control} name="notes" label="Notes" type="textarea" />
        {/* <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4 flex justify-end">
          <Button variant="outline" type="button" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Receipt
          </Button>
        </div>
      </div> */}

        <div className="flex justify-end pt-2">
          <Button type="submit">{isEdit ? 'Save Changes' : 'Create Transaction'}</Button>
        </div>
      </form>
    </Form>
  );
}
