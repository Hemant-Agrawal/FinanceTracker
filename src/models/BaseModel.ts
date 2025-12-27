import clientPromise from '@/lib/db';
import {
  ClientSession,
  Filter,
  GridFSBucket,
  ObjectId,
  OptionalUnlessRequiredId,
  Sort,
  UpdateFilter,
  WithId,
} from 'mongodb';



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
  private bucketName: string;

  constructor(collectionName: string, bucketName: string = 'attachments') {
    this.collectionName = collectionName;
    this.bucketName = bucketName;
  }

  async getCollection() {
    const client = await clientPromise;
    const db = client.db();
    return db.collection<T>(this.collectionName);
  }

  async getBucket() {
    const client = await clientPromise;
    const db = client.db();
    return new GridFSBucket(db, { bucketName: this.bucketName });
  }

  async uploadToBucket(filename: string, mimeType: string, data: string): Promise<ObjectId> {
    const bucket = await this.getBucket();
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { mimeType },
    });

    uploadStream.end(data);

    return new Promise<ObjectId>((resolve, reject) => {
      uploadStream.on('finish', () => {
        console.log(`Uploaded: ${filename}`);
        resolve(uploadStream.id as ObjectId);
      });

      uploadStream.on('error', err => {
        console.error(`Upload failed: ${filename}`, err);
        reject(err);
      });
    });
  }

  // Insert a new document
  async insert(document: OptionalUnlessRequiredId<T>, userId: ObjectId | string): Promise<ObjectId | undefined> {
    document.createdAt = new Date();
    document.updatedAt = new Date();
    document.createdBy = new ObjectId(userId);
    document.updatedBy = new ObjectId(userId);
    document.accessibleBy = [new ObjectId(userId)];
    const collection = await this.getCollection();
    const result = await collection.insertOne(document);
    return result.insertedId;
  }

  // Check if a document exists with given filter
  async exists(filter: Filter<T>): Promise<boolean> {
    const collection = await this.getCollection();
    const count = await collection.countDocuments({
      ...filter,
      isDeleted: { $ne: true },
    });
    return count > 0;
  }

  // Find a document by ID
  async findById(id: string): Promise<WithId<T> | null> {
    const collection = await this.getCollection();
    return collection.findOne({
      _id: new ObjectId(id),
      isDeleted: { $ne: true },
    } as Filter<T>);
  }

  // Find all documents with optional filter
  async find(filter: Filter<T> = {}): Promise<WithId<T>[]> {
    const collection = await this.getCollection();
    return collection.find(filter as Filter<T>).toArray();
  }

  // Update a document by ID
  async updateById(id: string | ObjectId, updatedData: Partial<T>, userId?: ObjectId): Promise<boolean> {
    updatedData.updatedAt = new Date();
    if (userId) {
      updatedData.updatedBy = userId;
    }
    const collection = await this.getCollection();
    const result = await collection.updateOne({ _id: new ObjectId(id) } as Filter<T>, { $set: updatedData });
    return result.modifiedCount > 0;
  }

  // Update a document by ID
  async updateOne(filter: Filter<T>, updatedData: Document[] | UpdateFilter<T>): Promise<boolean> {
    const collection = await this.getCollection();
    const result = await collection.updateOne(filter as Filter<T>, updatedData);
    return result.modifiedCount > 0;
  }

  // Delete a document by ID
  async deleteById(id: string): Promise<boolean> {
    return this.updateById(id, { isDeleted: true } as Partial<T>);
  }

  // List all documents with optional sorting and pagination
  async list(filter: Filter<T> = {}, limit = 10, skip = 0, sort: Sort = {}): Promise<WithId<T>[]> {
    const collection = await this.getCollection();
    return collection
      .find({ ...filter, isDeleted: { $ne: true } })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
  }

  // Get paginated results with metadata
  async paginate(filter: Filter<T> = {}, page = 1, itemsPerPage = 10, sort: Sort = {}): Promise<PaginatedResult<T>> {
    const collection = await this.getCollection();
    // Ensure page is at least 1
    page = Math.max(1, page);

    // Add isDeleted filter
    const finalFilter = { ...filter, isDeleted: { $ne: true } };

    // Calculate skip value
    const skip = (page - 1) * itemsPerPage;

    // Execute queries in parallel
    const [data, totalItems] = await Promise.all([
      this.list(finalFilter, itemsPerPage, skip, sort),
      collection.countDocuments(finalFilter),
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
    const client = await clientPromise;
    const session = client.startSession();
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
