import { ObjectId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export type InvestmentTransactionType = 'Buy' | 'Sell';

export interface InvestmentTransaction extends Model {
  _id?: ObjectId;
  investmentId: ObjectId; // Reference to Investment
  accountId: ObjectId; // Reference to Account (for funds movement)
  type: InvestmentTransactionType;
  date: Date;
  pricePerUnit: number; // Price at which it was bought/sold
  quantity: number; // Number of units (stocks, crypto, etc.)
  totalAmount: number; // Computed as pricePerUnit * quantity
  notes?: string;
}

export class InvestmentTransactionModel extends BaseModel<InvestmentTransaction> {
  constructor() {
    super('investment_transactions');
  }
}
