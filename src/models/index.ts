import { AccountModel } from './Account';
import { UserModel } from './User';
import { HistoryModel } from './History';
import { InvestmentModel } from './Investment';
import { TransactionModel } from './Transaction';
import { InvestmentTransactionModel } from './InvestmentTransaction';
import { EmailRecordsModel } from './EmailRecords';

export const UserColl = new UserModel();
export const AccountColl = new AccountModel();
export const InvestmentColl = new InvestmentModel();
export const TransactionColl = new TransactionModel();
export const HistoryColl = new HistoryModel();
export const InvestmentTransactionColl = new InvestmentTransactionModel();
export const EmailRecordsColl = new EmailRecordsModel();

export type { PaginatedResult, PaginationType } from './BaseModel';
