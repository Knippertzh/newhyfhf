import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!process.env.DISHBRAIN_MONGODB_URI) {
  throw new Error('Please define the DISHBRAIN_MONGODB_URI environment variable');
}

const uri = process.env.DISHBRAIN_MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

// Helper function to get the dishbrain database
export async function getDishbrainDb() {
  const client = await clientPromise;
  return client.db('dishbrain');
}

// Helper function to get the experts collection
export async function getExpertsCollection() {
  const db = await getDishbrainDb();
  return db.collection('expert');
}

// Helper function to get the companies collection
export async function getCompaniesCollection() {
  const db = await getDishbrainDb();
  return db.collection('companies');
}

// Helper function to get the saved news collection
export async function getNewsCollection() {
  const db = await getDishbrainDb();
  return db.collection('saved_news');
}

// Standardize MongoDB document for frontend
export function standardizeDocument(doc: any) {
  if (!doc) return null;
  
  const standardized = { ...doc };
  
  // Convert ObjectId to string
  if (doc._id && typeof doc._id === 'object') {
    standardized._id = doc._id.toString();
  }
  
  // Convert dates to ISO strings
  Object.keys(standardized).forEach(key => {
    if (standardized[key] instanceof Date) {
      standardized[key] = standardized[key].toISOString();
    }
  });
  
  // Ensure arrays exist for array fields
  const arrayFields = ['specializations', 'education', 'publications', 'projects'];
  arrayFields.forEach(field => {
    if (!standardized[field]) {
      standardized[field] = [];
    }
  });
  
  return standardized;
}
