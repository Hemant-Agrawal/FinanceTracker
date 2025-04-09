import { Filter, ObjectId, OptionalId, WithId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';
import { History } from './History';

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface SplitParty {
  id: string;
  name: string;
  amount: string;
  percentage: string;
}

export interface SplitExpense {
  type: 'amount' | 'percentage';
  parties: SplitParty[];
}

export interface PaymentMethod {
  _id: ObjectId;
  name: string;
  type: string;
}

export interface Transaction extends Model {
  description: string;
  amount: number;
  date: Date;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  tags: string[];
  notes?: string;
  category?: string;
  status?: string;
  referenceId?: string;
  isRecurring?: boolean;
  splitExpense?: SplitExpense;
  history?: WithId<History>[];
}

export class TransactionModel extends BaseModel<Transaction> {
  constructor() {
    super('transactions'); // Collection name
  }

  async insert(document: OptionalId<Transaction>, userId: ObjectId | string): Promise<ObjectId | undefined> {
    if (!document.status) document.status = 'approved';
    return super.insert(document, userId);
  }

  async getTotalIncome(filter: Filter<Transaction>, userId: ObjectId | string) {
    const totalIncome = await this.getCollection().find({
      ...filter,
      isDeleted: { $ne: true },
      createdBy: new ObjectId(userId),
      type: 'income',
      status: 'approved',
    }).toArray();
    return totalIncome.reduce((acc, curr) => acc + curr.amount, 0);
  }

  async getTotalExpenses(filter: Filter<Transaction>, userId: ObjectId | string) {
    const totalExpenses = await this.getCollection().find({
      isDeleted: { $ne: true },
      createdBy: new ObjectId(userId),
      ...filter,
      type: 'expense',
      status: 'approved',
    }).toArray();
    return totalExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  }


  async list(filter?: Filter<Transaction>, limit = 10, skip = 0, sort = {}): Promise<WithId<Transaction>[]> {
    if (!filter) filter = {};
    if (!filter?.status) {
      filter.status = 'approved';
    }
    return this.getCollection()
      .aggregate<WithId<Transaction>>([
        { $match: filter },
        {
          $lookup: {
            from: 'accounts', // Collection name
            localField: 'paymentMethod._id', // Field in transactions
            foreignField: '_id', // Field in accounts
            as: 'accountDetails',
          },
        },
        { $unwind: '$accountDetails' },
        {
          $addFields: {
            'paymentMethod._id': '$accountDetails._id',
            'paymentMethod.name': '$accountDetails.name',
            'paymentMethod.type': '$accountDetails.type',
          },
        },
        { $sort: sort },
        { $skip: skip },
        { $limit: limit },
      ])
      .toArray();
  }

  async deleteByAccountId(accountId: ObjectId | string) {
    await this.getCollection().deleteMany({ accountId: new ObjectId(accountId) });
  }
}
