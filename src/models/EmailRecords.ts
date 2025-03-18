import { Filter, ObjectId, WithId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface EmailRecords extends Model {
  userId: ObjectId;
  messageId: string;
  email: string;
  subject: string;
  body: string;
  attachments: string[];
  raw: unknown;
  status: string;
  error: string;
}

export class EmailRecordsModel extends BaseModel<EmailRecords> {
  constructor() {
    super('emailRecords'); // Pass collection name
    // this.getCollection().createIndex({ messageId: 1 }, { unique: true });
  }

  async list(filter?: Filter<EmailRecords>, limit = 10, skip = 0, sort = {}): Promise<WithId<EmailRecords>[]> {
    return super.list(filter, limit, skip, sort);
  }
}
