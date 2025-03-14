import {
  ClientSession,
  Collection,
  Db,
  Filter,
  MongoClient,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
  WithId,
} from 'mongodb';
import { connectClient } from '@/lib/mongodb';

export interface Model {
  _id?: ObjectId;
  createdAt?: Date;
  createdBy?: ObjectId;
  isDeleted?: boolean;
  updatedAt?: Date;
  updatedBy?: ObjectId;
  accessibleBy?: ObjectId[];
}

export interface PaginationType {
  totalItems: number;
  totalPages: number;
  page: number;
  itemsPerPage: number;
  currentPageItems: number;
}
export interface PaginatedResult<T> {
  data: WithId<T>[];
  pagination: PaginationType;
}
export class BaseModel<T extends Model> {
  private collectionName: string;
  private db!: Db;
  private client!: MongoClient;
  private collection!: Collection<T>;

  constructor(collectionName: string) {
    this.collectionName = collectionName;
    this.init();
  }

  private async init() {
    this.client = await connectClient();
    this.db = this.client.db();
    
    this.collection = this.db.collection<T>(this.collectionName);
  }

  getCollection() {
    return this.collection;
  }

  // Insert a new document
  async insert(document: OptionalUnlessRequiredId<T>, userId: ObjectId | string): Promise<ObjectId | undefined> {
    document.createdAt = new Date();
    document.updatedAt = new Date();
    document.createdBy = new ObjectId(userId);
    document.updatedBy = new ObjectId(userId);
    document.accessibleBy = [new ObjectId(userId)];
    const result = await this.collection.insertOne(document);
    return result.insertedId;
  }

  // Check if a document exists with given filter
  async exists(filter: Filter<T>): Promise<boolean> {
    const count = await this.collection.countDocuments({
      ...filter,
      isDeleted: { $ne: true },
    });
    return count > 0;
  }

  // Find a document by ID
  async findById(id: string): Promise<WithId<T> | null> {
    return this.collection.findOne({
      _id: new ObjectId(id),
      isDeleted: { $ne: true },
    } as Filter<T>);
  }

  // Find all documents with optional filter
  async find(filter: Filter<T> = {}): Promise<WithId<T>[]> {
    return this.collection.find(filter as Filter<T>).toArray();
  }

  // Update a document by ID
  async updateById(id: string | ObjectId, updatedData: Partial<T>, userId?: ObjectId): Promise<boolean> {
    updatedData.updatedAt = new Date();
    if (userId) {
      updatedData.updatedBy = userId;
    }
    const result = await this.collection.updateOne({ _id: new ObjectId(id) } as Filter<T>, { $set: updatedData });
    return result.modifiedCount > 0;
  }

  // Delete a document by ID
  async deleteById(id: string): Promise<boolean> {
    return this.updateById(id, { isDeleted: true } as Partial<T>);
  }

  // List all documents with optional sorting and pagination
  async list(filter: Filter<T> = {}, limit = 10, skip = 0, sort: Sort = {}): Promise<WithId<T>[]> {
    return this.collection
      .find({ ...filter, isDeleted: { $ne: true } })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // Get paginated results with metadata
  async paginate(filter: Filter<T> = {}, page = 1, itemsPerPage = 10, sort: Sort = {}): Promise<PaginatedResult<T>> {
    // Ensure page is at least 1
    page = Math.max(1, page);

    // Add isDeleted filter
    const finalFilter = { ...filter, isDeleted: { $ne: true } };

    // Calculate skip value
    const skip = (page - 1) * itemsPerPage;

    // Execute queries in parallel
    const [data, totalItems] = await Promise.all([
      this.list(finalFilter, itemsPerPage, skip, sort),
      this.collection.countDocuments(finalFilter),
    ]);

    // Calculate pagination metadata
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    return {
      data,
      pagination: {
        page,
        totalItems,
        totalPages,
        itemsPerPage,
        currentPageItems: data.length,
      },
    };
  }

  // 🔹 Start a transaction and pass session to callback
  async withTransaction<R>(callback: (session: ClientSession) => Promise<R>): Promise<R> {
    const session = this.client.startSession();
    try {
      session.startTransaction();
      const result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}
