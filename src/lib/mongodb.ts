import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

let db: Db;
let client: MongoClient;

export const connectClient = async () => {
  if (client) return client; // Return existing connection
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB Client!');
    return client;
  } catch (error) {
    console.error('Error connecting to MongoDB Client:', error);
    throw error;
  }
};

export const connectToDatabase = async () => {
  if (db) return db; // Return existing connection

  try {
    const client = await connectClient();
    db = client.db();
    console.log('Connected to MongoDB!', db.databaseName);
    return db;
  } catch (error) {
    console.error('Error connecting to MongoDB:', db.databaseName, error);
    throw error;
  }
};

export const isConnected = async () => {
  const db = await connectToDatabase();
  const result = await db.command({ ping: 1 });
  console.log('isConnected', result);
  return result;
};

isConnected();
