import { BaseModel, Model } from './BaseModel';

export interface Avatar {
  url: string;
  // alt: string;
  // width: number;
  // height: number;
  // size: number;
  rotation: number;
  zoom: number;
  position: {
    x: number;
    y: number;
  };
}

export interface User extends Model {
  name: string;
  email: string;
  avatar?: Avatar;
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
