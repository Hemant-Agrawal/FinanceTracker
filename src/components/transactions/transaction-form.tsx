'use client';

import {  useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Textarea } from '@/ui/textarea';
import { Calendar } from '@/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/ui/popover';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import dayjs from 'dayjs';
import { PaymentMethod, Transaction } from '@/models/Transaction';
import { createTransaction, updateTransaction } from '@/lib/api';
import { Account } from '@/models/Account';
import { WithId } from 'mongodb';
import { useRouter } from 'next/navigation';

interface TransactionFormProps {
  paymentMethods: Account[];
  transaction?: WithId<Transaction>;
}

const schema = yup.object().shape({
  description: yup.string().required('Transaction description is required'),
  amount: yup.number().positive('Amount must be positive').required('Amount is required'),
  type: yup.string().oneOf(['expense', 'income', 'transfer']).required(),
  date: yup.date().required('Date is required'),
  paymentMethod: yup.string().required('Payment method is required'),
  notes: yup.string(),
  tags: yup.array().of(yup.string()),
});

type TransactionFormValues = yup.InferType<typeof schema>;

export function TransactionForm({ transaction, paymentMethods }: TransactionFormProps) {
  const isEdit = Boolean(transaction);
  const router = useRouter();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TransactionFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      description: '',
      amount: 0,
      type: 'expense',
      date: new Date(),
      paymentMethod: '',
      notes: '',
      tags: [],
    },
  });

  useEffect(() => {
    if (transaction && isEdit) {
      reset({
        description: transaction.description,
        amount: Math.abs(transaction.amount),
        type: transaction.type,
        date: new Date(transaction.date),
        paymentMethod: transaction.paymentMethod.toString(),
        tags: transaction.tags || [],
      });
    }
  }, [transaction, isEdit, reset]);

  const onSubmit : SubmitHandler<TransactionFormValues> = async (data) => {
    const parsedAmount = data.type === 'expense' ? -Math.abs(data.amount) : Math.abs(data.amount);

    const newTransaction: Transaction = {
      _id: transaction && isEdit ? transaction._id : undefined,
      description: data.description,
      amount: parsedAmount,
      date: data.date.toISOString(),
      paymentMethod: data.paymentMethod as unknown as PaymentMethod,
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

    reset();
    // onAdd(newTransaction);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="transaction-type" className="text-right">
          Type
        </Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger id="transaction-type" className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="expense">
                  <div className="flex items-center">
                    <Minus className="h-4 w-4 mr-2 text-red-500" />
                    Expense
                  </div>
                </SelectItem>
                <SelectItem value="income">
                  <div className="flex items-center">
                    <Plus className="h-4 w-4 mr-2 text-green-500" />
                    Income
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Name
        </Label>
        <div className="col-span-3">
          <Controller
            name="description"
            control={control}
            render={({ field }) => <Input id="description" placeholder="e.g., Grocery Shopping" {...field} />}
          />
          {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="amount" className="text-right">
          Amount
        </Label>
        <div className="col-span-3">
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <Input id="amount" type="number" placeholder="0.00" step="0.01" min="0" {...field} />
            )}
          />
          {errors.amount && <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="date" className="text-right">
          Date
        </Label>
        <div className="col-span-3">
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {field.value ? dayjs(field.value).format('MMMM D, YYYY') : 'Select date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.date && <p className="text-sm text-red-500 mt-1">{errors.date.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="payment-method" className="text-right">
          Payment Method
        </Label>
        <div className="col-span-3">
          <Controller
            name="paymentMethod"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(method => (
                    <SelectItem key={`${method._id}`} value={`${method._id}`}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && <p className="text-sm text-red-500 mt-1">{errors.paymentMethod.message}</p>}
        </div>
      </div>
      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="notes" className="text-right pt-2">
          Notes
        </Label>
        <Controller
          name="notes"
          control={control}
          render={({ field }) => (
            <Textarea
              id="notes"
              className="col-span-3"
              placeholder="Add any additional details..."
              rows={3}
              {...field}
            />
          )}
        />
      </div>

      {/* <div className="grid grid-cols-4 items-center gap-4">
        <div className="col-span-4 flex justify-end">
          <Button variant="outline" type="button" className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Receipt
          </Button>
        </div>
      </div> */}

      <div>
        <Button type="submit">{isEdit ? 'Save Changes' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
}
