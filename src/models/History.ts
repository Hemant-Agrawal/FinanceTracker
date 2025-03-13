import { Filter, ObjectId, WithId } from 'mongodb';
import { BaseModel, Model } from './BaseModel';

export interface History extends Model {
  action: string;
  date: Date;
  details: string;
  referenceId: ObjectId;
  referenceType: string;
}

export class HistoryModel extends BaseModel<History> {
  constructor() {
    super('history'); // Pass collection name
  }

  async list(filter?: Filter<History>, limit = 10, skip = 0, sort = {}): Promise<WithId<History>[]> {
    return super.list(filter, limit, skip, sort);
  }
}
