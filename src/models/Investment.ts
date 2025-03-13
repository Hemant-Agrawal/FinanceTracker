import { ObjectId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export type InvestmentType =
  | 'Stock'
  | 'Mutual Fund'
  | 'Crypto'
  | 'Real Estate'
  | 'Bond'
  | 'Insurance'
  | 'Fixed Deposit'
  | 'ETF'
  | 'Other';

export interface Investment extends Model {
  _id?: ObjectId;
  name: string; // Investment Name
  details?: string;
  type: InvestmentType;
  units: number;
  buyPrice: number;
  currentPrice: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
  status: 'Active' | 'Matured' | 'Closed';
  notes?: string; // Additional information
}

export class InvestmentModel extends BaseModel<Investment> {
  constructor() {
    super('investments'); // Collection name
  }

  // Find investments by category (type)
  async findByCategory(type: InvestmentType): Promise<Investment[]> {
    return this.find({ type });
  }
}
