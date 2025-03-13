import { ObjectId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface User extends Model {
  name: string;
  email: string;
  age?: number;
  currency?: string;
  dateFormat?: string;
  darkMode?: boolean;
  notifications?: boolean;
  gmailToken?: string;
}

export class UserModel extends BaseModel<User> {
  constructor() {
    super('users'); // Pass collection name
  }
}
