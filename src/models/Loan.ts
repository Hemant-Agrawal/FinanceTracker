import { ClientSession, ObjectId, Filter } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface Loan extends Model {
  name: string;
  loanDetails: string;
  lender: string;
  principalAmount: number;
  interestRate: number;
  tenure: number;
  emiAmount: number;
  startDate: string;
  remainingBalance: number;
  totalPaid: number;
  nextPaymentDate: string;
  isActive: boolean;
}

export class LoanModel extends BaseModel<Loan> {
  constructor() {
    super('loans'); // Collection name
  }

  async getTotalBalance(filter: Filter<Loan>, userId: ObjectId | string) {
    const totalBalance = await this.list({
      isDeleted: { $ne: true },
      createdBy: new ObjectId(userId),
      ...filter,
    });
    return totalBalance.reduce((acc, curr) => acc + curr.remainingBalance, 0);
  }

  async updateBalance(accountId: ObjectId, amount: number, session?: ClientSession) {
    const collection = await this.getCollection();
    const updateResult = await collection.updateOne(
      { _id: accountId },
      { $inc: { currentBalance: amount }, $set: { updatedAt: new Date() } },
      { session }
    );

    if (!updateResult) {
      throw new Error('Account balance update failed');
    }
  }
}
