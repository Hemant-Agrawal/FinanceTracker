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
  date: string;
  type: TransactionType;
  paymentMethod: PaymentMethod;
  tags: string[];
  notes?: string;
  category?: string;
  status?: string;
  isRecurring?: boolean;
  splitExpense?: SplitExpense;
  history: WithId<History>[];
}

export class TransactionModel extends BaseModel<Transaction> {
  constructor() {
    super('transactions'); // Collection name
  }

  async insert(document: OptionalId<Transaction>, userId: ObjectId | string): Promise<ObjectId | undefined> {
    document.status = 'Completed';
    return super.insert(document, userId);
  }

  async list(filter?: Filter<Transaction>, limit = 10, skip = 0, sort = {}): Promise<WithId<Transaction>[]> {
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
