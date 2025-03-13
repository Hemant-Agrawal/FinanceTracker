import { ClientSession, ObjectId } from 'mongodb';
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

  async updateBalance(accountId: ObjectId, amount: number, session?: ClientSession) {
    const updateResult = await this.getCollection().updateOne(
      { _id: accountId },
      { $inc: { currentBalance: amount } },
      { session }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Account balance update failed');
    }
  }
}
