import { Filter, ObjectId, WithId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface EmailAttachment {
  filename: string;
  mimeType: string;
  size: number;
  _id: ObjectId;
}
export interface EmailRecord extends Model {
  userId: ObjectId;
  messageId: string;
  date: Date;
  from: string;
  to: string;
  subject: string;
  body: string;
  format: string;
  attachments: EmailAttachment[];
  status: string;
  error?: string;
}

export class EmailRecordModel extends BaseModel<EmailRecord> {
  constructor() {
    super('emailRecord', 'attachments'); // Pass collection name
    // this.getCollection().createIndex({ messageId: 1 }, { unique: true });
  }

  async list(filter?: Filter<EmailRecord>, limit = 10, skip = 0, sort = {}): Promise<WithId<EmailRecord>[]> {
    return super.list(filter, limit, skip, sort);
  }

  async insertAttachment(attachment: { filename: string; mimeType: string; data: string }): Promise<ObjectId> {
    return super.uploadToBucket(attachment.filename, attachment.mimeType, attachment.data);
  }
}
