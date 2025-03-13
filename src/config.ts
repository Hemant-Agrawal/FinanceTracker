// In a real app, these would be fetched from the database
export const AccountTypes = ['Bank', 'Cash', 'Credit Card', 'Loan', 'Other'];
export const TransactionTypes = ['Income', 'Expense', 'Transfer'];


export type AccountType = (typeof AccountTypes)[number];
export type TransactionType = (typeof TransactionTypes)[number];
