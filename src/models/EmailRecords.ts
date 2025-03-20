import { Filter, ObjectId, WithId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface EmailRecords extends Model {
  userId: ObjectId;
  messageId: string;
  date: Date;
  from: string;
  subject: string;
  body: string;
  format: string;
  attachments: ObjectId[];
  status: string;
  error?: string;
}

export class EmailRecordsModel extends BaseModel<EmailRecords> {
  constructor() {
    super('emailRecords'); // Pass collection name
    // this.getCollection().createIndex({ messageId: 1 }, { unique: true });
  }

  async list(filter?: Filter<EmailRecords>, limit = 10, skip = 0, sort = {}): Promise<WithId<EmailRecords>[]> {
    return super.list(filter, limit, skip, sort);
  }

  async insertAttachment(attachment: { filename: string; mimeType: string; data: string }): Promise<ObjectId> {
    return super.uploadToBucket(attachment.filename, attachment.mimeType, attachment.data);
  }
}
