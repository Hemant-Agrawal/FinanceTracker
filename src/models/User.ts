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
  gmail?: {
    refreshToken?: string;
    syncEnabled?: boolean;
    syncInProgress?: boolean;
    lastSyncedAt?: Date;
  }
  upstok?: {
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
  }
  pushSubscription?: PushSubscription[];
  isInternalUser?: boolean;
}

export class UserModel extends BaseModel<User> {
  constructor() {
    super('users'); // Pass collection name
  }

  async getUserByUpstokClientId(clientId: string) {
    const user = await this.findOne({ 'upstok.clientId': clientId });
    return user;
  }
}
