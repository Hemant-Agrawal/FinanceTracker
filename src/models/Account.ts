import { ClientSession, ObjectId, Filter } from 'mongodb';
import { BaseModel, Model } from './BaseModel';
import { AccountType } from '@/config';

export interface Account extends Model {
  name: string;
  accountDetails: string;
  type: AccountType;
  openingBalance: number;
  currentBalance: number;
  isActive: boolean;
}

export class AccountModel extends BaseModel<Account> {
  constructor() {
    super('accounts'); // Collection name
  }

  async getTotalBalance(filter: Filter<Account>, userId: ObjectId | string) {
    const totalBalance = await this.list({
      isDeleted: { $ne: true },
      createdBy: new ObjectId(userId),
      ...filter,
    });
    return totalBalance.reduce((acc, curr) => acc + curr.currentBalance, 0);
  }

  async updateBalance(accountId: ObjectId, amount: number, session?: ClientSession) {
    const updateResult = await this.getCollection().updateOne(
      { _id: accountId },
      { $inc: { currentBalance: amount }, $set: { updatedAt: new Date() } },
      { session }
    );

    if (!updateResult) {
      throw new Error('Account balance update failed');
    }
  }
}
